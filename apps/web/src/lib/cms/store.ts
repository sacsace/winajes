import fs from 'fs/promises';
import path from 'path';
import { getPool, initDb, isDbEnabled } from '@/lib/cms/db';

export type CmsCollection = 'projects' | 'clients' | 'construction-records' | 'inquiries' | 'analytics' | 'news' | 'services' | 'team';

const DATA_DIR = path.join(process.cwd(), 'data', 'cms');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonCollection<T>(name: CmsCollection): Promise<T[]> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeJsonCollection<T>(name: CmsCollection, data: T[]) {
  await ensureDir();
  await fs.writeFile(
    path.join(DATA_DIR, `${name}.json`),
    JSON.stringify(data, null, 2),
    'utf8',
  );
}

async function readDbCollection<T>(name: CmsCollection): Promise<T[]> {
  await initDb();
  const result = await getPool().query<{ data: T }>(
    'SELECT data FROM cms_items WHERE collection = $1 ORDER BY created_at ASC, id ASC',
    [name],
  );
  return result.rows.map((row) => row.data);
}

async function writeDbCollection<T extends { id?: string; createdAt?: string; updatedAt?: string }>(
  name: CmsCollection,
  data: T[],
) {
  await initDb();
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM cms_items WHERE collection = $1', [name]);
    for (const item of data) {
      const id = String(item.id ?? newId('item'));
      const createdAt = item.createdAt ?? nowIso();
      const updatedAt = item.updatedAt ?? createdAt;
      await client.query(
        `INSERT INTO cms_items (collection, id, data, created_at, updated_at)
         VALUES ($1, $2, $3::jsonb, $4, $5)`,
        [name, id, JSON.stringify({ ...item, id }), createdAt, updatedAt],
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

export async function readCollection<T>(name: CmsCollection): Promise<T[]> {
  if (isDbEnabled()) return readDbCollection<T>(name);
  return readJsonCollection<T>(name);
}

export async function writeCollection<T extends { id?: string; createdAt?: string; updatedAt?: string }>(
  name: CmsCollection,
  data: T[],
) {
  if (isDbEnabled()) {
    await writeDbCollection(name, data);
    return;
  }
  await writeJsonCollection(name, data);
}

export function nowIso() {
  return new Date().toISOString();
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || `item-${Date.now()}`;
}

export function storageMode() {
  return isDbEnabled() ? 'postgres' : 'json';
}
