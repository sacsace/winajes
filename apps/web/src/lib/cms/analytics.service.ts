import { ensureCmsSeeded } from '@/lib/cms/seed';
import { newId, nowIso, readCollection, writeCollection } from '@/lib/cms/store';

export type PageViewEvent = {
  id: string;
  path: string;
  locale: string;
  referrer: string;
  createdAt: string;
};

const COLLECTION = 'analytics' as const;

async function readEvents(): Promise<PageViewEvent[]> {
  await ensureCmsSeeded();
  return readCollection<PageViewEvent>(COLLECTION);
}

async function writeEvents(events: PageViewEvent[]) {
  await writeCollection(COLLECTION, events);
}

export async function trackPageView(input: {
  path: string;
  locale?: string;
  referrer?: string;
}) {
  const events = await readEvents();
  const event: PageViewEvent = {
    id: newId('pv'),
    path: input.path || '/',
    locale: input.locale || 'ko',
    referrer: input.referrer || '',
    createdAt: nowIso(),
  };
  events.push(event);
  // Keep last 5000 events
  const trimmed = events.length > 5000 ? events.slice(-5000) : events;
  await writeEvents(trimmed);
  return event;
}

function dateKey(iso: string) {
  return iso.slice(0, 10);
}

function lastNDays(n: number) {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export async function getAnalyticsSummary(days = 7) {
  const events = await readEvents();
  const range = lastNDays(days);
  const daily = range.map((day) => ({
    date: day,
    views: events.filter((e) => dateKey(e.createdAt) === day).length,
  }));

  const today = range[range.length - 1];
  const todayViews = daily[daily.length - 1]?.views ?? 0;
  const weekTotal = daily.reduce((sum, d) => sum + d.views, 0);
  const yesterdayViews = daily[daily.length - 2]?.views ?? 0;
  const changePct =
    yesterdayViews > 0
      ? Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100)
      : todayViews > 0
        ? 100
        : 0;

  const pageCounts = new Map<string, number>();
  for (const e of events) {
    if (!range.includes(dateKey(e.createdAt))) continue;
    pageCounts.set(e.path, (pageCounts.get(e.path) ?? 0) + 1);
  }

  const topPages = [...pageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([path, views]) => ({ path, views }));

  const localeCounts = { ko: 0, en: 0, other: 0 };
  for (const e of events) {
    if (!range.includes(dateKey(e.createdAt))) continue;
    if (e.locale === 'ko') localeCounts.ko++;
    else if (e.locale === 'en') localeCounts.en++;
    else localeCounts.other++;
  }

  return {
    daily,
    todayViews,
    weekTotal,
    changePct,
    topPages,
    localeCounts,
    totalEvents: events.length,
  };
}

export async function seedAnalyticsIfEmpty() {
  const events = await readEvents();
  if (events.length > 0) return;

  const paths = ['/ko', '/ko/about', '/ko/projects', '/ko/clients', '/ko/contact', '/en', '/en/projects'];
  const seeded: PageViewEvent[] = [];
  const now = new Date();

  for (let d = 6; d >= 0; d--) {
    const day = new Date(now);
    day.setDate(day.getDate() - d);
    const count = 12 + Math.floor(Math.random() * 28);
    for (let i = 0; i < count; i++) {
      const at = new Date(day);
      at.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));
      seeded.push({
        id: newId('pv'),
        path: paths[Math.floor(Math.random() * paths.length)],
        locale: Math.random() > 0.35 ? 'ko' : 'en',
        referrer: Math.random() > 0.5 ? 'direct' : 'google.com',
        createdAt: at.toISOString(),
      });
    }
  }

  await writeEvents(seeded);
}
