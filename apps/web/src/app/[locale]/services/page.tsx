import { setRequestLocale } from 'next-intl/server';
import ServicesPageClient from './ServicesPageClient';

type Props = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPageClient />;
}
