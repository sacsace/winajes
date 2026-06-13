'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { projects as staticProjects } from '@/lib/data';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { API_URL } from '@/lib/utils';
import type { ApiProject } from '@/lib/projects';
import { isApiImage, resolveProjectImage } from '@/lib/projects';

interface Props {
  slug: string;
}

export default function ProjectDetailClient({ slug }: Props) {
  const t = useTranslations('projects.detail');
  const locale = useLocale() as 'ko' | 'en';
  const [project, setProject] = useState<ApiProject | null>(null);
  const [related, setRelated] = useState<ApiProject[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/projects/slug/${slug}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ApiProject) => {
        setProject(data);
        return fetch(`${API_URL}/api/projects`, { cache: 'no-store' })
          .then((r) => r.json())
          .then((all: ApiProject[]) => {
            setRelated(
              all.filter((p) => p.id !== data.id && p.category === data.category).slice(0, 3),
            );
          });
      })
      .catch(() => {
        const fallback = staticProjects.find((p) => p.slug === slug) as ApiProject | undefined;
        if (fallback) {
          setProject(fallback);
          setRelated(
            staticProjects.filter((p) => p.id !== fallback.id && p.category === fallback.category).slice(0, 3) as ApiProject[],
          );
        }
      });
  }, [slug]);

  if (!project) {
    return (
      <Section>
        <p className="text-center text-muted-foreground">Loading…</p>
      </Section>
    );
  }

  const heroImage = resolveProjectImage(project);
  const gallery =
    project.images.length > 0
      ? project.images
      : [heroImage, '/images/gallery/hvac-1.jpg', '/images/gallery/mechanical-1.jpg'].filter(Boolean);

  return (
    <>
      <section className="relative flex h-[42vh] min-h-[300px] items-end overflow-hidden pt-[72px]">
        <Image
          src={heroImage}
          alt={project.name[locale]}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized={isApiImage(heroImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/75 to-primary/40" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <Container className="relative z-10 py-16">
          <p className="mb-2 text-sm font-semibold text-accent">
            {project.client} · {project.location} · {project.completionYear}
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold text-white md:text-5xl">{project.name[locale]}</h1>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <h2 className="mb-4 text-2xl font-extrabold text-primary">{t('scope')}</h2>
              <p className="leading-relaxed text-muted-foreground">{project.scope[locale]}</p>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-extrabold text-primary">{t('technicalDetails')}</h2>
              <p className="leading-relaxed text-muted-foreground">{project.description[locale]}</p>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-extrabold text-primary">{t('photos')}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {gallery.slice(0, 4).map((src, i) => (
                  <div key={i} className="img-zoom relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src={src}
                      alt={`Photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="50vw"
                      unoptimized={isApiImage(src)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card className="h-fit lg:sticky lg:top-24">
            <h3 className="mb-4 font-extrabold text-primary">{t('status')}</h3>
            <Badge variant={project.status === 'completed' ? 'success' : 'warning'}>
              {project.status}
            </Badge>
            <dl className="mt-6 space-y-4 text-sm">
              <div><dt className="text-muted-foreground">Client</dt><dd className="mt-0.5 font-semibold">{project.client}</dd></div>
              <div><dt className="text-muted-foreground">Location</dt><dd className="mt-0.5 font-semibold">{project.location}</dd></div>
              <div><dt className="text-muted-foreground">Industry</dt><dd className="mt-0.5 font-semibold">{project.industry}</dd></div>
              <div><dt className="text-muted-foreground">Year</dt><dd className="mt-0.5 font-semibold">{project.completionYear}</dd></div>
            </dl>
          </Card>
        </div>
      </Section>

      {related.length > 0 && (
        <Section variant="muted">
          <h2 className="mb-8 text-2xl font-extrabold text-primary">{t('related')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`}>
                <Card hover>
                  <h3 className="font-bold text-foreground">{p.name[locale]}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.client}</p>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
