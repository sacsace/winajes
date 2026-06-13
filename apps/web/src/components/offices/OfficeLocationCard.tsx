'use client';

import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { googleMapsLink, type OfficeLocation } from '@/lib/maps';
import { cn } from '@/lib/utils';

interface OfficeLocationCardProps {
  office: OfficeLocation;
  locale: 'ko' | 'en';
  mapsLabel?: string;
}

export function OfficeLocationCard({ office, locale, mapsLabel }: OfficeLocationCardProps) {
  const mapsUrl = googleMapsLink(office, locale);
  const openLabel = mapsLabel ?? (locale === 'ko' ? 'Google Maps에서 보기' : 'Open in Google Maps');

  return (
    <Card
      padding="md"
      className={cn(
        'flex h-full flex-col',
        office.isHeadquarters && 'border-secondary/30 ring-1 ring-secondary/20',
      )}
    >
      {office.isHeadquarters && (
        <span className="mb-3 inline-block w-fit rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-secondary uppercase">
          HQ
        </span>
      )}

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group -mx-1 flex flex-1 flex-col rounded-lg px-1 py-0.5 transition-colors hover:bg-muted/80"
        aria-label={`${office.name[locale]} — ${openLabel}`}
      >
        <div className="mb-2 flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary transition-colors group-hover:text-primary" />
          <h3 className="font-bold text-primary group-hover:underline">{office.name[locale]}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground">
          {office.address[locale]}
        </p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
          {openLabel}
          <ExternalLink className="h-3 w-3 opacity-70" />
        </span>
      </a>

      <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
        <a
          href={`tel:${office.phone.replace(/\s/g, '')}`}
          className="flex items-center gap-2 transition-colors hover:text-primary"
        >
          <Phone className="h-3.5 w-3.5 shrink-0 text-secondary" />
          {office.phone}
        </a>
        <a
          href={`mailto:${office.email}`}
          className="flex items-center gap-2 transition-colors hover:text-primary"
        >
          <Mail className="h-3.5 w-3.5 shrink-0 text-secondary" />
          {office.email}
        </a>
      </div>
    </Card>
  );
}

interface OfficeLocationListProps {
  office: OfficeLocation;
  locale: 'ko' | 'en';
}

/** Contact page compact list item */
export function OfficeLocationListItem({ office, locale }: OfficeLocationListProps) {
  const mapsUrl = googleMapsLink(office, locale);
  const openLabel = locale === 'ko' ? 'Google Maps에서 보기' : 'Open in Google Maps';

  return (
    <Card padding="md">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
        aria-label={`${office.name[locale]} — ${openLabel}`}
      >
        <h3 className="font-bold text-primary group-hover:underline">{office.name[locale]}</h3>
        <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground group-hover:text-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          <span>{office.address[locale]}</span>
        </p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
          {openLabel}
          <ExternalLink className="h-3 w-3" />
        </span>
      </a>
      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-primary">
          <Phone className="h-4 w-4 text-secondary" /> {office.phone}
        </a>
        <a href={`mailto:${office.email}`} className="flex items-center gap-2 hover:text-primary">
          <Mail className="h-4 w-4 text-secondary" /> {office.email}
        </a>
      </div>
    </Card>
  );
}
