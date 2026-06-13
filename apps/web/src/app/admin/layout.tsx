import type { Metadata } from 'next';
import { AdminLocaleProvider } from '@/lib/admin/AdminLocaleProvider';
import { ConfirmDialogProvider } from '@/components/admin/ConfirmDialogProvider';

export const metadata: Metadata = {
  title: 'Admin CMS',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLocaleProvider>
      <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
    </AdminLocaleProvider>
  );
}
