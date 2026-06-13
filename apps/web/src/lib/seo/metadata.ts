import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export function localePath(locale: Locale, path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function absoluteUrl(locale: Locale, path: string) {
  return `${getSiteUrl()}${localePath(locale, path)}`;
}

export function buildAlternates(path: string, locale: Locale) {
  const languages: Record<string, string> = {
    ko: absoluteUrl('ko', path),
    en: absoluteUrl('en', path),
    'x-default': absoluteUrl(routing.defaultLocale, path),
  };
  return {
    canonical: absoluteUrl(locale, path),
    languages,
  };
}

const DEFAULT_OG = '/images/hero/hero-slide-1.jpg';

export function buildPageMetadata(options: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string | string[];
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const { locale, path, title, description, keywords, ogImage, noIndex } = options;
  const url = absoluteUrl(locale, path);
  const imagePath = ogImage || DEFAULT_OG;
  const imageUrl = imagePath.startsWith('http') ? imagePath : `${getSiteUrl()}${imagePath}`;
  const keywordList = Array.isArray(keywords)
    ? keywords
    : keywords?.split(',').map((k) => k.trim()).filter(Boolean);

  return {
    title,
    description,
    keywords: keywordList,
    alternates: buildAlternates(path, locale),
    openGraph: {
      type: 'website',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      alternateLocale: locale === 'ko' ? ['en_US'] : ['ko_KR'],
      url,
      title,
      description,
      siteName: 'WINAJES Constructions India',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export const STATIC_SEO_PATHS = [
  '/',
  '/about',
  '/team',
  '/services',
  '/projects',
  '/performance',
  '/clients',
  '/news',
  '/contact',
] as const;

export type SeoPageKey =
  | 'home'
  | 'about'
  | 'team'
  | 'services'
  | 'projects'
  | 'performance'
  | 'clients'
  | 'news'
  | 'contact';

export function seoPathForKey(key: SeoPageKey): string {
  return key === 'home' ? '/' : `/${key}`;
}
