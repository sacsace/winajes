/**
 * PostgreSQL setup + CMS migration.
 *   npm run db:init     — create role/DB + schema + seed (needs POSTGRES_ADMIN_PASSWORD)
 *   npm run db:migrate  — schema + seed only (uses DATABASE_URL)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const webRoot = path.join(root, 'apps', 'web');
const dataDir = path.join(webRoot, 'data', 'cms');
const migrateOnly = process.argv.includes('--migrate-only');

function loadEnvFile() {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }

  const localEnvPath = path.join(webRoot, '.env.local');
  if (fs.existsSync(localEnvPath)) {
    for (const line of fs.readFileSync(localEnvPath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

function getConfig() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (databaseUrl) {
    const parsed = new URL(databaseUrl);
    return {
      databaseUrl,
      dbUser: decodeURIComponent(parsed.username),
      dbPassword: decodeURIComponent(parsed.password),
      dbName: parsed.pathname.replace(/^\//, ''),
      pgHost: parsed.hostname || 'localhost',
      pgPort: Number(parsed.port || '5432'),
    };
  }

  return {
    databaseUrl: undefined,
    dbUser: process.env.DB_USER || 'winajes',
    dbPassword: process.env.DB_PASSWORD || 'winajes_dev_password',
    dbName: process.env.DB_NAME || 'winajes',
    pgHost: process.env.PGHOST || 'localhost',
    pgPort: Number(process.env.PGPORT || '5432'),
  };
}

async function ensureRoleAndDatabase(config, adminPassword) {
  const admin = new Client({
    host: config.pgHost,
    port: config.pgPort,
    user: 'postgres',
    password: adminPassword,
    database: 'postgres',
  });

  await admin.connect();
  try {
    const roleExists = await admin.query(
      'SELECT 1 FROM pg_roles WHERE rolname = $1',
      [config.dbUser],
    );
    if (roleExists.rowCount === 0) {
      await admin.query(
        `CREATE ROLE ${config.dbUser} LOGIN PASSWORD '${config.dbPassword.replace(/'/g, "''")}'`,
      );
      console.log(`Created role: ${config.dbUser}`);
    } else {
      await admin.query(
        `ALTER ROLE ${config.dbUser} WITH LOGIN PASSWORD '${config.dbPassword.replace(/'/g, "''")}'`,
      );
      console.log(`Updated password for role: ${config.dbUser}`);
    }

    const dbExists = await admin.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [config.dbName],
    );
    if (dbExists.rowCount === 0) {
      await admin.query(`CREATE DATABASE ${config.dbName} OWNER ${config.dbUser}`);
      console.log(`Created database: ${config.dbName}`);
    } else {
      console.log(`Database already exists: ${config.dbName}`);
    }

    await admin.query(`GRANT ALL PRIVILEGES ON DATABASE ${config.dbName} TO ${config.dbUser}`);
  } finally {
    await admin.end();
  }
}

async function ensureSchemaAndSeed(config) {
  const connectionString =
    config.databaseUrl ||
    `postgresql://${encodeURIComponent(config.dbUser)}:${encodeURIComponent(config.dbPassword)}@${config.pgHost}:${config.pgPort}/${config.dbName}`;

  const app = new Client({ connectionString });
  await app.connect();
  try {
    await app.query(`
      CREATE TABLE IF NOT EXISTS cms_items (
        collection TEXT NOT NULL,
        id TEXT NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (collection, id)
      );
    `);
    await app.query(`
      CREATE INDEX IF NOT EXISTS cms_items_collection_idx ON cms_items (collection);
    `);
    console.log('Schema ready: cms_items');

    const { rows } = await app.query('SELECT COUNT(*)::text AS count FROM cms_items');
    if (Number(rows[0]?.count ?? 0) > 0) {
      console.log(`Seed skipped (${rows[0].count} rows already in cms_items)`);
      return;
    }

    const collections = [
      'projects',
      'clients',
      'construction-records',
      'inquiries',
      'analytics',
      'news',
      'services',
      'team',
    ];

    let total = 0;
    for (const name of collections) {
      const filePath = path.join(dataDir, `${name}.json`);
      if (!fs.existsSync(filePath)) continue;
      const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(items) || items.length === 0) continue;

      await app.query('BEGIN');
      try {
        for (const item of items) {
          const id = String(item.id ?? `${name}-${Date.now()}`);
          const createdAt = String(item.createdAt ?? new Date().toISOString());
          const updatedAt = String(item.updatedAt ?? createdAt);
          await app.query(
            `INSERT INTO cms_items (collection, id, data, created_at, updated_at)
             VALUES ($1, $2, $3::jsonb, $4, $5)
             ON CONFLICT (collection, id) DO NOTHING`,
            [name, id, JSON.stringify(item), createdAt, updatedAt],
          );
        }
        await app.query('COMMIT');
        total += items.length;
        console.log(`Seeded ${items.length} items → ${name}`);
      } catch (error) {
        await app.query('ROLLBACK');
        throw error;
      }
    }
    console.log(`Seed complete (${total} rows)`);
  } finally {
    await app.end();
  }
}

async function main() {
  loadEnvFile();

  if (!fs.existsSync(path.join(root, '.env'))) {
    fs.copyFileSync(path.join(root, '.env.example'), path.join(root, '.env'));
    loadEnvFile();
    console.log('Created .env from .env.example');
  }

  const config = getConfig();
  console.log(`PostgreSQL ${config.pgHost}:${config.pgPort} → database "${config.dbName}"`);

  if (!migrateOnly) {
    const adminPassword = process.env.POSTGRES_ADMIN_PASSWORD?.trim();
    if (!adminPassword) {
      console.error('[ERROR] .env에 POSTGRES_ADMIN_PASSWORD(postgres 슈퍼유저 비밀번호)를 설정한 뒤 다시 실행하세요.');
      process.exit(1);
    }
    await ensureRoleAndDatabase(config, adminPassword);
  }

  await ensureSchemaAndSeed(config);

  console.log('');
  console.log('Done. Check: http://localhost:3000/api/health');
}

main().catch((error) => {
  console.error('[ERROR]', error.message);
  process.exit(1);
});
