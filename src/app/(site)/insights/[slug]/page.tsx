import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCta } from '@/components/check-cta';
import { Cover } from '@/components/cover';
import { RichText } from '@/components/markdoc';
import { JsonLd, MetaList } from '@/components/ui';
import { formatDate, getArticles } from '@/lib/content';
import { pillarCopy, site, siteUrl } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.length ? articles.map((a) => ({ slug: a.slug })) : [{ slug: 'coming-soon' }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = (await getArticles()).find((a) => a.slug === slug);
  if (!article) return { title: 'Article not found', robots: { index: false } };
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.description;
  return {
    title,
    description,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: { type: 'article', title, description, url: `/insights/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = (await getArticles()).find((a) => a.slug === slug);
  if (!article) notFound();
  const body = await article.body();
  const url = `${siteUrl()}/insights/${article.slug}`;
  const meta = [
    'Article',
    article.pillars.map((p) => pillarCopy[p].name).join(', '),
    article.author,
    formatDate(article.publishDate),
  ].filter(Boolean);

  return (
    <article>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          url,
          ...(article.publishDate ? { datePublished: article.publishDate } : {}),
          ...(article.author ? { author: { '@type': 'Person', name: article.author } } : {}),
          publisher: { '@type': 'Organization', name: site.name },
        }}
      />
      <header className="backdrop-studio bg-ink pb-16 pt-10 md:pb-20 md:pt-16">
        <div className="page">
          <nav aria-label="Breadcrumb" className="text-small text-stone-dark">
            <Link href="/media" className="underline underline-offset-4 transition-colors hover:text-paper">
              Media library
            </Link>
          </nav>
          <div className="mt-10">
            <MetaList items={meta as string[]} />
          </div>
          <h1 className="display mt-4 max-w-[20ch] text-h1">{article.title}</h1>
          <p className="mt-6 max-w-prose font-serif text-lead text-stone-dark">{article.description}</p>
          {article.image ? (
            <div className="mt-12 max-w-5xl">
              <Cover image={article.image} title={article.title} priority sizes="(min-width: 1080px) 64rem, 100vw" />
            </div>
          ) : null}
        </div>
      </header>
      <div className="on-paper bg-paper py-section text-ink">
        <div className="page">
          <div className="prose-ebp mx-auto">
            <RichText node={body} />
          </div>
          <div className="card-light mx-auto mt-16 max-w-prose p-7 md:p-10">
            <h2 className="display text-h3">How financially resilient are you?</h2>
            <p className="mt-3 font-serif text-lead text-stone-light">
              The Financial Resilience Check is an educational self-assessment across earning, building and
              protecting. Not financial advice.
            </p>
            <div className="mt-6">
              <CheckCta placement={`article_${article.slug}`} variant="ink" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
