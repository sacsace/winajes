import { NextRequest, NextResponse } from 'next/server';
import { deleteClientsBulk } from '@/lib/cms/clients.service';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const ids = Array.isArray(body.ids) ? body.ids : [];
  const result = await deleteClientsBulk(ids);
  return NextResponse.json(result);
}
