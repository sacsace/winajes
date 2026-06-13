import type { ProjectCategory } from '@winajes/shared';

export type ProjectInput = {
  slug?: string;
  name: { ko: string; en: string };
  client: string;
  location: string;
  completionYear: number;
  scope: { ko: string; en: string };
  description: { ko: string; en: string };
  category: ProjectCategory | string;
  industry: string;
  status?: 'completed' | 'ongoing' | 'planned';
  images?: string[];
  featured?: boolean;
};

export type ProjectRecord = ProjectInput & {
  id: string;
  slug: string;
  status: string;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};
