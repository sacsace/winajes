import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'WINAJES Constructions India Pvt. Ltd.',
    template: '%s | WINAJES Constructions India',
  },
  description: 'Established 2014. MEP, utility, electrical, fire protection and IT infrastructure specialist in India. Partner to Samsung, Kia, Hyosung and 26 global clients.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
