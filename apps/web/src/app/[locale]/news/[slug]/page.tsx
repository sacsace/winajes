import { setRequestLocale } from 'next-intl/server';
import NewsDetailClient from './NewsDetailClient';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <NewsDetailClient slug={slug} />;
}
