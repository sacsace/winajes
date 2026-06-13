import { NextRequest, NextResponse } from 'next/server';
import { deleteClient, getClient, updateClient } from '@/lib/cms/clients.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) {
    return NextResponse.json({ message: 'Client not found' }, { status: 404 });
  }
  return NextResponse.json(client);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const client = await updateClient(id, body);
  if (!client) {
    return NextResponse.json({ message: 'Client not found' }, { status: 404 });
  }
  return NextResponse.json(client);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = await deleteClient(id);
  if (!ok) {
    return NextResponse.json({ message: 'Client not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
