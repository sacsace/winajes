import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';
import { generateStaticPageMetadata } from '@/lib/seo/page-metadata';
import { listTimelineEvents } from '@/lib/cms/timeline.service';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateStaticPageMetadata(locale, 'about');
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const timeline = await listTimelineEvents();
  return <AboutPageClient timeline={timeline} />;
}
