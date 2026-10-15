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
export const PROJECT_IMAGE_PLACEHOLDER = '/images/hero/hero-1.jpg';

export function resolveProjectImage(project: Pick<ApiProject, 'images'>): string | null {
  const first = project.images?.[0]?.trim();
  return first || null;
}

export function projectImageOrPlaceholder(project: Pick<ApiProject, 'images'>): string {
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
