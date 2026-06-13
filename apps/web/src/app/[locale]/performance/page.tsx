import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import PerformancePageClient from './PerformancePageClient';
import { generateStaticPageMetadata } from '@/lib/seo/page-metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateStaticPageMetadata(locale, 'performance');
}

export default async function PerformancePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PerformancePageClient />;
}
