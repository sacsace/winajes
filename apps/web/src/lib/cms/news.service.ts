import { ensureCmsSeeded } from '@/lib/cms/seed';
import { newId, nowIso, readCollection, slugify, writeCollection } from '@/lib/cms/store';
import type { NewsArticle } from '@winajes/shared';

type NewsRecord = NewsArticle & { createdAt: string; updatedAt: string };

export type NewsInput = {
  slug?: string;
  title: { ko: string; en: string };
  excerpt: { ko: string; en: string };
  content?: { ko: string; en: string };
  category: string;
  tags?: string[];
  image?: string;
  publishedAt: string;
  seoTitle?: { ko: string; en: string };
  seoDescription?: { ko: string; en: string };
};

function stripTimestamps(record: NewsRecord): NewsArticle {
  const { createdAt, updatedAt, ...article } = record;
  return article;
}

export async function listNews() {
  await ensureCmsSeeded();
  const items = await readCollection<NewsRecord>('news');
  return items
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(stripTimestamps);
}

export async function getNewsById(id: string) {
  await ensureCmsSeeded();
  const record = (await readCollection<NewsRecord>('news')).find((n) => n.id === id);
  return record ? stripTimestamps(record) : null;
}

export async function getNewsBySlug(slug: string) {
  await ensureCmsSeeded();
  const record = (await readCollection<NewsRecord>('news')).find((n) => n.slug === slug);
  return record ? stripTimestamps(record) : null;
}

export async function createNews(data: NewsInput) {
  await ensureCmsSeeded();
  const items = await readCollection<NewsRecord>('news');
  const slug = data.slug?.trim() || slugify(data.title.en || data.title.ko);
  const record: NewsRecord = {
    id: newId('news'),
    slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content ?? { ko: '', en: '' },
    category: data.category.trim(),
    tags: data.tags ?? [],
    image: data.image ?? '',
    publishedAt: data.publishedAt,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  items.push(record);
  await writeCollection('news', items);
  return stripTimestamps(record);
}

export async function updateNews(id: string, data: Partial<NewsInput>) {
  await ensureCmsSeeded();
  const items = await readCollection<NewsRecord>('news');
  const index = items.findIndex((n) => n.id === id);
  if (index < 0) return null;

  const current = items[index];
  items[index] = {
    ...current,
    slug: data.slug?.trim() || current.slug,
    title: data.title ?? current.title,
    excerpt: data.excerpt ?? current.excerpt,
    content: data.content ?? current.content,
    category: data.category?.trim() ?? current.category,
    tags: data.tags ?? current.tags,
    image: data.image ?? current.image,
    publishedAt: data.publishedAt ?? current.publishedAt,
    seoTitle: data.seoTitle ?? current.seoTitle,
    seoDescription: data.seoDescription ?? current.seoDescription,
    updatedAt: nowIso(),
  };
  await writeCollection('news', items);
  return stripTimestamps(items[index]);
}

export async function deleteNews(id: string) {
  await ensureCmsSeeded();
  const items = await readCollection<NewsRecord>('news');
  const next = items.filter((n) => n.id !== id);
  if (next.length === items.length) return false;
  await writeCollection('news', next);
  return true;
}
