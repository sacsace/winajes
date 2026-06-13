import { NextRequest, NextResponse } from 'next/server';
import { createNews, listNews } from '@/lib/cms/news.service';

export async function GET() {
  const items = await listNews();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const article = await createNews(body);
  return NextResponse.json(article, { status: 201 });
}
