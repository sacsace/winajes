'use client';

import { ExternalLink } from 'lucide-react';
import { googleMapsAllOfficesUrl, googleMapsEmbedUrl, type OfficeLocation } from '@/lib/maps';
import { cn } from '@/lib/utils';

type Props = {
  offices: OfficeLocation[];
  locale: 'ko' | 'en';
  className?: string;
  /** Prefer India HQ when present; otherwise first office */
  focusId?: string;
};

export function OfficesMap({ offices, locale, className, focusId = '2' }: Props) {
  const focus =
    offices.find((o) => o.id === focusId) ??
    offices.find((o) => !o.isHeadquarters) ??
    offices[0];

  if (!focus) return null;

  const embedUrl = googleMapsEmbedUrl(focus.lat, focus.lng, 13, locale);
  const openUrl = googleMapsAllOfficesUrl();
  const openLabel = locale === 'ko' ? '큰 지도에서 보기' : 'Open larger map';

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-muted', className)}>
      <div className="relative aspect-[16/10] w-full min-h-[220px] sm:min-h-[260px]">
        <iframe
          title={locale === 'ko' ? '사무소 위치 지도' : 'Office locations map'}
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border bg-surface px-4 py-2.5">
        <p className="truncate text-xs text-muted-foreground sm:text-sm">
          {focus.name[locale]} · {focus.address[locale]}
        </p>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-secondary hover:text-primary"
        >
          {openLabel}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
