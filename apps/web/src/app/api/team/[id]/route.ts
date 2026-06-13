import { NextRequest, NextResponse } from 'next/server';
import { deleteTeamMember, getTeamMember, updateTeamMember } from '@/lib/cms/team.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const member = await getTeamMember(id);
  if (!member) {
    return NextResponse.json({ message: 'Team member not found' }, { status: 404 });
  }
  return NextResponse.json(member);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const member = await updateTeamMember(id, body);
  if (!member) {
    return NextResponse.json({ message: 'Team member not found' }, { status: 404 });
  }
  return NextResponse.json(member);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = await deleteTeamMember(id);
  if (!ok) {
    return NextResponse.json({ message: 'Team member not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
