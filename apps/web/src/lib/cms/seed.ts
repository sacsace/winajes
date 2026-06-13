import { clientEntities, clientLogos, newsArticles, projects, services } from '@/lib/data';
import { projectImages } from '@/lib/images';
import { CONSTRUCTION_RECORDS_SEED } from '@/lib/cms/seeds/construction-records';
import { initDb, isDbEnabled } from '@/lib/cms/db';
import { migrateJsonToDbIfNeeded } from '@/lib/cms/migrate-json-to-db';
import { newId, nowIso, readCollection, writeCollection } from '@/lib/cms/store';
import type { ApiProject } from '@/lib/projects';
import {
  DEFAULT_SERVICE_CAPABILITIES,
  DEFAULT_SERVICE_PROCESS,
  type ApiService,
} from '@/lib/services';
import { DEFAULT_TEAM_SEED, type ApiTeamMember } from '@/lib/team';
import type { NewsArticle } from '@/lib/shared';

export type CmsClient = {
  id: string;
  name: string;
  category: 'brand' | 'entity';
  logo: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type CmsConstructionRecord = {
  id: string;
  constructionDate: string;
  client: string;
  description: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsInquiry = {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  projectType?: string;
  message?: string;
  status: string;
  createdAt: string;
};

type Timed = { createdAt: string; updatedAt: string };

export async function ensureCmsSeeded() {
  if (isDbEnabled()) {
    await initDb();
    await migrateJsonToDbIfNeeded();
  }

  await Promise.all([
    seedProjectsIfEmpty(),
    seedClientsIfEmpty(),
    seedConstructionRecordsIfEmpty(),
    seedNewsIfEmpty(),
    seedServicesIfEmpty(),
    seedTeamIfEmpty(),
  ]);
}

async function seedProjectsIfEmpty() {
  const existing = await readCollection<ApiProject & Timed>('projects');
  if (existing.length > 0) return;

  const seeded = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    client: p.client,
    location: p.location,
    completionYear: p.completionYear,
    category: p.category,
    scope: p.scope,
    description: p.description,
    industry: p.industry,
    status: p.status,
    images: [projectImages[p.slug] || '/images/hero/hero-1.jpg'],
    featured: p.featured,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  await writeCollection('projects', seeded);
}

async function seedClientsIfEmpty() {
  const existing = await readCollection<CmsClient>('clients');
  if (existing.length > 0) return;

  const brands: CmsClient[] = clientLogos.map((c, i) => ({
    id: newId('brand'),
    name: c.name,
    category: 'brand',
    logo: '',
    order: i,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  const entities: CmsClient[] = clientEntities.map((name, i) => ({
    id: newId('entity'),
    name,
    category: 'entity',
    logo: '',
    order: i,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  await writeCollection('clients', [...brands, ...entities]);
}

async function seedConstructionRecordsIfEmpty() {
  const existing = await readCollection<CmsConstructionRecord>('construction-records');
  if (existing.length > 0) return;

  const seeded = CONSTRUCTION_RECORDS_SEED.map((r) => ({
    id: newId('cr'),
    constructionDate: r.constructionDate,
    client: r.client,
    description: r.description,
    amount: String(r.amount),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  await writeCollection('construction-records', seeded);
}

async function seedNewsIfEmpty() {
  const existing = await readCollection<NewsArticle & Timed>('news');
  if (existing.length > 0) return;

  const seeded = newsArticles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: { ko: a.excerpt.ko, en: a.excerpt.en },
    category: a.category,
    tags: a.tags,
    image: a.image,
    publishedAt: a.publishedAt,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  await writeCollection('news', seeded);
}

async function seedServicesIfEmpty() {
  const existing = await readCollection<ApiService & Timed>('services');
  if (existing.length > 0) return;

  const seeded = services.map((s, i) => ({
    id: newId('service'),
    slug: s.slug,
    icon: s.icon,
    title: s.title,
    overview: s.overview,
    process: DEFAULT_SERVICE_PROCESS,
    capabilities: DEFAULT_SERVICE_CAPABILITIES,
    order: i,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  await writeCollection('services', seeded);
}

async function seedTeamIfEmpty() {
  const existing = await readCollection<ApiTeamMember & Timed>('team');
  if (existing.length > 0) return;

  const seeded = DEFAULT_TEAM_SEED.map((member) => ({
    ...member,
    id: newId('team'),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  await writeCollection('team', seeded);
}
