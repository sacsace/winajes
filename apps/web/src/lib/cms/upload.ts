import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MAX_BYTES = 8 * 1024 * 1024;

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

/** Save multipart `file` under public/uploads/{folder}. Avoids fragile `instanceof File`. */
export async function handleImageUpload(request: NextRequest, folder: string) {
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

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);

  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    const ext = resolveExtension(file);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadsDir, filename), buffer);
    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } catch (error) {
    console.error(`[upload] write failed (${folder})`, error);
    return NextResponse.json(
      { message: 'Failed to save file on server' },
      { status: 500 },
    );
  }
}
