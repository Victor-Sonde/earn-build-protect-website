import type { MetadataRoute } from 'next';
import { getArticles, getEpisodes } from '@/lib/content';
import { siteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [episodes, articles] = await Promise.all([getEpisodes(), getArticles()]);
  const pages = ['', '/podcast', '/media', '/financial-resilience-check', '/about', '/contact'];
  return [
    ...pages.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...episodes.map((e) => ({
      url: `${base}/podcast/${e.slug}`,
      ...(e.publishDate ? { lastModified: e.publishDate } : {}),
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${base}/insights/${a.slug}`,
      ...(a.publishDate ? { lastModified: a.publishDate } : {}),
      priority: 0.6,
    })),
  ];
}
