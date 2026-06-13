'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { newsArticles as fallbackNews } from '@/lib/data';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { API_URL } from '@/lib/utils';
import type { NewsArticle } from '@winajes/shared';

interface Props {
  slug: string;
}

function withContent(articles: typeof fallbackNews): NewsArticle[] {
  return articles.map((a) => ({
    ...a,
    content: { ko: a.excerpt.ko, en: a.excerpt.en },
    tags: a.tags ?? [],
  }));
}

export default function NewsDetailClient({ slug }: Props) {
  const t = useTranslations('news');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ko' | 'en';
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    fetch(`${API_URL}/api/news/slug/${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return Promise.reject();
        }
        if (!r.ok) return Promise.reject();
        return r.json();
      })
      .then((data: NewsArticle) => {
        setArticle(data);
        return fetch(`${API_URL}/api/news`, { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : []))
          .then((all: NewsArticle[]) => {
            setRelated(
              all.filter((a) => a.id !== data.id && a.category === data.category).slice(0, 3),
            );
          });
      })
      .catch(() => {
        const fallback = withContent(fallbackNews).find((a) => a.slug === slug);
        if (fallback) {
          setArticle(fallback);
          setRelated(
            withContent(fallbackNews)
              .filter((a) => a.id !== fallback.id && a.category === fallback.category)
              .slice(0, 3),
          );
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <Section>
        <p className="text-center text-muted-foreground">{tCommon('loading')}</p>
      </Section>
    );
  }

  if (!article || notFound) {
    return (
      <Section>
        <div className="mx-auto max-w-lg text-center">
          <p className="text-muted-foreground">{t('detail.notFound')}</p>
          <Link
            href="/news"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('detail.backToList')}
          </Link>
        </div>
      </Section>
    );
  }

  const body =
    article.content[locale]?.trim() || article.excerpt[locale]?.trim() || '';

  return (
    <>
      <section className="relative flex min-h-[280px] items-end overflow-hidden pt-[72px] md:min-h-[320px]">
        {article.image ? (
          <Image
            src={article.image}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/70 to-primary/30" />
        <Container className="relative z-10 py-14 md:py-16">
          <Link
            href="/news"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('detail.backToList')}
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{t(`categories.${article.category}`)}</Badge>
            <time className="text-sm text-white/75">{article.publishedAt.slice(0, 10)}</time>
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
            {article.title[locale]}
          </h1>
        </Container>
      </section>

      <Section>
        <article className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-muted-foreground">{article.excerpt[locale]}</p>
          {body && body !== article.excerpt[locale] && (
            <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {body}
            </div>
          )}
          {article.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </Section>

      {related.length > 0 && (
        <Section variant="muted">
          <h2 className="mb-8 text-2xl font-extrabold text-primary">{t('detail.related')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="group">
                <Card hover padding="sm">
                  <Badge variant="secondary">{t(`categories.${item.category}`)}</Badge>
                  <h3 className="mt-3 font-bold transition-colors group-hover:text-primary">
                    {item.title[locale]}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {item.excerpt[locale]}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground/70">
                    {item.publishedAt.slice(0, 10)}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
