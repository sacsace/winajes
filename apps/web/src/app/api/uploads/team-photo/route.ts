import { NextRequest } from 'next/server';
import { handleImageUpload } from '@/lib/cms/upload';

export const runtime = 'nodejs';

/** @deprecated Prefer /api/media/upload?folder=team */
export async function POST(request: NextRequest) {
  return handleImageUpload(request, 'team');
}
