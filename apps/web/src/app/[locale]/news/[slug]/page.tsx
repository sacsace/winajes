import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import NewsDetailClient from './NewsDetailClient';
import { getNewsBySlug } from '@/lib/cms/news.service';
import { buildPageMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: 'News' };

  const loc = locale as Locale;
  const title = article.seoTitle?.[loc] || article.title[loc];
  const description = article.seoDescription?.[loc] || article.excerpt[loc];

  return buildPageMetadata({
    locale: loc,
    path: `/news/${slug}`,
    title,
    description,
    ogImage: article.image,
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <NewsDetailClient slug={slug} />;
}
