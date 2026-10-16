import type { ApiProject } from '@/lib/projects';
import { projectGalleryImages } from '@/lib/projects';

export type ProjectGalleryItem = {
  id: string;
  src: string;
  projectId: string;
  projectSlug: string;
  projectName: { ko: string; en: string };
  category: string;
  client: string;
};

/** Only real uploaded photos — never inject stock/default images. */
export function collectProjectGalleryItems(projects: ApiProject[]): ProjectGalleryItem[] {
  const items: ProjectGalleryItem[] = [];

  for (const project of projects) {
    const images = projectGalleryImages(project);
    if (images.length === 0) continue;

    images.forEach((src, index) => {
      items.push({
        id: `${project.id}-${index}`,
        src,
        projectId: project.id,
        projectSlug: project.slug,
        projectName: project.name,
        category: project.category,
        client: project.client,
      });
    });
  }

  return items;
}

export function shuffleItems<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function pickRandomItems<T>(items: T[], count: number): T[] {
  if (items.length <= count) return shuffleItems(items);
  return shuffleItems(items).slice(0, count);
}
