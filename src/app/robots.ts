import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Set NEXT_PUBLIC_ALLOW_INDEXING=true only on the live domain, after launch approval.
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
  return {
    rules: allow
      ? [{ userAgent: '*', allow: '/', disallow: ['/api/', '/keystatic'] }]
      : [{ userAgent: '*', disallow: '/' }],
    ...(allow ? { sitemap: `${siteUrl()}/sitemap.xml` } : {}),
  };
}
