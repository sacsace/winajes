'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ContactForm } from '@/components/forms/ContactForm';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { services as fallbackServices, projects as fallbackProjects } from '@/lib/data';
import {
  DEFAULT_SERVICE_CAPABILITIES,
  DEFAULT_SERVICE_PROCESS,
  normalizeServiceFields,
  type ApiService,
} from '@/lib/services';
import type { ApiProject } from '@/lib/projects';
import { API_URL } from '@/lib/utils';

interface Props {
  slug: string;
}

export default function ServiceDetailClient({ slug }: Props) {
  const t = useTranslations('services');
  const locale = useLocale() as 'ko' | 'en';
  const [service, setService] = useState<ApiService | null>(null);
  const [related, setRelated] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/services/slug/${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) return Promise.reject();
        return r.json();
      })
      .then((data: ApiService) => {
        setService(normalizeServiceFields(data));
        return fetch(`${API_URL}/api/projects`, { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : []))
          .then((all: ApiProject[]) => setRelated(all.filter((p) => p.featured).slice(0, 3)));
      })
      .catch(() => {
        const fallback = fallbackServices.find((s) => s.slug === slug);
        if (fallback) {
          setService(
            normalizeServiceFields({
              id: fallback.slug,
              slug: fallback.slug,
              icon: fallback.icon,
              title: fallback.title,
              overview: fallback.overview,
              process: DEFAULT_SERVICE_PROCESS,
              capabilities: DEFAULT_SERVICE_CAPABILITIES,
              order: 0,
            }),
          );
          setRelated(fallbackProjects.slice(0, 3) as ApiProject[]);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const processSteps = service?.process.map((step) => step[locale]) ?? [];
  const capabilities = service?.capabilities.map((cap) => cap[locale]) ?? [];

  if (loading) {
    return (
      <Section>
        <p className="text-center text-muted-foreground">{locale === 'ko' ? '로딩 중...' : 'Loading...'}</p>
      </Section>
    );
  }

  if (!service) {
    return (
      <Section>
        <p className="text-center text-muted-foreground">
          {locale === 'ko' ? '서비스를 찾을 수 없습니다.' : 'Service not found.'}
        </p>
        <div className="mt-6 text-center">
          <Link href="/services" className="text-sm font-semibold text-primary hover:underline">
            {locale === 'ko' ? '서비스 목록으로' : 'Back to services'}
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <>
      <PageHero
        title={service.title[locale]}
        subtitle={service.overview[locale]}
        image="/images/gallery/hvac-2.jpg"
        size="compact"
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <div>
              <h2 className="mb-4 text-2xl font-extrabold text-primary">{t('overview')}</h2>
              <p className="leading-relaxed text-muted-foreground">{service.overview[locale]}</p>
            </div>
            <div>
              <h2 className="mb-6 text-2xl font-extrabold text-primary">{t('process')}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {processSteps.map((step, i) => (
                  <Card key={`${step}-${i}`} padding="sm">
                    <span className="text-sm font-extrabold text-secondary">0{i + 1}</span>
                    <p className="mt-1 font-semibold text-foreground">{step}</p>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-6 text-2xl font-extrabold text-primary">{t('capabilities')}</h2>
              <ul className="space-y-3">
                {capabilities.map((cap, i) => (
                  <li key={`${cap}-${i}`} className="flex items-center gap-3 text-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <Card className="sticky top-24">
              <h3 className="mb-4 text-lg font-extrabold text-primary">{t('inquiry')}</h3>
              <ContactForm compact />
            </Card>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section variant="muted">
          <h2 className="mb-8 text-2xl font-extrabold text-primary">{t('relatedProjects')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`}>
                <Card hover>
                  <h3 className="font-bold text-foreground">{p.name[locale]}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.client} · {p.location}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
