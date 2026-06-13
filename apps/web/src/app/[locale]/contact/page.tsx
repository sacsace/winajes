import { setRequestLocale } from 'next-intl/server';
import ContactPageClient from './ContactPageClient';

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPageClient />;
}
