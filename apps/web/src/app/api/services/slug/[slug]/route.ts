import { NextResponse } from 'next/server';
import { getServiceBySlug } from '@/lib/cms/services.service';

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(service);
}
