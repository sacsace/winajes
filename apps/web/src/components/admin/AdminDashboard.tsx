'use client';

import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Globe, Minus } from 'lucide-react';
import { API_URL } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';

type AnalyticsSummary = {
  daily: { date: string; views: number }[];
  todayViews: number;
  weekTotal: number;
  changePct: number;
  topPages: { path: string; views: number }[];
  localeCounts: { ko: number; en: number; other: number };
};

type Counts = {
  projects: number;
  clients: number;
  inquiries: number;
  records: number;
};

export function AdminDashboard() {
  const { t, locale } = useAdminT();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [counts, setCounts] = useState<Counts>({ projects: 0, clients: 0, inquiries: 0, records: 0 });
  const [loading, setLoading] = useState(true);

  const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US';

  const formatDay = (date: string) => {
    const d = new Date(date + 'T12:00:00');
    return d.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' });
  };

  const formatPath = (path: string) => {
    if (path === '/ko' || path === '/en') return t('dashboard.home');
    return path.replace(/^\/(ko|en)/, '') || '/';
  };

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/analytics`).then((r) => r.json()),
      fetch(`${API_URL}/api/projects`).then((r) => r.json()),
      fetch(`${API_URL}/api/clients`).then((r) => r.json()),
      fetch(`${API_URL}/api/inquiries`).then((r) => r.json()),
      fetch(`${API_URL}/api/construction-records?limit=1`).then((r) => r.json()),
    ])
      .then(([analyticsData, projects, clients, inquiries, recordsPage]) => {
        setAnalytics(analyticsData);
        setCounts({
          projects: Array.isArray(projects) ? projects.length : 0,
          clients: Array.isArray(clients) ? clients.length : 0,
          inquiries: Array.isArray(inquiries) ? inquiries.length : 0,
          records: recordsPage?.total ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxViews = Math.max(...(analytics?.daily.map((d) => d.views) ?? [1]), 1);
  const change = analytics?.changePct ?? 0;

  const stats = [
    { label: t('dashboard.statProjects'), value: counts.projects },
    { label: t('dashboard.statClients'), value: counts.clients },
    { label: t('dashboard.statInquiries'), value: counts.inquiries },
    { label: t('dashboard.statRecords'), value: counts.records },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{t('dashboard.title')}</h1>
        <p className="mt-1 text-[13px] text-[#86868B]">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-[14px] border border-black/[0.04] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[12px] font-medium text-[#86868B]">{label}</p>
            <p className="mt-1 text-[26px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
              {loading ? '—' : value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-[14px] border border-black/[0.04] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">{t('dashboard.trafficTitle')}</h2>
              <p className="mt-0.5 text-[12px] text-[#86868B]">{t('dashboard.trafficSubtitle')}</p>
            </div>
            <div className="text-right">
              <p className="text-[22px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
                {analytics?.todayViews ?? '—'}
              </p>
              <div
                className={cn(
                  'mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-medium',
                  change > 0 && 'text-[#34C759]',
                  change < 0 && 'text-[#FF3B30]',
                  change === 0 && 'text-[#86868B]',
                )}
              >
                {change > 0 && <ArrowUpRight className="h-3 w-3" />}
                {change < 0 && <ArrowDownRight className="h-3 w-3" />}
                {change === 0 && <Minus className="h-3 w-3" />}
                {change === 0
                  ? t('dashboard.sameAsYesterday')
                  : t('dashboard.vsYesterday', { pct: `${change > 0 ? '+' : ''}${change}` })}
              </div>
            </div>
          </div>

          <div className="flex h-[140px] items-end gap-2">
            {(analytics?.daily ?? []).map((day) => {
              const height = Math.max(8, (day.views / maxViews) * 100);
              const isToday = day.date === analytics?.daily[analytics.daily.length - 1]?.date;
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] font-medium text-[#86868B]">{day.views}</span>
                  <div
                    className={cn(
                      'w-full max-w-[40px] rounded-[6px] transition-all',
                      isToday ? 'bg-[#0B2D5E]' : 'bg-[#0B2D5E]/20',
                    )}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-[#86868B]">{formatDay(day.date)}</span>
                </div>
              );
            })}
          </div>

          <p className="mt-5 border-t border-black/[0.04] pt-4 text-[12px] text-[#86868B]">
            {t('dashboard.weekTotal')}{' '}
            <span className="font-semibold text-[#1D1D1F]">{analytics?.weekTotal ?? 0}</span>{' '}
            {t('dashboard.views')}
          </p>
        </section>

        <section className="rounded-[14px] border border-black/[0.04] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">{t('dashboard.topPages')}</h2>
          <p className="mt-0.5 mb-4 text-[12px] text-[#86868B]">{t('dashboard.last7Days')}</p>
          <ul className="space-y-2.5">
            {(analytics?.topPages ?? []).map(({ path, views }, i) => (
              <li key={path} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F5F5F7] text-[10px] font-semibold text-[#86868B]">
                    {i + 1}
                  </span>
                  <span className="truncate text-[13px] text-[#1D1D1F]">{formatPath(path)}</span>
                </div>
                <span className="shrink-0 text-[12px] font-medium text-[#86868B]">{views}</span>
              </li>
            ))}
            {!analytics?.topPages.length && (
              <li className="py-6 text-center text-[13px] text-[#86868B]">{t('dashboard.collecting')}</li>
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-[14px] border border-black/[0.04] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#86868B]" />
          <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">{t('dashboard.localeTraffic')}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: t('dashboard.localeKo'), value: analytics?.localeCounts.ko ?? 0, color: 'bg-[#0B2D5E]' },
            { label: t('dashboard.localeEn'), value: analytics?.localeCounts.en ?? 0, color: 'bg-[#3E8ED0]' },
            { label: t('dashboard.localeOther'), value: analytics?.localeCounts.other ?? 0, color: 'bg-[#C7C7CC]' },
          ].map(({ label, value, color }) => {
            const total =
              (analytics?.localeCounts.ko ?? 0) +
              (analytics?.localeCounts.en ?? 0) +
              (analytics?.localeCounts.other ?? 0);
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <div key={label} className="rounded-[10px] bg-[#F5F5F7] px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#636366]">{label}</span>
                  <span className="text-[13px] font-semibold text-[#1D1D1F]">{value}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                  <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1.5 text-[11px] text-[#86868B]">{pct}%</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
