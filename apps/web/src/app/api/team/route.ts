import { NextRequest, NextResponse } from 'next/server';
import { createTeamMember, listTeamMembers } from '@/lib/cms/team.service';

export async function GET() {
  const items = await listTeamMembers();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const member = await createTeamMember(body);
  return NextResponse.json(member, { status: 201 });
}
