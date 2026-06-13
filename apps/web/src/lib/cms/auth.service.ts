import { ensureCmsSeeded, type CmsInquiry } from '@/lib/cms/seed';
import { newId, nowIso, readCollection, writeCollection } from '@/lib/cms/store';

export type InquiryInput = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  projectType?: string;
  message?: string;
};

export async function listInquiries() {
  await ensureCmsSeeded();
  const items = await readCollection<CmsInquiry>('inquiries');
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createInquiry(data: InquiryInput) {
  await ensureCmsSeeded();
  const items = await readCollection<CmsInquiry>('inquiries');
  const record: CmsInquiry = {
    id: newId('inq'),
    name: data.name.trim(),
    company: data.company?.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim(),
    projectType: data.projectType?.trim(),
    message: data.message?.trim(),
    status: 'new',
    createdAt: nowIso(),
  };
  items.push(record);
  await writeCollection('inquiries', items);
  return record;
}

export const ADMIN_EMAIL = 'admin@winajes.com';
export const ADMIN_PASSWORD = 'admin123';

export function loginAdmin(email: string, password: string) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return {
      access_token: 'local-cms-token',
      user: { id: 'admin', email: ADMIN_EMAIL, role: 'admin', name: 'Admin' },
    };
  }
  return null;
}
