'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, FolderKanban, Users, Newspaper,
  MessageSquare, Settings, ClipboardList, Wrench, UserCircle,
} from 'lucide-react';
import { ConstructionRecordsAdmin } from '@/components/admin/ConstructionRecordsAdmin';
import { ClientsAdmin } from '@/components/admin/ClientsAdmin';
import { ServicesAdmin } from '@/components/admin/ServicesAdmin';
import { TeamAdmin } from '@/components/admin/TeamAdmin';
import { ProjectsAdmin } from '@/components/admin/ProjectsAdmin';
import { NewsAdmin } from '@/components/admin/NewsAdmin';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminShell, type AdminTab } from '@/components/admin/AdminShell';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { API_URL } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';

export default function AdminPage() {
  const { t } = useAdminT();
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (!token) return;
    if (tab === 'inquiries') {
      fetch(`${API_URL}/api/inquiries`).then((r) => r.json()).then(setInquiries).catch(() => {});
    }
  }, [token, tab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      localStorage.setItem('admin_token', data.access_token);
      setToken(data.access_token);
    } catch {
      setError(t('login.error'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) {
    return (
      <AdminLogin
        email={loginForm.email}
        password={loginForm.password}
        error={error}
        onEmailChange={(email) => setLoginForm({ ...loginForm, email })}
        onPasswordChange={(password) => setLoginForm({ ...loginForm, password })}
        onSubmit={handleLogin}
      />
    );
  }

  const navItems = [
    { key: 'dashboard' as const, icon: LayoutDashboard },
    { key: 'projects' as const, icon: FolderKanban },
    { key: 'performance' as const, icon: ClipboardList },
    { key: 'clients' as const, icon: Users },
    { key: 'services' as const, icon: Wrench },
    { key: 'team' as const, icon: UserCircle },
    { key: 'news' as const, icon: Newspaper },
    { key: 'inquiries' as const, icon: MessageSquare },
    { key: 'settings' as const, icon: Settings },
  ];

  const inquiryCols = [
    t('inquiries.colName'),
    t('inquiries.colCompany'),
    t('inquiries.colEmail'),
    t('inquiries.colType'),
    t('inquiries.colStatus'),
    t('inquiries.colDate'),
  ];

  return (
    <AdminShell tab={tab} navItems={navItems} onTabChange={setTab} onLogout={handleLogout}>
      {tab === 'dashboard' && <AdminDashboard />}

      {tab === 'inquiries' && (
        <div>
          <h1 className="mb-6 text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{t('inquiries.title')}</h1>
          <div className="overflow-hidden rounded-[14px] border border-black/[0.04] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <table className="w-full">
              <thead className="border-b border-black/[0.04] bg-[#FAFAFA]">
                <tr>
                  {inquiryCols.map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[12px] font-semibold text-[#86868B]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="border-t border-black/[0.04]">
                    <td className="px-4 py-2 text-[13px] text-[#1D1D1F]">{inq.name}</td>
                    <td className="px-4 py-2 text-[13px]">{inq.company || '—'}</td>
                    <td className="px-4 py-2 text-[13px]">{inq.email}</td>
                    <td className="px-4 py-2 text-[13px]">{inq.projectType || '—'}</td>
                    <td className="px-4 py-2">
                      <span className="rounded-full bg-[#0B2D5E]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#0B2D5E]">
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[13px] text-[#86868B]">
                      {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-[#86868B]">
                      {t('inquiries.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'projects' && <ProjectsAdmin />}
      {tab === 'performance' && <ConstructionRecordsAdmin />}
      {tab === 'clients' && <ClientsAdmin />}
      {tab === 'services' && <ServicesAdmin />}
      {tab === 'team' && <TeamAdmin />}
      {tab === 'news' && <NewsAdmin />}

      {tab === 'settings' && (
        <div>
          <h1 className="mb-4 text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
            {t('nav.settings')}
          </h1>
          <div className="rounded-[14px] border border-black/[0.04] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[14px] text-[#636366]">
              {t('placeholder.moduleDesc', { name: t('nav.settings') })}
            </p>
            <ul className="mt-4 space-y-2 text-[13px] text-[#86868B]">
              <li>• {t('placeholder.settings')}</li>
            </ul>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
