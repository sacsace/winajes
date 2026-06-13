import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import ProjectsPageClient from './ProjectsPageClient';
import { generateStaticPageMetadata } from '@/lib/seo/page-metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateStaticPageMetadata(locale, 'projects');
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectsPageClient />;
}
