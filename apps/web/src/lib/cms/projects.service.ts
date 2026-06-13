import { ensureCmsSeeded } from '@/lib/cms/seed';
import { newId, nowIso, readCollection, slugify, writeCollection } from '@/lib/cms/store';
import type { ApiProject } from '@/lib/projects';

type ProjectRecord = ApiProject & { createdAt: string; updatedAt: string };

export type ProjectInput = Omit<ApiProject, 'id'> & { slug?: string };

export async function listProjects(filters?: {
  category?: string;
  year?: number;
  featured?: boolean;
}) {
  await ensureCmsSeeded();
  let items = await readCollection<ProjectRecord>('projects');

  if (filters?.category) {
    items = items.filter((p) => p.category === filters.category);
  }
  if (filters?.year) {
    items = items.filter((p) => p.completionYear === filters.year);
  }
  if (filters?.featured !== undefined) {
    items = items.filter((p) => p.featured === filters.featured);
  }

  return items
    .sort((a, b) => b.completionYear - a.completionYear)
    .map(({ createdAt, updatedAt, ...project }) => project);
}

export async function getProjectBySlug(slug: string) {
  await ensureCmsSeeded();
  const items = await readCollection<ProjectRecord>('projects');
  const project = items.find((p) => p.slug === slug);
  if (!project) return null;
  const { createdAt, updatedAt, ...rest } = project;
  return rest;
}

export async function getProjectById(id: string) {
  await ensureCmsSeeded();
  const items = await readCollection<ProjectRecord>('projects');
  const project = items.find((p) => p.id === id);
  if (!project) return null;
  const { createdAt, updatedAt, ...rest } = project;
  return rest;
}

export async function createProject(data: ProjectInput) {
  await ensureCmsSeeded();
  const items = await readCollection<ProjectRecord>('projects');
  const slug = data.slug?.trim() || slugify(data.name.en || data.name.ko);
  const record: ProjectRecord = {
    id: newId('project'),
    slug,
    name: data.name,
    client: data.client.trim(),
    location: data.location.trim(),
    completionYear: data.completionYear,
    category: data.category,
    scope: data.scope,
    description: data.description,
    industry: data.industry,
    status: data.status,
    images: data.images ?? [],
    featured: data.featured ?? false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  items.push(record);
  await writeCollection('projects', items);
  const { createdAt, updatedAt, ...rest } = record;
  return rest;
}

export async function updateProject(id: string, data: Partial<ProjectInput>) {
  await ensureCmsSeeded();
  const items = await readCollection<ProjectRecord>('projects');
  const index = items.findIndex((p) => p.id === id);
  if (index < 0) return null;

  const existing = items[index];
  const slug = data.slug?.trim() || existing.slug;
  const updated: ProjectRecord = {
    ...existing,
    slug,
    name: data.name ?? existing.name,
    client: data.client?.trim() ?? existing.client,
    location: data.location?.trim() ?? existing.location,
    completionYear: data.completionYear ?? existing.completionYear,
    category: data.category ?? existing.category,
    scope: data.scope ?? existing.scope,
    description: data.description ?? existing.description,
    industry: data.industry ?? existing.industry,
    status: data.status ?? existing.status,
    images: data.images ?? existing.images,
    featured: data.featured ?? existing.featured,
    updatedAt: nowIso(),
  };
  items[index] = updated;
  await writeCollection('projects', items);
  const { createdAt, updatedAt, ...rest } = updated;
  return rest;
}

export async function deleteProject(id: string) {
  await ensureCmsSeeded();
  const items = await readCollection<ProjectRecord>('projects');
  const next = items.filter((p) => p.id !== id);
  if (next.length === items.length) return false;
  await writeCollection('projects', next);
  return true;
}
