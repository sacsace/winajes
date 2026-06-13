import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import ClientsPageClient from './ClientsPageClient';
import { generateStaticPageMetadata } from '@/lib/seo/page-metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateStaticPageMetadata(locale, 'clients');
}

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ClientsPageClient />;
}
