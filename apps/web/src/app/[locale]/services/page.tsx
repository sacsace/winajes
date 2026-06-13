import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import ServicesPageClient from './ServicesPageClient';
import { generateStaticPageMetadata } from '@/lib/seo/page-metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateStaticPageMetadata(locale, 'services');
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPageClient />;
}
