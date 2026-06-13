import { ensureCmsSeeded, type CmsClient } from '@/lib/cms/seed';
import { newId, nowIso, readCollection, writeCollection } from '@/lib/cms/store';
import { formatClientName } from '@/lib/format-client-name';

export type ClientInput = {
  name: string;
  category?: 'brand' | 'entity';
  logo?: string;
  order?: number;
};

export async function listClients(category?: 'brand' | 'entity') {
  await ensureCmsSeeded();
  let items = await readCollection<CmsClient>('clients');
  if (category) items = items.filter((c) => c.category === category);
  return items.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export async function getClient(id: string) {
  await ensureCmsSeeded();
  return (await readCollection<CmsClient>('clients')).find((c) => c.id === id) ?? null;
}

export async function createClient(data: ClientInput) {
  await ensureCmsSeeded();
  const items = await readCollection<CmsClient>('clients');
  const record: CmsClient = {
    id: newId('client'),
    name: formatClientName(data.name),
    category: data.category ?? 'brand',
    logo: data.logo ?? '',
    order: data.order ?? items.length,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  items.push(record);
  await writeCollection('clients', items);
  return record;
}

export async function updateClient(id: string, data: Partial<ClientInput>) {
  await ensureCmsSeeded();
  const items = await readCollection<CmsClient>('clients');
  const index = items.findIndex((c) => c.id === id);
  if (index < 0) return null;

  items[index] = {
    ...items[index],
    name: data.name != null ? formatClientName(data.name) : items[index].name,
    category: data.category ?? items[index].category,
    logo: data.logo ?? items[index].logo,
    order: data.order ?? items[index].order,
    updatedAt: nowIso(),
  };
  await writeCollection('clients', items);
  return items[index];
}

export async function deleteClient(id: string) {
  await ensureCmsSeeded();
  const items = await readCollection<CmsClient>('clients');
  const next = items.filter((c) => c.id !== id);
  if (next.length === items.length) return false;
  await writeCollection('clients', next);
  return true;
}

export async function deleteClientsBulk(ids: string[]) {
  await ensureCmsSeeded();
  const idSet = new Set(ids);
  const items = await readCollection<CmsClient>('clients');
  const next = items.filter((c) => !idSet.has(c.id));
  const deleted = items.length - next.length;
  if (deleted === 0) return { deleted: 0 };
  await writeCollection('clients', next);
  return { deleted };
}

export async function importClients(records: ClientInput[], replace = false) {
  await ensureCmsSeeded();
  const mapped = records.map((r, i) => ({
    id: newId('client'),
    name: formatClientName(r.name),
    category: r.category ?? 'brand',
    logo: r.logo ?? '',
    order: r.order ?? i,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  if (replace) {
    await writeCollection('clients', mapped);
    return { imported: mapped.length };
  }

  const items = await readCollection<CmsClient>('clients');
  items.push(...mapped);
  await writeCollection('clients', items);
  return { imported: mapped.length };
}
