import type { Metadata } from 'next';
import { CheckCta } from '@/components/check-cta';
import { FeaturedEpisode } from '@/components/featured-episode';
import { MediaCard } from '@/components/media-card';
import { PlatformLinks } from '@/components/platform-links';
import { Band, ButtonLink, JsonLd, PageIntro, StepMark } from '@/components/ui';
import { getEpisodes, getMediaItems, getSettings } from '@/lib/content';
import { pillarCopy, pillarOrder, site, siteUrl } from '@/lib/site';
import Image from 'next/image';

const description =
  'The Earn.Build.Protect Podcast: real conversations about earning, building and protecting, and the decisions that connect them.';

export const metadata: Metadata = {
  title: 'The Earn.Build.Protect Podcast',
  description,
  alternates: { canonical: '/podcast' },
  openGraph: { title: 'The Earn.Build.Protect Podcast', description, url: '/podcast' },
};

export default async function PodcastPage() {
  const [episodes, media, settings] = await Promise.all([getEpisodes(), getMediaItems(), getSettings()]);
  const featured = episodes.find((e) => e.featured) ?? episodes[0] ?? null;
  const episodeItems = media.filter((m) => m.kind === 'episode');
  const seasons = [...new Set(episodes.map((e) => e.season ?? 0))].sort((a, b) => b - a);
  const base = siteUrl();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'PodcastSeries',
          '@id': `${base}/podcast#series`,
          name: 'The Earn.Build.Protect Podcast',
          description,
          url: `${base}/podcast`,
          inLanguage: 'en-GB',
          publisher: { '@id': `${base}/#organisation` },
          ...(settings.platforms.length ? { sameAs: settings.platforms.map((p) => p.url) } : {}),
        }}
      />
      <PageIntro
        title="The Earn.Build.Protect Podcast"
        lead="Real conversations about the financial decisions life puts in front of you: how people earn, what they build with it, and how they protect it when plans change."
      >
        {settings.platforms.length ? (
          <PlatformLinks platforms={settings.platforms} placement="podcast_hero" />
        ) : (
          <p className="kicker text-amber">{site.tagline}</p>
        )}
      </PageIntro>

      <Band tone="raised" labelledBy="podcast-featured" className="border-b border-ink-line">
        <FeaturedEpisode
          episode={featured}
          platforms={settings.platforms}
          headingId="podcast-featured"
          showAllLink={false}
        />
      </Band>

      {episodes.length ? (
        <Band tone="ink" id="episodes" labelledBy="episodes-heading">
          <h2 id="episodes-heading" className="display text-h2">
            All episodes
          </h2>
          {seasons.map((season) => (
            <div key={season} className="mt-12">
              {season ? (
                <h3 className="flex items-center gap-4 text-h4 font-bold">
                  Season {season}
                  <span className="h-px flex-1 bg-ink-line" aria-hidden="true" />
                </h3>
              ) : null}
              <ul className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {episodes
                  .filter((e) => (e.season ?? 0) === season)
                  .map((e) => {
                    const item = episodeItems.find((m) => m.id === `episode-${e.slug}`);
                    return item ? (
                      <li key={e.slug}>
                        <MediaCard item={item} />
                      </li>
                    ) : null;
                  })}
              </ul>
            </div>
          ))}
        </Band>
      ) : null}

      <Band tone="paper" labelledBy="what-we-cover">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <h2 id="what-we-cover" className="display text-h2">
              What the show covers
            </h2>
            <p className="mt-5 max-w-prose font-serif text-lead text-stone-light">
              Every episode sits under one or more of three pillars. Most real decisions touch more than one, and the
              conversations follow them wherever they lead.
            </p>
          </div>
          <dl className="card-light rows px-6 md:px-9">
            {pillarOrder.map((key, i) => (
              <div key={key} className="grid gap-2 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <dt className="flex items-center gap-3">
                  <StepMark step={i as 0 | 1 | 2} className="h-5 w-auto text-amber-deep" />
                  <span className="display text-h3">{pillarCopy[key].name}</span>
                </dt>
                <dd className="text-stone-light">{pillarCopy[key].body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>

      <Band tone="paper-deep" labelledBy="people-heading">
        <h2 id="people-heading" className="display text-h2">
          Who makes the show
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          {settings.host ? (
            <div className="card-light flex gap-6 p-7 md:p-9">
              {settings.host.photo ? (
                <Image
                  src={settings.host.photo}
                  alt=""
                  width={112}
                  height={112}
                  className="h-28 w-28 shrink-0 rounded-full object-cover ring-4 ring-paper-deep"
                />
              ) : null}
              <div>
                <h3 className="text-h4 font-bold">{settings.host.name}</h3>
                <p className="text-small font-bold text-amber-deep">{settings.host.role || 'Host'}</p>
                {settings.host.bio ? (
                  <p className="mt-3 whitespace-pre-line text-stone-light">{settings.host.bio}</p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-panel border-2 border-dashed border-paper-line p-7 md:p-9">
              <h3 className="text-h4 font-bold">Host</h3>
              <p className="mt-3 max-w-[40ch] text-stone-light">
                The season one host will be introduced here ahead of the first episode.
              </p>
            </div>
          )}
          <div className="card-light p-7 md:p-9">
            <h3 className="text-h4 font-bold">{site.founder}</h3>
            <p className="text-small font-bold text-amber-deep">Creator and executive producer</p>
            <p className="mt-3 max-w-[44ch] text-stone-light">
              {site.founder} founded Earn.Build.Protect and contributes to the show as a recurring voice.
            </p>
          </div>
        </div>
      </Band>

      <Band tone="ink" labelledBy="guest-heading">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <div className="card-dark p-7 md:p-10">
            <h2 id="guest-heading" className="display text-h2">
              Know someone with a story worth hearing?
            </h2>
            <p className="mt-5 max-w-prose font-serif text-lead text-stone-dark">
              Suggest a guest, or put yourself forward. Tell us who they are and which decision they could speak
              about from experience.
            </p>
            <div className="mt-7">
              <ButtonLink href="/contact?type=guest" variant="line-light" arrow>
                Suggest a podcast guest
              </ButtonLink>
            </div>
          </div>
          <div className="backdrop-studio card-dark p-7 md:p-10">
            <h2 className="display text-h3">While you are here</h2>
            <p className="mt-4 max-w-prose font-serif text-lead text-stone-dark">
              The Financial Resilience Check is the companion to the show: a self-assessment across the same three
              pillars.
            </p>
            <div className="mt-7">
              <CheckCta placement="podcast_page" />
            </div>
          </div>
        </div>
      </Band>
    </>
  );
}
