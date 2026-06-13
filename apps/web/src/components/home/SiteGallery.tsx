'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
import { projects as staticProjects } from '@/lib/data';
import type { ApiProject } from '@/lib/projects';
import { isApiImage } from '@/lib/projects';
import {
  collectProjectGalleryItems,
  pickRandomItems,
  type ProjectGalleryItem,
} from '@/lib/project-gallery';
import { API_URL } from '@/lib/utils';
import { cn } from '@/lib/utils';

const PREVIEW_COUNT = 5;

export function SiteGallery() {
  const t = useTranslations('home.gallery');
  const tProjects = useTranslations('projects');
  const locale = useLocale() as 'ko' | 'en';

  const [allItems, setAllItems] = useState<ProjectGalleryItem[]>([]);
  const [previewItems, setPreviewItems] = useState<ProjectGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((projects: ApiProject[]) => {
        const items = collectProjectGalleryItems(projects);
        setAllItems(items);
        setPreviewItems(pickRandomItems(items, PREVIEW_COUNT));
      })
      .catch(() => {
        const items = collectProjectGalleryItems(staticProjects as ApiProject[]);
        setAllItems(items);
        setPreviewItems(pickRandomItems(items, PREVIEW_COUNT));
      })
      .finally(() => setLoading(false));
  }, []);

  const categoryLabel = (category: string) => tProjects(`categories.${category}` as 'categories.mechanical');

  const openLightbox = (item: ProjectGalleryItem) => {
    const index = allItems.findIndex((entry) => entry.id === item.id);
    setLightboxIndex(index >= 0 ? index : 0);
  };

  return (
    <>
      <Section variant="dark" className="relative overflow-hidden">
        <div className="absolute inset-0 dot-grid" />
        <div className="relative">
          <SectionHeader
            label={locale === 'ko' ? '시공 사진' : 'Site Photos'}
            title={t('title')}
            subtitle={t('subtitle')}
            light
            className="mb-12"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'animate-pulse rounded-lg bg-white/10',
                      i === 0 ? 'sm:col-span-2 sm:row-span-2 sm:min-h-[400px]' : 'aspect-[4/3]',
                    )}
                  />
                ))
              : previewItems.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openLightbox(item)}
                    className={cn(
                      'img-zoom group relative overflow-hidden rounded-lg text-left',
                      i === 0 ? 'sm:col-span-2 sm:row-span-2' : '',
                    )}
                  >
                    <div
                      className={cn(
                        'relative',
                        i === 0 ? 'aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-[400px]' : 'aspect-[4/3]',
                      )}
                    >
                      <Image
                        src={item.src}
                        alt={item.projectName[locale]}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes={i === 0 ? '(max-width: 640px) 100vw, 50vw' : '25vw'}
                        unoptimized={isApiImage(item.src)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-transparent" />
                      <div className="absolute right-0 bottom-0 left-0 p-4">
                        <p className="text-xs font-bold tracking-wider text-secondary uppercase">
                          {categoryLabel(item.category)}
                        </p>
                        <p className="mt-1 truncate text-sm font-medium text-white/90">
                          {item.projectName[locale]}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
          </div>

          {!loading && allItems.length > PREVIEW_COUNT && (
            <p className="mt-6 text-center text-sm text-white/50">{t('viewAllHint')}</p>
          )}
        </div>
      </Section>

      {lightboxIndex !== null && allItems.length > 0 && (
        <GalleryLightbox
          items={allItems}
          index={lightboxIndex}
          locale={locale}
          categoryLabel={categoryLabel}
          viewProjectLabel={t('viewProject')}
          closeLabel={t('close')}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}
