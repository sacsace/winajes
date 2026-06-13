import { ensureCmsSeeded } from '@/lib/cms/seed';
import {
  DEFAULT_SERVICE_CAPABILITIES,
  DEFAULT_SERVICE_PROCESS,
  normalizeServiceFields,
  type ApiService,
  type ServiceLocalizedItem,
} from '@/lib/services';
import { newId, nowIso, readCollection, slugify, writeCollection } from '@/lib/cms/store';

type ServiceRecord = ApiService & { createdAt: string; updatedAt: string };

export type ServiceInput = {
  slug?: string;
  icon: string;
  title: { ko: string; en: string };
  overview: { ko: string; en: string };
  process?: ServiceLocalizedItem[];
  capabilities?: ServiceLocalizedItem[];
  order?: number;
};

function stripTimestamps(record: ServiceRecord): ApiService {
  const { createdAt, updatedAt, ...service } = record;
  return normalizeServiceFields(service);
}

function cleanItems(items: ServiceLocalizedItem[] | undefined, fallback: ServiceLocalizedItem[]) {
  const cleaned = (items ?? [])
    .map((item) => ({ ko: item.ko.trim(), en: item.en.trim() }))
    .filter((item) => item.ko || item.en);
  return cleaned.length > 0 ? cleaned : fallback;
}

export async function listServices() {
  await ensureCmsSeeded();
  const items = await readCollection<ServiceRecord>('services');
  return items
    .sort((a, b) => a.order - b.order || a.title.ko.localeCompare(b.title.ko))
    .map(stripTimestamps);
}

export async function getServiceById(id: string) {
  await ensureCmsSeeded();
  const record = (await readCollection<ServiceRecord>('services')).find((s) => s.id === id);
  return record ? stripTimestamps(record) : null;
}

export async function getServiceBySlug(slug: string) {
  await ensureCmsSeeded();
  const record = (await readCollection<ServiceRecord>('services')).find((s) => s.slug === slug);
  return record ? stripTimestamps(record) : null;
}

export async function createService(data: ServiceInput) {
  await ensureCmsSeeded();
  const items = await readCollection<ServiceRecord>('services');
  const slug = data.slug?.trim() || slugify(data.title.en || data.title.ko);
  const record: ServiceRecord = {
    id: newId('service'),
    slug,
    icon: data.icon.trim() || 'Wrench',
    title: data.title,
    overview: data.overview,
    process: cleanItems(data.process, DEFAULT_SERVICE_PROCESS),
    capabilities: cleanItems(data.capabilities, DEFAULT_SERVICE_CAPABILITIES),
    order: data.order ?? items.length,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  items.push(record);
  await writeCollection('services', items);
  return stripTimestamps(record);
}

export async function updateService(id: string, data: Partial<ServiceInput>) {
  await ensureCmsSeeded();
  const items = await readCollection<ServiceRecord>('services');
  const index = items.findIndex((s) => s.id === id);
  if (index < 0) return null;

  const current = items[index];
  items[index] = {
    ...current,
    slug: data.slug?.trim() || current.slug,
    icon: data.icon?.trim() ?? current.icon,
    title: data.title ?? current.title,
    overview: data.overview ?? current.overview,
    process: data.process != null ? cleanItems(data.process, DEFAULT_SERVICE_PROCESS) : current.process,
    capabilities:
      data.capabilities != null
        ? cleanItems(data.capabilities, DEFAULT_SERVICE_CAPABILITIES)
        : current.capabilities,
    order: data.order ?? current.order,
    updatedAt: nowIso(),
  };
  await writeCollection('services', items);
  return stripTimestamps(items[index]);
}

export async function deleteService(id: string) {
  await ensureCmsSeeded();
  const items = await readCollection<ServiceRecord>('services');
  const next = items.filter((s) => s.id !== id);
  if (next.length === items.length) return false;
  await writeCollection('services', next);
  return true;
}
