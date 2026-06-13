import { NextRequest, NextResponse } from 'next/server';
import { createInquiry, listInquiries } from '@/lib/cms/auth.service';

export async function GET() {
  const items = await listInquiries();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const inquiry = await createInquiry(body);
  return NextResponse.json(inquiry, { status: 201 });
}
