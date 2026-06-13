import { NextRequest, NextResponse } from 'next/server';
import { importConstructionRecords } from '@/lib/cms/construction-records.service';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await importConstructionRecords(body.records ?? [], body.replace ?? false);
  return NextResponse.json(result);
}
