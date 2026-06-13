import { NextRequest, NextResponse } from 'next/server';
import {
  createProject,
  listProjects,
} from '@/lib/cms/projects.service';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category') ?? undefined;
  const yearRaw = searchParams.get('year');
  const featuredRaw = searchParams.get('featured');

  const items = await listProjects({
    category: category && category !== 'all' ? category : undefined,
    year: yearRaw && yearRaw !== 'all' ? Number(yearRaw) : undefined,
    featured: featuredRaw !== null ? featuredRaw === 'true' : undefined,
  });

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const project = await createProject(body);
  return NextResponse.json(project, { status: 201 });
}
