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

/** Neutral fallback only when CMS has no images — never re-inject seed photos after delete. */
export const PROJECT_IMAGE_PLACEHOLDER = '/images/projects/project-1.jpg';

function isBrokenProjectImage(url: string): boolean {
  // Legacy incorrect public path (file never existed under /projects)
  if (url.startsWith('/projects/')) return true;
  return false;
}

export function resolveProjectImage(
  project: Pick<ApiProject, 'images' | 'slug'>,
): string | null {
  const mapped = project.slug ? projectImages[project.slug] : undefined;
  // Prefer curated site photos for known portfolio slugs (avoids bad CMS uploads)
  if (mapped) return mapped;

  const first = project.images?.[0]?.trim();
  if (first && !isBrokenProjectImage(first)) return first;
  return null;
}

export function projectImageOrPlaceholder(
  project: Pick<ApiProject, 'images' | 'slug'>,
): string {
  return resolveProjectImage(project) ?? PROJECT_IMAGE_PLACEHOLDER;
}

export function isApiImage(url: string): boolean {
  return (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/uploads/') ||
    url.startsWith('/api/media/') ||
    url.startsWith('/api/files/')
  );
}
