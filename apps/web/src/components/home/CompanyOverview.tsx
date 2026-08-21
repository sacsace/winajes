'use client';

import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { companyStats } from '@/lib/data';

export function CompanyOverview() {
  const t = useTranslations('home');

  const highlights = [
    t('overview.established'),
    t('overview.offices'),
    t('overview.specialist'),
    t('overview.team'),
  ];

  const stats = [
    { value: companyStats.yearsExperience, suffix: '+', label: t('stats.years') },
    { value: companyStats.projectsCompleted, suffix: '+', label: t('stats.projects') },
    { value: companyStats.clientsServed, suffix: '+', label: t('stats.clients') },
    { value: companyStats.engineers, suffix: '+', label: t('stats.engineers') },
  ];

  return (
    <Section variant="surface">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeader
            label="About"
            title={t('overview.title')}
            subtitle={t('overview.subtitle')}
            align="left"
            className="mb-0"
          />
        </div>

        <div className="lg:col-span-7">
          <ul className="space-y-4 border-t border-border pt-6">
            {highlights.map((text) => (
              <li
                key={text}
                className="border-b border-border pb-4 text-[15px] leading-relaxed text-foreground"
              >
                {text}
              </li>
            ))}
          </ul>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[12px] font-medium text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-primary md:text-4xl">
                  {stat.value}
                  {stat.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
