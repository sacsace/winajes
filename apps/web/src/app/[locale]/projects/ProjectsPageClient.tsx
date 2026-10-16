'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { projects as staticProjects } from '@/lib/data';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import { API_URL, cn } from '@/lib/utils';
import type { ApiProject } from '@/lib/projects';
import { isApiImage, resolveProjectImage } from '@/lib/projects';
import { pageHeroImages } from '@/lib/images';

function enrichProject(project: ApiProject): ApiProject {
  const fallback = staticProjects.find((item) => item.slug === project.slug);
  if (!fallback) return project;
  return {
    ...project,
    name: fallback.name,
    scope: fallback.scope,
    location: fallback.location,
    description: fallback.description,
    category: fallback.category,
    completionYear: fallback.completionYear,
    client: fallback.client,
    status: fallback.status,
  };
}

export default function ProjectsPageClient() {
  const t = useTranslations('projects');
  const locale = useLocale() as 'ko' | 'en';
  const [category, setCategory] = useState('all');
  const [year, setYear] = useState('all');
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<ApiProject[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ApiProject[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setProjects(staticProjects as ApiProject[]);
          return;
        }
        setProjects(data.map(enrichProject));
      })
      .catch(() => setProjects(staticProjects as ApiProject[]));
  }, []);

  const years = useMemo(
    () => [...new Set(projects.map((p) => p.completionYear))].sort((a, b) => b - a),
    [projects],
  );
  const categories = [
    'all',
    'mechanical',
    'electrical',
    'fire-fighting',
    'utility',
    'it-infrastructure',
    'industrial-construction',
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => {
        if (category !== 'all' && p.category !== category) return false;
        if (year !== 'all' && p.completionYear !== Number(year)) return false;
        if (q) {
          const haystack = `${p.name.ko} ${p.name.en} ${p.client} ${p.scope.ko} ${p.scope.en}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.completionYear - a.completionYear || a.name.en.localeCompare(b.name.en));
  }, [projects, category, year, query]);

  const statusLabel = (status: string) => {
    if (status === 'completed') return t('status.completed');
    if (status === 'ongoing') return t('status.ongoing');
    return status;
  };

  const statusVariant = (status: string) => {
    if (status === 'completed') return 'success';
    if (status === 'ongoing') return 'warning';
    return 'muted';
  };

  return (
    <>
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image={pageHeroImages.projects}
      />

      <Section>
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-auto min-w-[180px]"
            >
              <option value="all">
                {t('filters.category')}: {t('filters.all')}
              </option>
              {categories
                .filter((c) => c !== 'all')
                .map((c) => (
                  <option key={c} value={c}>
                    {t(`categories.${c}`)}
                  </option>
                ))}
            </Select>
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-auto min-w-[160px]"
            >
              <option value="all">
                {t('filters.year')}: {t('filters.all')}
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('filters.search')}
              className="min-w-[200px] flex-1 border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <Link
            href="/performance"
            className="shrink-0 text-[13px] font-semibold text-secondary underline-offset-4 hover:underline"
          >
            {t('performanceLink.cta')} →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const img = resolveProjectImage(project);
            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group img-zoom overflow-hidden border border-border bg-surface"
              >
                <div className="relative h-48 bg-muted">
                  {img ? (
                    <Image
                      src={img}
                      alt={project.name[locale]}
                      fill
                      className="object-cover"
                      sizes="33vw"
                      unoptimized={isApiImage(img)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-[13px] font-medium text-muted-foreground">
                      {t('photoPending')}
                    </div>
                  )}
                </div>
                <div className="border-t border-border p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium text-secondary">
                      {t(`categories.${project.category}` as 'categories.mechanical')}
                    </span>
                    <Badge variant={statusVariant(project.status)}>
                      {statusLabel(project.status)}
                    </Badge>
                  </div>
                  <h3 className="mt-2 text-[17px] font-bold leading-snug transition-colors group-hover:text-primary">
                    {project.name[locale]}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {project.scope[locale]}
                  </p>
                  <p className="mt-3 text-[12px] text-muted-foreground">
                    {project.client} · {project.location} · {t('filters.completionYear')}{' '}
                    {project.completionYear}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className={cn('py-16 text-center text-sm text-muted-foreground')}>{t('empty')}</p>
        )}
      </Section>
    </>
  );
}
