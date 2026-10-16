'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  ArrowRight,
  Droplets,
  Flame,
  PenTool,
  Server,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { services as fallbackServices } from '@/lib/data';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ApiService } from '@/lib/services';
import { DEFAULT_SERVICE_CAPABILITIES, DEFAULT_SERVICE_PROCESS } from '@/lib/services';
import { pageHeroImages } from '@/lib/images';
import { API_URL, cn } from '@/lib/utils';

const SERVICE_ICONS: Record<string, LucideIcon> = {
  Wrench,
  Wind,
  Zap,
  Flame,
  Droplets,
  Server,
  PenTool,
};

export default function ServicesPageClient() {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ko' | 'en';
  const [items, setItems] = useState<ApiService[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/services`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ApiService[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setItems(fallbackAsApi());
          return;
        }
        setItems(data);
      })
      .catch(() => setItems(fallbackAsApi()));
  }, []);

  return (
    <>
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image={pageHeroImages.services}
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => {
            const Icon = SERVICE_ICONS[service.icon] ?? Wrench;
            const isDesign = service.slug === 'design-engineering';

            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className={cn(isDesign && 'md:col-span-2 lg:col-span-3')}
              >
                <Card
                  hover
                  padding="lg"
                  className={cn(
                    'group h-full',
                    isDesign && 'md:flex md:items-start md:gap-8 md:p-8',
                  )}
                >
                  <div
                    className={cn(
                      'mb-4 flex h-11 w-11 items-center justify-center border border-border bg-muted text-primary',
                      isDesign && 'md:mb-0 md:shrink-0',
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                      {service.title[locale]}
                    </h2>
                    <p
                      className={cn(
                        'mb-5 text-[15px] leading-relaxed text-muted-foreground',
                        isDesign && 'md:max-w-3xl',
                      )}
                    >
                      {service.overview[locale]}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                      {tCommon('learnMore')}{' '}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-border pt-10 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-primary">{t('ctaTitle')}</h3>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {t('ctaDescription')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact" variant="primary" size="lg">
              {t('ctaButton')}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/performance" variant="ghost" size="lg" className="border border-border text-primary">
              {t('viewCases')}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function fallbackAsApi(): ApiService[] {
  return fallbackServices.map((s, i) => ({
    id: s.slug,
    slug: s.slug,
    icon: s.icon,
    title: s.title,
    overview: s.overview,
    process: DEFAULT_SERVICE_PROCESS,
    capabilities: DEFAULT_SERVICE_CAPABILITIES,
    order: i,
  }));
}
