import { createHash, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { getPool, initDb, isDbEnabled } from '@/lib/cms/db';
import { nowIso } from '@/lib/cms/store';

const scryptAsync = promisify(scrypt);

const CONFIG_COLLECTION = 'config';
const CONFIG_ID = 'admin-auth';
const DATA_DIR = path.join(process.cwd(), 'data', 'cms');
const AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json');

export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim() || 'admin@winajes.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim() || 'admin123';
const MIN_PASSWORD_LENGTH = 6;

type AdminAuthConfig = {
  email: string;
  passwordHash: string;
  updatedAt: string;
};

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString('hex')}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const hashBuf = Buffer.from(hash, 'hex');
  if (derived.length !== hashBuf.length) return false;
  return timingSafeEqual(derived, hashBuf);
}

async function readAuthConfig(): Promise<AdminAuthConfig | null> {
  if (isDbEnabled()) {
    await initDb();
    const result = await getPool().query<{ data: AdminAuthConfig }>(
      'SELECT data FROM cms_items WHERE collection = $1 AND id = $2',
      [CONFIG_COLLECTION, CONFIG_ID],
    );
    return result.rows[0]?.data ?? null;
  }

  try {
    const raw = await fs.readFile(AUTH_FILE, 'utf8');
    return JSON.parse(raw) as AdminAuthConfig;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

async function writeAuthConfig(config: AdminAuthConfig) {
  if (isDbEnabled()) {
    await initDb();
    const createdAt = config.updatedAt;
    await getPool().query(
      `INSERT INTO cms_items (collection, id, data, created_at, updated_at)
       VALUES ($1, $2, $3::jsonb, $4, $5)
       ON CONFLICT (collection, id)
       DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at`,
      [CONFIG_COLLECTION, CONFIG_ID, JSON.stringify(config), createdAt, config.updatedAt],
    );
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(AUTH_FILE, JSON.stringify(config, null, 2), 'utf8');
}

async function ensureAdminAuthConfig(): Promise<AdminAuthConfig> {
  const existing = await readAuthConfig();
  if (existing) return existing;

  const config: AdminAuthConfig = {
    email: DEFAULT_ADMIN_EMAIL,
    passwordHash: await hashPassword(DEFAULT_ADMIN_PASSWORD),
    updatedAt: nowIso(),
  };
  await writeAuthConfig(config);
  return config;
}

export function adminAccessToken(email: string) {
  return `local-cms-${createHash('sha256').update(email).digest('hex').slice(0, 24)}`;
}

export async function loginAdmin(email: string, password: string) {
  const config = await ensureAdminAuthConfig();
  const normalizedEmail = email.trim().toLowerCase();
  const configEmail = config.email.trim().toLowerCase();

  if (normalizedEmail !== configEmail) return null;
  if (!(await verifyPassword(password, config.passwordHash))) return null;

  return {
    access_token: adminAccessToken(config.email),
    user: { id: 'admin', email: config.email, role: 'admin', name: 'Admin' },
  };
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  const trimmedNew = newPassword.trim();
  if (trimmedNew.length < MIN_PASSWORD_LENGTH) {
    return { ok: false as const, error: 'too_short' as const };
  }
  if (trimmedNew === currentPassword) {
    return { ok: false as const, error: 'same_password' as const };
  }

  const config = await ensureAdminAuthConfig();
  if (!(await verifyPassword(currentPassword, config.passwordHash))) {
    return { ok: false as const, error: 'invalid_current' as const };
  }

  const next: AdminAuthConfig = {
    ...config,
    passwordHash: await hashPassword(trimmedNew),
    updatedAt: nowIso(),
  };
  await writeAuthConfig(next);
  return { ok: true as const };
}

export async function getAdminEmail() {
  const config = await ensureAdminAuthConfig();
  return config.email;
}
