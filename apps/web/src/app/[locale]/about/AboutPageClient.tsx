'use client';

import { useTranslations, useLocale } from 'next-intl';
import { timeline, offices, companyStats } from '@/lib/data';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Button } from '@/components/ui/Button';
import { OrgChart } from '@/components/about/OrgChart';
import { VisionMission } from '@/components/about/VisionMission';
import { CeoMessage } from '@/components/about/CeoMessage';
import { OfficeLocationCard } from '@/components/offices/OfficeLocationCard';
import { googleMapsAllOfficesUrl } from '@/lib/maps';
import { aboutHeroImage } from '@/lib/images';
import { cn } from '@/lib/utils';
import {
  MapPin, ExternalLink,
} from 'lucide-react';

export default function AboutPageClient() {
  const t = useTranslations('about');
  const tHome = useTranslations('home.stats');
  const locale = useLocale() as 'ko' | 'en';

  const stats = [
    { value: companyStats.yearsExperience, suffix: '+', label: tHome('years') },
    { value: companyStats.projectsCompleted, suffix: '+', label: tHome('projects') },
    { value: companyStats.clientsServed, suffix: '+', label: tHome('clients') },
    { value: companyStats.engineers, suffix: '+', label: tHome('engineers') },
  ];

  return (
    <>
      <PageHero
        label="About WINAJES"
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image={aboutHeroImage}
      />

      {/* 핵심 수치 */}
      <Section variant="muted" className="!py-12 md:!py-14">
        <div className="grid divide-y divide-border rounded-xl border border-border bg-surface shadow-soft sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-8 text-center">
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                className="text-3xl text-primary md:text-4xl"
              />
              <p className="mt-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <CeoMessage />

      {/* 연혁 */}
      <Section variant="muted">
        <SectionHeader title={t('history.title')} subtitle={t('history.subtitle')} className="mb-12" />
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute top-2 bottom-2 left-[11px] w-px bg-border md:left-1/2 md:-translate-x-px" />
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div
                key={item.year}
                className={cn(
                  'relative flex gap-6 md:gap-0',
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
                )}
              >
                <div className="hidden flex-1 md:block" />
                <div className="absolute left-0 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-secondary bg-surface md:left-1/2 md:-translate-x-1/2">
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                </div>
                <div className="ml-10 flex-1 md:ml-0 md:px-10">
                  <Card padding="md" className="md:max-w-md">
                    <span className="text-sm font-bold tracking-wider text-secondary uppercase">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-primary">{item.title[locale]}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description[locale]}
                    </p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <VisionMission />

      {/* 조직도 */}
      <Section variant="muted">
        <SectionHeader
          label="Organization"
          title={t('organization.title')}
          className="mb-12"
        />
        <OrgChart />
      </Section>

      {/* 글로벌 거점 */}
      <Section variant="surface">
        <SectionHeader title={t('locations.title')} subtitle={t('locations.subtitle')} className="mb-10" />

        <a
          href={googleMapsAllOfficesUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-8 block overflow-hidden rounded-xl border border-border bg-muted transition-colors hover:border-secondary/40 hover:bg-muted/80"
        >
          <div className="flex h-56 items-center justify-center md:h-72">
            <div className="text-center">
              <MapPin className="mx-auto mb-3 h-8 w-8 text-secondary/60" />
              <p className="text-sm font-medium text-muted-foreground">
                {locale === 'ko' ? '한국 · 인도 거점 지도' : 'Korea & India Office Map'}
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
                {locale === 'ko' ? 'Google Maps에서 보기' : 'Open in Google Maps'}
                <ExternalLink className="h-3 w-3" />
              </p>
            </div>
          </div>
        </a>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offices.map((office) => (
            <OfficeLocationCard key={office.id} office={office} locale={locale} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/contact" variant="primary" size="lg">
            {locale === 'ko' ? '문의하기' : 'Contact Us'}
          </Button>
        </div>
      </Section>
    </>
  );
}
