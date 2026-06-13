import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'WINAJES Constructions India Pvt. Ltd.',
    template: '%s | WINAJES Constructions India',
  },
  description:
    'Established 2014. MEP, utility, electrical, fire protection and IT infrastructure specialist in India.',
  applicationName: 'WINAJES Constructions India',
  formatDetection: { telephone: true, email: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0B2D5E' },
    { media: '(prefers-color-scheme: dark)', color: '#0B2D5E' },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const locale = headerStore.get('x-next-intl-locale') ?? 'ko';

  return (
    <html lang={locale} className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
