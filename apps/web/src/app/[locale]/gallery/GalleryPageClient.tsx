'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
import { projects as staticProjects } from '@/lib/data';
import type { ApiProject } from '@/lib/projects';
import { isApiImage } from '@/lib/projects';
import {
  collectProjectGalleryItems,
  type ProjectGalleryItem,
} from '@/lib/project-gallery';
import { galleryHeroImage } from '@/lib/images';
import { API_URL, cn } from '@/lib/utils';

const CATEGORIES = [
  'all',
  'mechanical',
  'electrical',
  'fire-fighting',
  'utility',
  'it-infrastructure',
  'industrial-construction',
] as const;

export default function GalleryPageClient() {
  const t = useTranslations('gallery');
  const tProjects = useTranslations('projects');
  const tHome = useTranslations('home.gallery');
  const locale = useLocale() as 'ko' | 'en';

  const [items, setItems] = useState<ProjectGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((projects: ApiProject[]) => setItems(collectProjectGalleryItems(projects)))
      .catch(() => setItems(collectProjectGalleryItems(staticProjects as ApiProject[])))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (category === 'all' ? items : items.filter((item) => item.category === category)),
    [category, items],
  );

  const categoryLabel = (cat: string) =>
    tProjects(`categories.${cat}` as 'categories.mechanical');

  const openLightbox = (item: ProjectGalleryItem) => {
    const index = filtered.findIndex((entry) => entry.id === item.id);
    setLightboxIndex(index >= 0 ? index : 0);
  };

  return (
    <>
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image={galleryHeroImage}
      />

      <Section>
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                'rounded-md px-3.5 py-2 text-[13px] font-semibold transition-colors',
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-primary',
              )}
            >
              {cat === 'all' ? t('filters.all') : categoryLabel(cat)}
            </button>
          ))}
        </div>

        {!loading && (
          <p className="mb-6 text-sm text-muted-foreground">
            {t('count', { count: filtered.length })}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse bg-muted" />
              ))
            : filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openLightbox(item)}
                  className="img-zoom group relative overflow-hidden text-left"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.src}
                      alt={item.projectName[locale]}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                      unoptimized={isApiImage(item.src)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                    <div className="absolute right-0 bottom-0 left-0 p-4">
                      <p className="text-[12px] font-medium text-white/70">
                        {categoryLabel(item.category)}
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-white">
                        {item.projectName[locale]}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-white/60">{item.client}</p>
                    </div>
                  </div>
                </button>
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">{t('empty')}</p>
        )}
      </Section>

      {lightboxIndex !== null && filtered.length > 0 && (
        <GalleryLightbox
          items={filtered}
          index={lightboxIndex}
          locale={locale}
          categoryLabel={categoryLabel}
          viewProjectLabel={tHome('viewProject')}
          closeLabel={tHome('close')}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}
