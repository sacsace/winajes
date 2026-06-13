import { Pool } from 'pg';

let pool: Pool | null = null;
let schemaReady = false;

export function isDbEnabled() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getPool() {
  if (!isDbEnabled()) {
    throw new Error('DATABASE_URL is not configured');
  }

  if (!pool) {
    const connectionString = process.env.DATABASE_URL!;
    const useSsl =
      process.env.PGSSLMODE === 'require' ||
      process.env.NODE_ENV === 'production' ||
      connectionString.includes('railway.app') ||
      connectionString.includes('rlwy.net');

    pool = new Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      max: 10,
    });
  }

  return pool;
}

export async function initDb() {
  if (!isDbEnabled() || schemaReady) return;

  const client = await getPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_items (
        collection TEXT NOT NULL,
        id TEXT NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (collection, id)
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS cms_items_collection_idx ON cms_items (collection);
    `);
    schemaReady = true;
  } finally {
    client.release();
  }
}

export async function dbHealthCheck() {
  if (!isDbEnabled()) return { ok: false, mode: 'json' as const };
  await initDb();
  await getPool().query('SELECT 1');
  return { ok: true, mode: 'postgres' as const };
}
