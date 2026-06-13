import { NextRequest, NextResponse } from 'next/server';
import {
  createConstructionRecord,
  listConstructionRecords,
} from '@/lib/cms/construction-records.service';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const yearRaw = searchParams.get('year');
  const client = searchParams.get('client') ?? undefined;
  const pageRaw = searchParams.get('page');
  const limitRaw = searchParams.get('limit');

  const result = await listConstructionRecords({
    year: yearRaw ? Number(yearRaw) : undefined,
    client,
    page: pageRaw ? Number(pageRaw) : undefined,
    limit: limitRaw ? Number(limitRaw) : undefined,
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const record = await createConstructionRecord(body);
  return NextResponse.json(record, { status: 201 });
}
