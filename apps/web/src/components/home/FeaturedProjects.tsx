'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { projects as staticProjects } from '@/lib/data';
import { API_URL } from '@/lib/utils';
import type { ApiProject } from '@/lib/projects';
import { isApiImage, resolveProjectImage } from '@/lib/projects';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const categories = [
  'all', 'mechanical', 'electrical', 'fire-fighting', 'utility', 'it-infrastructure', 'industrial-construction',
] as const;

export function FeaturedProjects() {
  const t = useTranslations('home.featuredProjects');
  const tCat = useTranslations('projects.categories');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ko' | 'en';
  const [filter, setFilter] = useState<string>('all');
  const [projects, setProjects] = useState<ApiProject[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setProjects)
      .catch(() => setProjects(staticProjects as ApiProject[]));
  }, []);

  const filtered = filter === 'all'
    ? projects.filter((p) => p.featured)
    : projects.filter((p) => p.category === filter);

  return (
    <Section variant="muted">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader title={t('title')} subtitle={t('subtitle')} align="left" className="mb-0" />
        <Link
          href="/projects"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-primary"
        >
          {tCommon('viewAll')} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-x-1 gap-y-2 border-b border-border pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              'px-3 py-1.5 text-[13px] font-medium transition-colors',
              filter === cat
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {cat === 'all' ? (locale === 'ko' ? '전체' : 'All') : tCat(cat)}
          </button>
        ))}
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
              <div className="relative h-52 bg-muted">
                {img ? (
                  <Image
                    src={img}
                    alt={project.name[locale]}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                    unoptimized={isApiImage(img)}
                  />
                ) : null}
              </div>
              <div className="border-t border-border p-5">
                <p className="text-[12px] font-medium text-muted-foreground">
                  {project.completionYear} · {project.location}
                </p>
                <h3 className="mt-1.5 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {project.name[locale]}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{project.client}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.scope[locale]}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
