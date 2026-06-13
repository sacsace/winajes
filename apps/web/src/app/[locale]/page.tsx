import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { CompanyOverview } from '@/components/home/CompanyOverview';
import { BusinessAreas } from '@/components/home/BusinessAreas';
import { SiteGallery } from '@/components/home/SiteGallery';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ClientCarousel } from '@/components/home/ClientCarousel';
import { WhyWinajes } from '@/components/home/WhyWinajes';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateStaticPageMetadata } from '@/lib/seo/page-metadata';
import { absoluteUrl, getSiteUrl } from '@/lib/seo/metadata';
import type { Locale } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateStaticPageMetadata(locale, 'home');
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  const loc = locale as Locale;

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t('siteName'),
    url: getSiteUrl(),
    logo: `${getSiteUrl()}/images/brand/logo-icon.png`,
    description: t('siteDescription'),
    foundingDate: '2014',
    areaServed: ['IN', 'KR'],
    sameAs: [absoluteUrl(loc, '/')],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t('siteName'),
    url: getSiteUrl(),
    inLanguage: ['ko-KR', 'en-US'],
  };

  return (
    <>
      <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
      <HeroSection />
      <CompanyOverview />
      <BusinessAreas />
      <SiteGallery />
      <FeaturedProjects />
      <ClientCarousel />
      <WhyWinajes />
    </>
  );
}
