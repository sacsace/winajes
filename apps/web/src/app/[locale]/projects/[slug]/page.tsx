import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import ProjectDetailClient from './ProjectDetailClient';
import { getProjectBySlug } from '@/lib/cms/projects.service';
import { buildPageMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project' };

  const loc = locale as Locale;
  return buildPageMetadata({
    locale: loc,
    path: `/projects/${slug}`,
    title: project.name[loc],
    description: project.description[loc],
    ogImage: project.images?.[0],
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <ProjectDetailClient slug={slug} />;
}
