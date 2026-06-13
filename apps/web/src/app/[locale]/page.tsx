import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/home/HeroSection';
import { CompanyOverview } from '@/components/home/CompanyOverview';
import { BusinessAreas } from '@/components/home/BusinessAreas';
import { SiteGallery } from '@/components/home/SiteGallery';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ClientCarousel } from '@/components/home/ClientCarousel';
import { WhyWinajes } from '@/components/home/WhyWinajes';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
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
