import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCta } from '@/components/check-cta';
import { Cover } from '@/components/cover';
import { RichText, hasContent } from '@/components/markdoc';
import { MediaCard } from '@/components/media-card';
import { ShareActions } from '@/components/share-actions';
import { TrackedLink } from '@/components/tracked-link';
import { Band, JsonLd, Mark, MetaList, buttonClass } from '@/components/ui';
import { EpisodeViewTracker, VideoEmbed } from '@/components/video-embed';
import { formatDate, getEpisode, getEpisodes, getMediaItems, safeUrl, youtubeId } from '@/lib/content';
import { pillarCopy, site, siteUrl } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const episodes = await getEpisodes();
  // Before the first episode is published there is nothing to pre-render. The placeholder
  // never resolves to an episode, so it returns the not-found page.
  return episodes.length ? episodes.map((e) => ({ slug: e.slug })) : [{ slug: 'coming-soon' }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) return { title: 'Episode not found', robots: { index: false } };
  const title = episode.seoTitle || episode.title;
  const description = episode.seoDescription || episode.description;
  return {
    title,
    description,
    alternates: { canonical: `/podcast/${episode.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/podcast/${episode.slug}`,
      ...(episode.publishDate ? { publishedTime: episode.publishDate } : {}),
      ...(episode.image ? { images: [{ url: episode.image }] } : {}),
    },
  };
}

const closingLine: Record<string, string> = {
  earn: 'If this conversation made you think about how you earn, the Financial Resilience Check looks at that alongside what you are building and protecting.',
  build: 'If this conversation made you think about what you are building, the Financial Resilience Check looks at that alongside how you earn and what protects it.',
  protect: 'If this conversation made you think about what would happen if plans changed, the Financial Resilience Check is a calm place to reflect on it.',
};

export default async function EpisodePage({ params }: Params) {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) notFound();

  const [notes, allMedia, allEpisodes] = await Promise.all([episode.showNotes(), getMediaItems(), getEpisodes()]);
  const videoId = youtubeId(episode.youtubeUrl);
  const base = siteUrl();
  const url = `${base}/podcast/${episode.slug}`;

  const listen = [
    { key: 'youtube', label: 'Watch on YouTube', url: safeUrl(episode.youtubeUrl) },
    { key: 'spotify', label: 'Listen on Spotify', url: safeUrl(episode.spotifyUrl) },
    { key: 'applePodcasts', label: 'Listen on Apple Podcasts', url: safeUrl(episode.applePodcastsUrl) },
  ].filter((l): l is { key: string; label: string; url: string } => Boolean(l.url));

  const relatedSlugs = episode.relatedSlugs.length
    ? episode.relatedSlugs
    : allEpisodes
        .filter((e) => e.slug !== episode.slug && e.pillars.some((p) => episode.pillars.includes(p)))
        .map((e) => e.slug);
  const related = relatedSlugs
    .map((s) => allMedia.find((m) => m.id === `episode-${s}`))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .slice(0, 3);

  const meta = [
    episode.season != null && episode.episodeNumber != null ? `Season ${episode.season}, episode ${episode.episodeNumber}` : null,
    episode.mediaType === 'video' ? 'Video' : 'Audio',
    episode.durationMinutes ? `${episode.durationMinutes} min` : null,
    formatDate(episode.publishDate),
  ].filter(Boolean);

  const transcript = episode.transcript
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <EpisodeViewTracker slug={episode.slug} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'PodcastEpisode',
          '@id': `${url}#episode`,
          url,
          name: episode.title,
          description: episode.description,
          inLanguage: 'en-GB',
          ...(episode.publishDate ? { datePublished: episode.publishDate } : {}),
          ...(episode.episodeNumber ? { episodeNumber: episode.episodeNumber } : {}),
          ...(episode.durationMinutes ? { timeRequired: `PT${episode.durationMinutes}M` } : {}),
          ...(episode.image ? { image: `${base}${episode.image}` } : {}),
          partOfSeries: {
            '@type': 'PodcastSeries',
            '@id': `${base}/podcast#series`,
            name: 'The Earn.Build.Protect Podcast',
            url: `${base}/podcast`,
          },
          ...(episode.guests.length
            ? { actor: episode.guests.map((g) => ({ '@type': 'Person', name: g.name })) }
            : {}),
          ...(videoId && episode.image && episode.publishDate
            ? {
                video: {
                  '@type': 'VideoObject',
                  name: episode.title,
                  description: episode.description,
                  thumbnailUrl: `${base}${episode.image}`,
                  uploadDate: episode.publishDate,
                  embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
                  ...(episode.durationMinutes ? { duration: `PT${episode.durationMinutes}M` } : {}),
                },
              }
            : {}),
        }}
      />

      <article>
        <header className="backdrop-studio bg-ink pb-16 pt-10 md:pb-20 md:pt-16">
          <div className="page">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-small text-stone-dark">
              <Link href="/podcast" className="underline underline-offset-4 transition-colors hover:text-paper">
                Podcast
              </Link>
              <span aria-hidden="true" className="text-ink-line">/</span>
              <span>Episode</span>
            </nav>
            <div className="mt-10">
              <MetaList items={meta as string[]} />
            </div>
            <h1 className="display mt-4 max-w-[20ch] text-h1">{episode.title}</h1>
            <p className="mt-6 max-w-prose font-serif text-lead text-stone-dark">{episode.description}</p>
            {episode.pillars.length ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {episode.pillars.map((p) => (
                  <li key={p}>
                    <Link
                      href={`/media?pillar=${p}`}
                      className="inline-flex min-h-[2.25rem] items-center rounded-full border border-paper/25 bg-paper/[0.04] px-4 text-meta font-bold transition-colors hover:border-amber hover:text-amber"
                    >
                      {pillarCopy[p].name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-12 max-w-5xl">
              {videoId ? (
                <VideoEmbed id={videoId} title={episode.title} slug={episode.slug} />
              ) : (
                <Cover image={episode.image} title={episode.title} priority sizes="(min-width: 1080px) 64rem, 100vw" />
              )}
            </div>
            {listen.length ? (
              <ul className="mt-6 flex flex-wrap gap-3" aria-label="Watch and listen">
                {listen.map((l) => (
                  <li key={l.key}>
                    <TrackedLink
                      href={l.url}
                      external
                      event="platform_click"
                      eventProps={{ platform: l.key, placement: 'episode', episode: episode.slug }}
                      className={buttonClass('line-light')}
                    >
                      {l.label}
                    </TrackedLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </header>

        <div className="on-paper bg-paper py-section text-ink">
          <div className="page grid gap-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
            <div className="min-w-0 space-y-14">
              {episode.keyTakeaways.length ? (
                <section aria-labelledby="takeaways">
                  <h2 id="takeaways" className="display text-h3">
                    Key takeaways
                  </h2>
                  <ul className="card-light rows mt-6 max-w-prose px-6 md:px-8">
                    {episode.keyTakeaways.map((t, i) => (
                      <li key={i} className="flex gap-4 py-5 font-serif text-lead">
                        <span className="mt-1 font-display text-meta font-bold tabular-nums text-amber-deep" aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {hasContent(notes) ? (
                <section aria-labelledby="show-notes">
                  <h2 id="show-notes" className="display text-h3">
                    Show notes
                  </h2>
                  <div className="prose-ebp mt-6">
                    <RichText node={notes} />
                  </div>
                </section>
              ) : null}

              {transcript.length ? (
                <section aria-labelledby="transcript">
                  <h2 id="transcript" className="display text-h3">
                    Transcript
                  </h2>
                  <details className="card-light group mt-6 max-w-prose overflow-hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-bold [&::-webkit-details-marker]:hidden">
                      Read the full transcript
                      <span className="text-h4 leading-none text-amber-deep transition-transform group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <div className="prose-ebp border-t border-paper-line px-6 pb-8 pt-6 text-[1.0625rem]">
                      {transcript.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </details>
                </section>
              ) : null}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
              {episode.timestamps.length ? (
                <section aria-labelledby="timestamps" className="card-light p-6">
                  <h2 id="timestamps" className="text-h4 font-bold">
                    In this episode
                  </h2>
                  <ol className="rows mt-4">
                    {episode.timestamps.map((t, i) => (
                      <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-3 py-3 text-small">
                        <span className="font-bold tabular-nums text-amber-deep">{t.time}</span>
                        <span>{t.label}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              {episode.guests.length || episode.host ? (
                <section aria-labelledby="people" className="card-light p-6">
                  <h2 id="people" className="text-h4 font-bold">
                    In conversation
                  </h2>
                  <ul className="mt-5 space-y-6">
                    {episode.guests.map((g) => (
                      <li key={g.slug} className="flex gap-4">
                        {g.photo ? (
                          <Image src={g.photo} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover" />
                        ) : null}
                        <div>
                          <p className="font-bold">
                            {safeUrl(g.link) ? (
                              <a href={safeUrl(g.link)!} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                                {g.name}
                                <span className="sr-only"> (opens in a new tab)</span>
                              </a>
                            ) : (
                              g.name
                            )}
                          </p>
                          {g.role ? <p className="text-small text-stone-light">{g.role}</p> : null}
                          {g.bio ? <p className="mt-2 text-small">{g.bio}</p> : null}
                        </div>
                      </li>
                    ))}
                    {episode.host ? (
                      <li>
                        <p className="font-bold">{episode.host}</p>
                        <p className="text-small text-stone-light">Host</p>
                      </li>
                    ) : null}
                  </ul>
                </section>
              ) : null}
            </aside>
          </div>
        </div>

        <div className="on-amber relative overflow-hidden bg-amber py-16 text-ink md:py-20">
          <Mark className="pointer-events-none absolute -bottom-8 -right-8 h-64 w-auto text-ink/[0.06]" />
          <div className="page relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center md:gap-16">
            <div>
              <h2 className="display text-h2">How financially resilient are you?</h2>
              <p className="mt-4 max-w-prose font-serif text-lead">
                {closingLine[episode.pillars[0]] ??
                  'The Financial Resilience Check is a self-assessment across earning, building and protecting.'}
              </p>
            </div>
            <div>
              <CheckCta placement={`episode_${episode.slug}`} variant="ink" />
              <p className="mt-3 text-meta">An educational self-assessment. Not financial advice.</p>
            </div>
          </div>
        </div>

        <div className="border-b border-ink-line bg-ink py-14">
          <div className="page">
            <ShareActions url={url} title={`${episode.title} | ${site.name}`} />
          </div>
        </div>
      </article>

      {related.length ? (
        <Band tone="raised" labelledBy="related" className="border-t border-ink-line">
          <h2 id="related" className="display text-h2">
            Related episodes
          </h2>
          <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <MediaCard item={item} />
              </li>
            ))}
          </ul>
        </Band>
      ) : null}
    </>
  );
}
