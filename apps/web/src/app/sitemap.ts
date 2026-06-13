import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getSiteUrl, STATIC_SEO_PATHS } from '@/lib/seo/metadata';
import { listNews } from '@/lib/cms/news.service';
import { listProjects } from '@/lib/cms/projects.service';
import { listServices } from '@/lib/cms/services.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_SEO_PATHS) {
      const url = path === '/' ? `${base}/${locale}` : `${base}/${locale}${path}`;
      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              path === '/' ? `${base}/${l}` : `${base}/${l}${path}`,
            ]),
          ),
        },
      });
    }
  }

  try {
    const [services, projects, news] = await Promise.all([
      listServices(),
      listProjects(),
      listNews(),
    ]);

    for (const locale of routing.locales) {
      for (const service of services) {
        entries.push({
          url: `${base}/${locale}/services/${service.slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
      for (const project of projects) {
        entries.push({
          url: `${base}/${locale}/projects/${project.slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
      for (const article of news) {
        entries.push({
          url: `${base}/${locale}/news/${article.slug}`,
          lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // CMS unavailable at build time — static routes only
  }

  return entries;
}
