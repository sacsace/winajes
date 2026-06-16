import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/cms/auth.service';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await loginAdmin(body.email, body.password);
  if (!result) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  return NextResponse.json(result);
}
