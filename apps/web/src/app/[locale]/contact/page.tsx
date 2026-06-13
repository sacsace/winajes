import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';
import { generateStaticPageMetadata } from '@/lib/seo/page-metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateStaticPageMetadata(locale, 'contact');
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPageClient />;
}
