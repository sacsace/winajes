import { setRequestLocale } from 'next-intl/server';
import AboutPageClient from './AboutPageClient';

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutPageClient />;
}
