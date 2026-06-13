import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import {
  buildPageMetadata,
  seoPathForKey,
  type SeoPageKey,
} from '@/lib/seo/metadata';
import type { Locale } from '@/i18n/routing';

export async function generateStaticPageMetadata(
  locale: string,
  pageKey: SeoPageKey,
): Promise<Metadata> {
  const loc = locale as Locale;
  const seo = await getTranslations({ locale, namespace: `seo.${pageKey}` });

  return buildPageMetadata({
    locale: loc,
    path: seoPathForKey(pageKey),
    title: seo('title'),
    description: seo('description'),
    keywords: seo('keywords'),
  });
}
