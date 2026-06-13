import { setRequestLocale } from 'next-intl/server';
import ServiceDetailClient from './ServiceDetailClient';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <ServiceDetailClient slug={slug} />;
}
