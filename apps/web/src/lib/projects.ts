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

/** Seed / marketing stock paths — never show these as project photos. */
function isStockOrBrokenProjectImage(url: string): boolean {
  if (url.startsWith('/projects/')) return true;
  if (url.startsWith('/images/projects/')) return true;
  if (url.startsWith('/images/hero/')) return true;
  if (url.startsWith('/images/gallery/')) return true;
  if (url.startsWith('/images/page-heroes/')) return true;
  return false;
}

export function projectGalleryImages(
  project: Pick<ApiProject, 'images'>,
): string[] {
  return (project.images ?? [])
    .map((url) => url?.trim())
    .filter((url): url is string => Boolean(url) && !isStockOrBrokenProjectImage(url));
}

/** Real project photo only — no slug defaults, no stock placeholders. */
export function resolveProjectImage(
  project: Pick<ApiProject, 'images' | 'slug'>,
): string | null {
  return projectGalleryImages(project)[0] ?? null;
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
