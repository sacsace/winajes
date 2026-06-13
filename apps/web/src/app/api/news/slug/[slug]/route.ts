import { NextResponse } from 'next/server';
import { getNewsBySlug } from '@/lib/cms/news.service';

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(article);
}
