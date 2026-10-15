import { NextRequest, NextResponse } from 'next/server';
import { readUploadedMedia } from '@/lib/cms/upload';

export const runtime = 'nodejs';

type Params = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { folder, filename } = await params;
  const media = await readUploadedMedia(folder, filename);
  if (!media) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(media.data), {
    headers: {
      'Content-Type': media.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
