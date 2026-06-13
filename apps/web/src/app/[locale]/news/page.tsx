import { setRequestLocale } from 'next-intl/server';
import NewsPageClient from './NewsPageClient';

type Props = { params: Promise<{ locale: string }> };

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NewsPageClient />;
}
