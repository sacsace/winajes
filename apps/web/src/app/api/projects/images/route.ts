import { NextRequest } from 'next/server';
import { handleImageUpload } from '@/lib/cms/upload';

export const runtime = 'nodejs';

/** Project image upload — nested under /api/projects so it ships with the projects API. */
export async function POST(request: NextRequest) {
  return handleImageUpload(request, 'projects');
}
