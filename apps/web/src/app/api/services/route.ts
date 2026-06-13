import { NextRequest, NextResponse } from 'next/server';
import { createService, listServices } from '@/lib/cms/services.service';

export async function GET() {
  const items = await listServices();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const service = await createService(body);
  return NextResponse.json(service, { status: 201 });
}
