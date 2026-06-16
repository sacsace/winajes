import { NextRequest, NextResponse } from 'next/server';
import { changeAdminPassword } from '@/lib/cms/admin-auth.service';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const currentPassword = String(body.currentPassword ?? '');
  const newPassword = String(body.newPassword ?? '');

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const result = await changeAdminPassword(currentPassword, newPassword);
  if (!result.ok) {
    const status = result.error === 'invalid_current' ? 401 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ success: true });
}
