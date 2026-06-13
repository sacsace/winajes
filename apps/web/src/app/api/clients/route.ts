import { NextRequest, NextResponse } from 'next/server';
import { createClient, listClients } from '@/lib/cms/clients.service';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category') as 'brand' | 'entity' | null;
  const items = await listClients(category ?? undefined);
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const client = await createClient(body);
  return NextResponse.json(client, { status: 201 });
}
