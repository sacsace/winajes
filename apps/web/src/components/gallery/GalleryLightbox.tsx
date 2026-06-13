'use client';

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { ProjectGalleryItem } from '@/lib/project-gallery';
import { isApiImage } from '@/lib/projects';
import { cn } from '@/lib/utils';

type Props = {
  items: ProjectGalleryItem[];
  index: number;
  locale: 'ko' | 'en';
  categoryLabel: (category: string) => string;
  viewProjectLabel: string;
  closeLabel: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function GalleryLightbox({
  items,
  index,
  locale,
  categoryLabel,
  viewProjectLabel,
  closeLabel,
  onClose,
  onIndexChange,
}: Props) {
  const item = items[index];
  const count = items.length;

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + count) % count);
  }, [count, index, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % count);
  }, [count, index, onIndexChange]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [goNext, goPrev, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={item.projectName[locale]}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{item.projectName[locale]}</p>
          <p className="truncate text-xs text-white/60">
            {categoryLabel(item.category)} · {item.client}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs font-medium text-white/60 tabular-nums">
            {index + 1} / {count}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/80 transition-colors hover:border-white/40 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 sm:px-20">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous"
          className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:left-6"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="relative h-[min(calc(100vh-12rem),720px)] w-full max-w-6xl">
          <Image
            key={item.id}
            src={item.src}
            alt={item.projectName[locale]}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
            unoptimized={isApiImage(item.src)}
            priority
          />
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next"
          className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:right-6"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="border-t border-white/10 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            ← → {locale === 'ko' ? '키로 이동' : 'to navigate'}
          </p>
          <Link
            href={`/projects/${item.projectSlug}`}
            className="text-xs font-semibold text-secondary transition-colors hover:text-white"
            onClick={onClose}
          >
            {viewProjectLabel}
          </Link>
        </div>

        {count > 1 && (
          <div className="mx-auto mt-3 flex max-w-6xl gap-2 overflow-x-auto pb-1">
            {items.map((thumb, i) => (
              <button
                key={thumb.id}
                type="button"
                onClick={() => onIndexChange(i)}
                className={cn(
                  'relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all',
                  i === index ? 'border-secondary opacity-100' : 'border-transparent opacity-50 hover:opacity-80',
                )}
              >
                <Image
                  src={thumb.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized={isApiImage(thumb.src)}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
