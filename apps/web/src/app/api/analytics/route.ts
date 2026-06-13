import { NextRequest, NextResponse } from 'next/server';
import {
  getAnalyticsSummary,
  seedAnalyticsIfEmpty,
  trackPageView,
} from '@/lib/cms/analytics.service';

export async function GET() {
  await seedAnalyticsIfEmpty();
  const summary = await getAnalyticsSummary(7);
  return NextResponse.json(summary);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  await trackPageView({
    path: body.path ?? '/',
    locale: body.locale,
    referrer: body.referrer ?? request.headers.get('referer') ?? '',
  });
  return NextResponse.json({ ok: true });
}
