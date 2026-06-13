import { ensureCmsSeeded } from '@/lib/cms/seed';
import type { ApiTimelineEvent } from '@/lib/timeline';
import { newId, nowIso, readCollection, writeCollection } from '@/lib/cms/store';

type TimelineRecord = ApiTimelineEvent & { createdAt: string; updatedAt: string };

export type TimelineEventInput = {
  year: number;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  order?: number;
};

function stripTimestamps(record: TimelineRecord): ApiTimelineEvent {
  const { createdAt, updatedAt, ...event } = record;
  return event;
}

function sortEvents(items: TimelineRecord[]) {
  return [...items].sort((a, b) => a.order - b.order || a.year - b.year);
}

export async function listTimelineEvents() {
  await ensureCmsSeeded();
  const items = await readCollection<TimelineRecord>('timeline');
  return sortEvents(items).map(stripTimestamps);
}

export async function getTimelineEvent(id: string) {
  await ensureCmsSeeded();
  const record = (await readCollection<TimelineRecord>('timeline')).find((e) => e.id === id);
  return record ? stripTimestamps(record) : null;
}

export async function createTimelineEvent(data: TimelineEventInput) {
  await ensureCmsSeeded();
  const items = await readCollection<TimelineRecord>('timeline');
  const record: TimelineRecord = {
    id: newId('timeline'),
    year: data.year,
    title: data.title,
    description: data.description,
    order: data.order ?? data.year,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  items.push(record);
  await writeCollection('timeline', items);
  return stripTimestamps(record);
}

export async function updateTimelineEvent(id: string, data: Partial<TimelineEventInput>) {
  await ensureCmsSeeded();
  const items = await readCollection<TimelineRecord>('timeline');
  const index = items.findIndex((e) => e.id === id);
  if (index < 0) return null;

  const current = items[index];
  items[index] = {
    ...current,
    year: data.year ?? current.year,
    title: data.title ?? current.title,
    description: data.description ?? current.description,
    order: data.order ?? current.order,
    updatedAt: nowIso(),
  };
  await writeCollection('timeline', items);
  return stripTimestamps(items[index]);
}

export async function deleteTimelineEvent(id: string) {
  await ensureCmsSeeded();
  const items = await readCollection<TimelineRecord>('timeline');
  const next = items.filter((e) => e.id !== id);
  if (next.length === items.length) return false;
  await writeCollection('timeline', next);
  return true;
}
