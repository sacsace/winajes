import { NextResponse } from 'next/server';
import { listConstructionYears } from '@/lib/cms/construction-records.service';

export async function GET() {
  const years = await listConstructionYears();
  return NextResponse.json(years);
}
