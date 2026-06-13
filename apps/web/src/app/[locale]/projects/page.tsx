import { setRequestLocale } from 'next-intl/server';
import ProjectsPageClient from './ProjectsPageClient';

type Props = { params: Promise<{ locale: string }> };

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectsPageClient />;
}
