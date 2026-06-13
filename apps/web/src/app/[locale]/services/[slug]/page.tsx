import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import ServiceDetailClient from './ServiceDetailClient';
import { getServiceBySlug } from '@/lib/cms/services.service';
import { buildPageMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: 'Service' };

  const loc = locale as Locale;
  return buildPageMetadata({
    locale: loc,
    path: `/services/${slug}`,
    title: service.title[loc],
    description: service.overview[loc],
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <ServiceDetailClient slug={slug} />;
}
