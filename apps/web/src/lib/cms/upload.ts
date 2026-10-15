import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MAX_BYTES = 8 * 1024 * 1024;

export const UPLOAD_FOLDERS = ['team', 'projects', 'clients', 'news'] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

type UploadBlob = Blob & { name?: string };

function asUploadBlob(value: FormDataEntryValue | null): UploadBlob | null {
  if (!value || typeof value === 'string') return null;
  if (typeof value.arrayBuffer !== 'function') return null;
  return value as UploadBlob;
}

function resolveExtension(file: UploadBlob): string {
  const fromName = path.extname(typeof file.name === 'string' ? file.name : '').toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;

  const mime = file.type || '';
  if (mime.includes('png')) return '.png';
  if (mime.includes('webp')) return '.webp';
  if (mime.includes('gif')) return '.gif';
  if (mime.includes('jpeg') || mime.includes('jpg')) return '.jpg';
  return '.jpg';
}

/** Writable uploads root — prefer data/ (Railway-safe) over public/. */
export function getUploadsRoot() {
  return path.join(process.cwd(), 'data', 'uploads');
}

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

/** Save multipart `file` and return a durable media URL. */
export async function handleImageUpload(request: NextRequest, folder: UploadFolder) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('[upload] formData parse failed', error);
    return NextResponse.json({ message: 'Invalid upload payload' }, { status: 400 });
  }

  const file = asUploadBlob(formData.get('file'));
  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  if (file.size <= 0) {
    return NextResponse.json({ message: 'Empty file' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: 'File too large (max 8MB)' }, { status: 400 });
  }

  const uploadsDir = path.join(getUploadsRoot(), folder);

  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    const ext = resolveExtension(file);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadsDir, filename), buffer);
    return NextResponse.json({ url: `/api/files/${folder}/${filename}` });
  } catch (error) {
    console.error(`[upload] write failed (${folder})`, error);
    return NextResponse.json(
      { message: 'Failed to save file on server' },
      { status: 500 },
    );
  }
}

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export async function readUploadedMedia(folder: string, filename: string) {
  if (!isUploadFolder(folder)) return null;
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return null;
  }

  const filePath = path.join(getUploadsRoot(), folder, filename);
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    return {
      data,
      contentType: CONTENT_TYPES[ext] || 'application/octet-stream',
    };
  } catch {
    return null;
  }
}
