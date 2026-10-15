import { NextRequest, NextResponse } from 'next/server';
import { handleImageUpload, isUploadFolder, type UploadFolder } from '@/lib/cms/upload';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const folderParam = request.nextUrl.searchParams.get('folder') || 'projects';
  if (!isUploadFolder(folderParam)) {
    return NextResponse.json({ message: 'Invalid upload folder' }, { status: 400 });
  }
  return handleImageUpload(request, folderParam as UploadFolder);
}
