import fs from 'fs/promises';
import path from 'path';

export type CmsCollection = 'projects' | 'clients' | 'construction-records' | 'inquiries' | 'analytics' | 'news' | 'services' | 'team';

const DATA_DIR = path.join(process.cwd(), 'data', 'cms');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readCollection<T>(name: CmsCollection): Promise<T[]> {
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

export async function writeCollection<T>(name: CmsCollection, data: T[]) {
  await ensureDir();
  await fs.writeFile(
    path.join(DATA_DIR, `${name}.json`),
    JSON.stringify(data, null, 2),
    'utf8',
  );
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
