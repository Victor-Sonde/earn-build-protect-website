import Link from 'next/link';
import type { Episode, Platform } from '@/lib/content';
import { formatDate } from '@/lib/content';
import { Cover } from './cover';
import { PlatformLinks } from './platform-links';
import { ButtonLink, MetaList } from './ui';

/** Featured episode, or an honest "in production" state when nothing has been released. */
export function FeaturedEpisode({
  episode,
  platforms,
  headingId,
  showAllLink = true,
}: {
  episode: Episode | null;
  platforms: Platform[];
  headingId: string;
  showAllLink?: boolean;
}) {
  if (!episode) {
    return (
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="shadow-lift-dark rounded-panel">
          <Cover image={null} title="Season one" caption="In production" />
        </div>
        <div>
          <h2 id={headingId} className="display text-h2">
            The podcast is in production
          </h2>
          <p className="mt-5 max-w-prose font-serif text-lead text-stone-dark">
            Season one of the Earn.Build.Protect Podcast is being made. Episodes will appear here when they are
            released, with video, show notes and a full transcript.
          </p>
          {platforms.length ? (
            <div className="mt-8">
              <p className="mb-3 text-small font-bold">Follow now so you do not miss the first episode</p>
              <PlatformLinks platforms={platforms} placement="featured_coming_soon" />
            </div>
          ) : null}
          {showAllLink ? (
            <div className="mt-9">
              <ButtonLink href="/podcast" variant="line-light" arrow>
                About the podcast
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
  const meta = [
    episode.season != null && episode.episodeNumber != null ? `Season ${episode.season}, episode ${episode.episodeNumber}` : null,
    episode.mediaType === 'video' ? 'Video' : 'Audio',
    episode.durationMinutes ? `${episode.durationMinutes} min` : null,
    formatDate(episode.publishDate),
  ].filter((m): m is string => Boolean(m));
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <Link href={`/podcast/${episode.slug}`} aria-hidden="true" tabIndex={-1} className="group block rounded-panel shadow-lift-dark">
        <Cover image={episode.image} title={episode.title} priority />
      </Link>
      <div>
        <MetaList items={meta} />
        <h2 id={headingId} className="display mt-4 text-h2">
          {episode.title}
        </h2>
        <p className="mt-5 max-w-prose font-serif text-lead text-stone-dark">{episode.description}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href={`/podcast/${episode.slug}`}>
            {episode.mediaType === 'video' ? 'Watch the episode' : 'Listen to the episode'}
          </ButtonLink>
          {showAllLink ? (
            <ButtonLink href="/podcast#episodes" variant="line-light">
              All episodes
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </div>
  );
}
