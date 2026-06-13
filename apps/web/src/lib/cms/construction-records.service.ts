import { ensureCmsSeeded, type CmsConstructionRecord } from '@/lib/cms/seed';
import { newId, nowIso, readCollection, writeCollection } from '@/lib/cms/store';

export type ConstructionRecordInput = {
  constructionDate: string;
  client: string;
  description: string;
  amount: number | string;
};

function normalizeAmount(amount: number | string) {
  return String(Math.round(Number(String(amount).replace(/,/g, ''))));
}

export async function listConstructionRecords(filters?: {
  year?: number;
  client?: string;
  page?: number;
  limit?: number;
}) {
  await ensureCmsSeeded();
  let items = await readCollection<CmsConstructionRecord>('construction-records');

  if (filters?.year) {
    items = items.filter((r) => new Date(r.constructionDate).getFullYear() === filters.year);
  }
  if (filters?.client?.trim()) {
    const q = filters.client.trim().toLowerCase();
    items = items.filter((r) => r.client.toLowerCase().includes(q));
  }

  items.sort((a, b) => {
    const dateCmp = b.constructionDate.localeCompare(a.constructionDate);
    return dateCmp !== 0 ? dateCmp : b.createdAt.localeCompare(a.createdAt);
  });

  const page = Math.max(1, filters?.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters?.limit ?? 50));
  const total = items.length;
  const start = (page - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function listConstructionYears() {
  await ensureCmsSeeded();
  const items = await readCollection<CmsConstructionRecord>('construction-records');
  const years = [...new Set(items.map((r) => new Date(r.constructionDate).getFullYear()))]
    .filter(Boolean)
    .sort((a, b) => b - a);
  return years;
}

export async function getConstructionRecord(id: string) {
  await ensureCmsSeeded();
  return (await readCollection<CmsConstructionRecord>('construction-records')).find((r) => r.id === id) ?? null;
}

export async function createConstructionRecord(data: ConstructionRecordInput) {
  await ensureCmsSeeded();
  const items = await readCollection<CmsConstructionRecord>('construction-records');
  const record: CmsConstructionRecord = {
    id: newId('cr'),
    constructionDate: data.constructionDate,
    client: data.client.trim(),
    description: data.description.trim(),
    amount: normalizeAmount(data.amount),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  items.push(record);
  await writeCollection('construction-records', items);
  return record;
}

export async function updateConstructionRecord(id: string, data: Partial<ConstructionRecordInput>) {
  await ensureCmsSeeded();
  const items = await readCollection<CmsConstructionRecord>('construction-records');
  const index = items.findIndex((r) => r.id === id);
  if (index < 0) return null;

  items[index] = {
    ...items[index],
    constructionDate: data.constructionDate ?? items[index].constructionDate,
    client: data.client?.trim() ?? items[index].client,
    description: data.description?.trim() ?? items[index].description,
    amount: data.amount !== undefined ? normalizeAmount(data.amount) : items[index].amount,
    updatedAt: nowIso(),
  };
  await writeCollection('construction-records', items);
  return items[index];
}

export async function deleteConstructionRecord(id: string) {
  await ensureCmsSeeded();
  const items = await readCollection<CmsConstructionRecord>('construction-records');
  const next = items.filter((r) => r.id !== id);
  if (next.length === items.length) return false;
  await writeCollection('construction-records', next);
  return true;
}

export async function importConstructionRecords(records: ConstructionRecordInput[], replace = false) {
  await ensureCmsSeeded();
  const mapped = records.map((r) => ({
    id: newId('cr'),
    constructionDate: r.constructionDate,
    client: r.client.trim(),
    description: r.description.trim(),
    amount: normalizeAmount(r.amount),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  if (replace) {
    await writeCollection('construction-records', mapped);
    return { imported: mapped.length };
  }

  const items = await readCollection<CmsConstructionRecord>('construction-records');
  items.push(...mapped);
  await writeCollection('construction-records', items);
  return { imported: mapped.length };
}
