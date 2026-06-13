import { NextRequest, NextResponse } from 'next/server';
import {
  deleteTimelineEvent,
  getTimelineEvent,
  updateTimelineEvent,
} from '@/lib/cms/timeline.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const event = await getTimelineEvent(id);
  if (!event) {
    return NextResponse.json({ message: 'Timeline event not found' }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const event = await updateTimelineEvent(id, body);
  if (!event) {
    return NextResponse.json({ message: 'Timeline event not found' }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = await deleteTimelineEvent(id);
  if (!ok) {
    return NextResponse.json({ message: 'Timeline event not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
