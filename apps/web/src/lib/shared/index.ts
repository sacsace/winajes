export type Locale = 'ko' | 'en';

export type UserRole = 'admin' | 'editor' | 'marketing';

export interface LocalizedText {
  ko: string;
  en: string;
}

export interface Project {
  id: string;
  slug: string;
  name: LocalizedText;
  client: string;
  location: string;
  completionYear: number;
  scope: LocalizedText;
  description: LocalizedText;
  category: ProjectCategory;
  industry: string;
  status: 'completed' | 'ongoing' | 'planned';
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectCategory =
  | 'mechanical'
  | 'electrical'
  | 'fire-fighting'
  | 'utility'
  | 'it-infrastructure'
  | 'industrial-construction';

export interface Service {
  id: string;
  slug: string;
  title: LocalizedText;
  overview: LocalizedText;
  process: LocalizedText[];
  capabilities: LocalizedText[];
  icon: string;
  gallery: string[];
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  category: 'brand' | 'entity';
  order: number;
  createdAt?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  category: string;
  tags: string[];
  image: string;
  publishedAt: string;
  seoTitle?: LocalizedText;
  seoDescription?: LocalizedText;
}

export interface Inquiry {
  id: string;
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  status: 'new' | 'in-progress' | 'completed' | 'closed';
  createdAt: string;
}

export interface ConstructionRecord {
  id: string;
  constructionDate: string;
  client: string;
  description: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConstructionRecordsPage {
  items: ConstructionRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CompanyInfo {
  name: LocalizedText;
  tagline: LocalizedText;
  established: number;
  ceoMessage: {
    photo: string;
    message: LocalizedText;
    signature: string;
  };
  vision: LocalizedText;
  mission: LocalizedText[];
  offices: Office[];
  stats: {
    yearsExperience: number;
    projectsCompleted: number;
    clientsServed: number;
    engineers: number;
  };
}

export interface Office {
  id: string;
  name: LocalizedText;
  address: LocalizedText;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  isHeadquarters: boolean;
}

export interface TimelineMilestone {
  id: string;
  year: number;
  title: LocalizedText;
  description: LocalizedText;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  content: LocalizedText;
  photo?: string;
}

export interface SeoMeta {
  page: string;
  locale: Locale;
  title: string;
  description: string;
  ogImage?: string;
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'mechanical',
  'electrical',
  'fire-fighting',
  'utility',
  'it-infrastructure',
  'industrial-construction',
];

export const LOCALES: Locale[] = ['ko', 'en'];
export const DEFAULT_LOCALE: Locale = 'ko';
