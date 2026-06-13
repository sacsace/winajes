import { projectImages } from '@/lib/images';

export type ApiProject = {
  id: string;
  slug: string;
  name: { ko: string; en: string };
  client: string;
  location: string;
  completionYear: number;
  scope: { ko: string; en: string };
  description: { ko: string; en: string };
  category: string;
  industry: string;
  status: string;
  images: string[];
  featured: boolean;
};

export function resolveProjectImage(project: Pick<ApiProject, 'slug' | 'images'>): string {
  if (project.images?.[0]) return project.images[0];
  if (project.slug && projectImages[project.slug]) return projectImages[project.slug];
  return '/images/hero/hero-1.jpg';
}

export function isApiImage(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
