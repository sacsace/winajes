import { ensureCmsSeeded } from '@/lib/cms/seed';
import type { ApiTeamMember } from '@/lib/team';
import { newId, nowIso, readCollection, writeCollection } from '@/lib/cms/store';

type TeamRecord = ApiTeamMember & { createdAt: string; updatedAt: string };

export type TeamMemberInput = {
  name: string;
  role: { ko: string; en: string };
  department?: { ko: string; en: string };
  bio?: { ko: string; en: string };
  photo?: string;
  phone?: string;
  email?: string;
  order?: number;
};

function stripTimestamps(record: TeamRecord): ApiTeamMember {
  const { createdAt, updatedAt, ...member } = record;
  return member;
}

export async function listTeamMembers() {
  await ensureCmsSeeded();
  const items = await readCollection<TeamRecord>('team');
  return items
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map(stripTimestamps);
}

export async function getTeamMember(id: string) {
  await ensureCmsSeeded();
  const record = (await readCollection<TeamRecord>('team')).find((m) => m.id === id);
  return record ? stripTimestamps(record) : null;
}

export async function createTeamMember(data: TeamMemberInput) {
  await ensureCmsSeeded();
  const items = await readCollection<TeamRecord>('team');
  const record: TeamRecord = {
    id: newId('team'),
    name: data.name.trim(),
    role: data.role,
    department: data.department ?? { ko: '', en: '' },
    bio: data.bio ?? { ko: '', en: '' },
    photo: data.photo ?? '',
    phone: data.phone?.trim() ?? '',
    email: data.email?.trim() ?? '',
    order: data.order ?? items.length,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  items.push(record);
  await writeCollection('team', items);
  return stripTimestamps(record);
}

export async function updateTeamMember(id: string, data: Partial<TeamMemberInput>) {
  await ensureCmsSeeded();
  const items = await readCollection<TeamRecord>('team');
  const index = items.findIndex((m) => m.id === id);
  if (index < 0) return null;

  const current = items[index];
  items[index] = {
    ...current,
    name: data.name?.trim() ?? current.name,
    role: data.role ?? current.role,
    department: data.department ?? current.department,
    bio: data.bio ?? current.bio,
    photo: data.photo ?? current.photo,
    phone: data.phone?.trim() ?? current.phone,
    email: data.email?.trim() ?? current.email,
    order: data.order ?? current.order,
    updatedAt: nowIso(),
  };
  await writeCollection('team', items);
  return stripTimestamps(items[index]);
}

export async function deleteTeamMember(id: string) {
  await ensureCmsSeeded();
  const items = await readCollection<TeamRecord>('team');
  const next = items.filter((m) => m.id !== id);
  if (next.length === items.length) return false;
  await writeCollection('team', next);
  return true;
}
