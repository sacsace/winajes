'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ConstructionRecord, ConstructionRecordsPage } from '@winajes/shared';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Select } from '@/components/ui/Input';
import { formatInr } from '@/lib/format';
import { API_URL } from '@/lib/utils';

export default function PerformancePageClient() {
  const t = useTranslations('performance');
  const [records, setRecords] = useState<ConstructionRecord[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [year, setYear] = useState('');
  const [client, setClient] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (year) params.set('year', year);
      if (client.trim()) params.set('client', client.trim());
      const res = await fetch(`${API_URL}/api/construction-records?${params}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const data: ConstructionRecordsPage = await res.json();
      setRecords(data.items);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      setRecords([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, year, client]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetch(`${API_URL}/api/construction-records/years`, { cache: 'no-store' })
      .then((r) => r.json())
      .then(setYears)
      .catch(() => setYears([]));
  }, []);

  return (
    <>
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image="/images/hero/hero-3.jpg"
      />

      <Section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t('total', { count: total.toLocaleString() })}
          </p>
          <div className="flex flex-wrap gap-3">
            <Select
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(1); }}
              className="w-auto min-w-[160px]"
            >
              <option value="">{t('filters.allYears')}</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
            <input
              type="search"
              value={client}
              onChange={(e) => { setClient(e.target.value); setPage(1); }}
              placeholder={t('filters.client')}
              className="min-w-[200px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-secondary"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-5 py-3.5 text-left text-sm font-bold">{t('columns.date')}</th>
                  <th className="px-5 py-3.5 text-left text-sm font-bold">{t('columns.client')}</th>
                  <th className="px-5 py-3.5 text-left text-sm font-bold">{t('columns.description')}</th>
                  <th className="px-5 py-3.5 text-right text-sm font-bold">{t('columns.amount')}</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, i) => (
                  <tr
                    key={record.id}
                    className={i % 2 === 0 ? 'bg-surface' : 'bg-muted/40'}
                  >
                    <td className="px-5 py-3.5 text-sm whitespace-nowrap text-foreground">
                      {record.constructionDate}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-primary">
                      {record.client}
                    </td>
                    <td className="max-w-xl px-5 py-3.5 text-sm text-muted-foreground">
                      {record.description}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-bold whitespace-nowrap text-foreground">
                      {formatInr(record.amount)}
                    </td>
                  </tr>
                ))}
                {!loading && records.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                      {t('empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              {t('pagination.prev')}
            </button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              {t('pagination.next')}
            </button>
          </div>
        )}
      </Section>
    </>
  );
}
