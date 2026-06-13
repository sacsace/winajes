import { setRequestLocale } from 'next-intl/server';
import ClientsPageClient from './ClientsPageClient';

type Props = { params: Promise<{ locale: string }> };

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ClientsPageClient />;
}
