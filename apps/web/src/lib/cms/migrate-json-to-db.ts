import fs from 'fs/promises';
import path from 'path';
import { getPool, initDb, isDbEnabled } from '@/lib/cms/db';
import type { CmsCollection } from '@/lib/cms/store';

const DATA_DIR = path.join(process.cwd(), 'data', 'cms');

async function readJsonCollection<T>(name: CmsCollection): Promise<T[]> {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export async function migrateJsonToDbIfNeeded() {
  if (!isDbEnabled()) return;

  await initDb();
  const pool = getPool();
  const { rows } = await pool.query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM cms_items',
  );
  if (Number(rows[0]?.count ?? 0) > 0) return;

  const collections: CmsCollection[] = [
    'projects',
    'clients',
    'construction-records',
    'inquiries',
    'analytics',
    'news',
    'services',
    'team',
  ];

  for (const name of collections) {
    const items = await readJsonCollection<Record<string, unknown>>(name);
    if (items.length === 0) continue;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        const id = String(item.id ?? `${name}-${Date.now()}`);
        const createdAt = String(item.createdAt ?? new Date().toISOString());
        const updatedAt = String(item.updatedAt ?? createdAt);
        await client.query(
          `INSERT INTO cms_items (collection, id, data, created_at, updated_at)
           VALUES ($1, $2, $3::jsonb, $4, $5)
           ON CONFLICT (collection, id) DO NOTHING`,
          [name, id, JSON.stringify(item), createdAt, updatedAt],
        );
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
