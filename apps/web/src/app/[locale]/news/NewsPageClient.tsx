'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { newsArticles as fallbackNews } from '@/lib/data';
import { API_URL } from '@/lib/utils';
import type { NewsArticle } from '@/lib/shared';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';

export default function NewsPageClient() {
  const t = useTranslations('news');
  const locale = useLocale() as 'ko' | 'en';
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/news`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setArticles)
      .catch(() => {
        setArticles(fallbackNews.map((a) => ({
          ...a,
          content: { ko: a.excerpt.ko, en: a.excerpt.en },
        })));
      });
  }, []);

  return (
    <>
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image="/images/hero/hero-5.jpg"
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`} className="group">
              <Card hover padding="sm" className="overflow-hidden p-0">
                <div className="relative h-48 bg-gradient-to-br from-primary/8 to-secondary/15">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl font-extrabold text-primary/15">NEWS</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <Badge variant="secondary">{t(`categories.${article.category}`)}</Badge>
                  <h2 className="mt-3 text-xl font-bold transition-colors group-hover:text-primary">
                    {article.title[locale]}
                  </h2>
                  <p className="mt-2 text-muted-foreground">{article.excerpt[locale]}</p>
                  <p className="mt-4 text-sm text-muted-foreground/70">{article.publishedAt.slice(0, 10)}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
