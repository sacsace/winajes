import { NextRequest, NextResponse } from 'next/server';
import { createTimelineEvent, listTimelineEvents } from '@/lib/cms/timeline.service';

export async function GET() {
  const items = await listTimelineEvents();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const event = await createTimelineEvent(body);
  return NextResponse.json(event, { status: 201 });
}
