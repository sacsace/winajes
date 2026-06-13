'use client';

import { useTranslations } from 'next-intl';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { companyStats } from '@/lib/data';
import { Building2, MapPin, Users, Award } from 'lucide-react';

const icons = [Award, MapPin, Building2, Users];

export function CompanyOverview() {
  const t = useTranslations('home');

  const highlights = [
    { text: t('overview.established') },
    { text: t('overview.offices') },
    { text: t('overview.specialist') },
    { text: t('overview.team') },
  ];

  const stats = [
    { value: companyStats.yearsExperience, suffix: '+', label: t('stats.years') },
    { value: companyStats.projectsCompleted, suffix: '+', label: t('stats.projects') },
    { value: companyStats.clientsServed, suffix: '+', label: t('stats.clients') },
    { value: companyStats.engineers, suffix: '+', label: t('stats.engineers') },
  ];

  return (
    <Section variant="surface">
      <SectionHeader
        label="About"
        title={t('overview.title')}
        subtitle={t('overview.subtitle')}
        className="mb-14"
      />

      <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map(({ text }, i) => {
          const Icon = icons[i];
          return (
            <Card key={i} hover padding="md" className="group">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white transition-colors group-hover:bg-secondary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm leading-relaxed font-medium text-foreground">{text}</p>
            </Card>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-primary shadow-card">
        <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {stats.map((stat, i) => (
            <div key={i} className="px-6 py-9 text-center md:px-8 md:py-10">
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-xs font-semibold tracking-wider text-white/60 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
