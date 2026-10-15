import { NextRequest } from 'next/server';
import { handleImageUpload } from '@/lib/cms/upload';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  return handleImageUpload(request, 'news');
}
