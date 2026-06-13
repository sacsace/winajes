'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { services as fallbackServices } from '@/lib/data';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';
import type { ApiService } from '@/lib/services';
import { DEFAULT_SERVICE_CAPABILITIES, DEFAULT_SERVICE_PROCESS } from '@/lib/services';
import { getServiceIcon } from '@/lib/service-icons';
import { API_URL } from '@/lib/utils';

export default function ServicesPageClient() {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ko' | 'en';
  const [items, setItems] = useState<ApiService[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/services`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setItems)
      .catch(() => {
        setItems(
          fallbackServices.map((s, i) => ({
            id: s.slug,
            slug: s.slug,
            icon: s.icon,
            title: s.title,
            overview: s.overview,
            process: DEFAULT_SERVICE_PROCESS,
            capabilities: DEFAULT_SERVICE_CAPABILITIES,
            order: i,
          })),
        );
      });
  }, []);

  return (
    <>
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image="/images/gallery/hvac-1.jpg"
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <Card hover padding="lg" className="group h-full">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary transition-colors group-hover:bg-secondary">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {service.title[locale]}
                  </h2>
                  <p className="mb-5 text-muted-foreground">{service.overview[locale]}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                    {tCommon('learnMore')}{' '}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
