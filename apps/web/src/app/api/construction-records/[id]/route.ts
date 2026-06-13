import { NextRequest, NextResponse } from 'next/server';
import {
  deleteConstructionRecord,
  getConstructionRecord,
  updateConstructionRecord,
} from '@/lib/cms/construction-records.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const record = await getConstructionRecord(id);
  if (!record) {
    return NextResponse.json({ message: 'Record not found' }, { status: 404 });
  }
  return NextResponse.json(record);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const record = await updateConstructionRecord(id, body);
  if (!record) {
    return NextResponse.json({ message: 'Record not found' }, { status: 404 });
  }
  return NextResponse.json(record);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = await deleteConstructionRecord(id);
  if (!ok) {
    return NextResponse.json({ message: 'Record not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
