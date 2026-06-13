'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { projects as staticProjects } from '@/lib/data';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { API_URL } from '@/lib/utils';
import type { ApiProject } from '@/lib/projects';
import { isApiImage, resolveProjectImage } from '@/lib/projects';

export default function ProjectsPageClient() {
  const t = useTranslations('projects');
  const locale = useLocale() as 'ko' | 'en';
  const [category, setCategory] = useState('all');
  const [year, setYear] = useState('all');
  const [projects, setProjects] = useState<ApiProject[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setProjects)
      .catch(() => setProjects(staticProjects as ApiProject[]));
  }, []);

  const years = useMemo(
    () => [...new Set(projects.map((p) => p.completionYear))].sort((a, b) => b - a),
    [projects],
  );
  const categories = ['all', 'mechanical', 'electrical', 'fire-fighting', 'utility', 'it-infrastructure', 'industrial-construction'];

  const filtered = projects.filter((p) => {
    if (category !== 'all' && p.category !== category) return false;
    if (year !== 'all' && p.completionYear !== Number(year)) return false;
    return true;
  });

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
        image="/images/hero/hero-3.jpg"
      />

      <Section>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/50 p-5">
          <div>
            <p className="font-bold text-primary">{t('performanceLink.title')}</p>
            <p className="text-sm text-muted-foreground">{t('performanceLink.subtitle')}</p>
          </div>
          <Button href="/performance" variant="secondary">{t('performanceLink.cta')}</Button>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-auto min-w-[200px]">
            <option value="all">{t('filters.category')}: All</option>
            {categories.filter((c) => c !== 'all').map((c) => (
              <option key={c} value={c}>{t(`categories.${c}`)}</option>
            ))}
          </Select>
          <Select value={year} onChange={(e) => setYear(e.target.value)} className="w-auto min-w-[160px]">
            <option value="all">{t('filters.year')}: All</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const img = resolveProjectImage(project);
            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group img-zoom overflow-hidden rounded-xl border border-border bg-surface shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="relative h-48">
                  <Image
                    src={img}
                    alt={project.name[locale]}
                    fill
                    className="object-cover"
                    sizes="33vw"
                    unoptimized={isApiImage(img)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/65 to-transparent" />
                  <Badge variant={statusVariant(project.status)} className="absolute top-4 right-4">
                    {project.status}
                  </Badge>
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold tracking-wide text-secondary uppercase">
                    {t(`categories.${project.category}` as 'categories.mechanical')}
                  </span>
                  <h3 className="mt-1 text-lg font-bold transition-colors group-hover:text-primary">
                    {project.name[locale]}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.client} · {project.location} · {project.completionYear}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
