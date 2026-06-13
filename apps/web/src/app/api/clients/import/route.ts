import { NextRequest, NextResponse } from 'next/server';
import { importClients } from '@/lib/cms/clients.service';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await importClients(body.clients ?? body.records ?? [], body.replace ?? false);
  return NextResponse.json(result);
}
