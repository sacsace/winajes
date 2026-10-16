'use client';

import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';

export function CompanyOverview() {
  const t = useTranslations('home');

  const highlights = [
    t('overview.established'),
    t('overview.offices'),
    t('overview.specialist'),
    t('overview.team'),
  ];

  const capabilities = [
    {
      label: t('overview.capabilities.facilitiesLabel'),
      value: t('overview.capabilities.facilitiesValue'),
    },
    {
      label: t('overview.capabilities.scopeLabel'),
      value: t('overview.capabilities.scopeValue'),
    },
    {
      label: t('overview.capabilities.aftercareLabel'),
      value: t('overview.capabilities.aftercareValue'),
    },
    {
      label: t('overview.capabilities.managementLabel'),
      value: t('overview.capabilities.managementValue'),
    },
  ];

  const stats = [
    { label: t('stats.years'), value: t('stats.yearsValue') },
    { label: t('stats.projects'), value: t('stats.projectsValue') },
    { label: t('stats.clients'), value: t('stats.clientsValue') },
    { label: t('stats.engineers'), value: t('stats.engineersValue') },
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
          <p className="mt-5 max-w-xl pl-4 text-[15px] leading-relaxed tracking-[-0.015em] text-muted-foreground md:text-[1.0625rem] md:leading-[1.65]">
            {t('overview.description')}
          </p>
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

          <dl className="mt-8 border-t border-border">
            {capabilities.map((item) => (
              <div
                key={item.label}
                className="grid gap-1 border-b border-border py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:items-baseline"
              >
                <dt className="text-[13px] font-semibold text-primary">{item.label}</dt>
                <dd className="text-[14px] leading-relaxed text-foreground sm:text-[15px]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[12px] font-medium text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 text-xl font-bold tracking-tight text-primary sm:text-2xl md:text-[1.65rem]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
