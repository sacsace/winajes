'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ContactForm } from '@/components/forms/ContactForm';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { OfficeLocationListItem } from '@/components/offices/OfficeLocationCard';
import { googleMapsAllOfficesUrl } from '@/lib/maps';
import { offices, contactPersons } from '@/lib/data';
import { MapPin, ExternalLink } from 'lucide-react';

export default function ContactPageClient() {
  const t = useTranslations('contact');
  const locale = useLocale() as 'ko' | 'en';

  return (
    <>
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image="/images/hero/hero-5.jpg"
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <Card padding="lg">
            <h2 className="mb-6 text-2xl font-extrabold text-primary">{t('title')}</h2>
            <ContactForm />
          </Card>

          <div>
            <h2 className="mb-6 text-2xl font-extrabold text-primary">{t('offices')}</h2>
            <a
              href={googleMapsAllOfficesUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 flex h-64 items-center justify-center rounded-xl border border-dashed border-border bg-muted transition-colors hover:border-secondary/40"
            >
              <div className="text-center">
                <MapPin className="mx-auto mb-3 h-8 w-8 text-secondary/60" />
                <p className="text-sm font-medium text-muted-foreground">Google Maps</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
                  {locale === 'ko' ? '지도에서 보기' : 'View on map'}
                  <ExternalLink className="h-3 w-3" />
                </p>
              </div>
            </a>
            <div className="space-y-4">
              {offices.map((office) => (
                <OfficeLocationListItem key={office.id} office={office} locale={locale} />
              ))}
            </div>

            <div className="mt-8">
              <h3 className="mb-4 font-extrabold text-primary">
                {locale === 'ko' ? '담당자 연락처' : 'Key Contacts'}
              </h3>
              <div className="space-y-3">
                {contactPersons.map((person) => (
                  <div key={person.email + person.name} className="rounded-xl bg-muted p-4 text-sm">
                    <p className="font-semibold text-foreground">{person.name}</p>
                    <p className="text-muted-foreground">{person.role[locale]}</p>
                    <p className="mt-1 text-muted-foreground">{person.phone} · {person.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
