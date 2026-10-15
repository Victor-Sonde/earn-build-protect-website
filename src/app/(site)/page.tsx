import Link from 'next/link';
import { CheckCta } from '@/components/check-cta';
import { FeaturedEpisode } from '@/components/featured-episode';
import { MediaCard } from '@/components/media-card';
import { Arrow, Band, ButtonLink, JsonLd, Mark, StepMark } from '@/components/ui';
import { getFeaturedEpisode, getMediaItems, getSettings } from '@/lib/content';
import { pillarCopy, pillarOrder, site, siteUrl } from '@/lib/site';

export default async function HomePage() {
  const [featured, media, settings] = await Promise.all([getFeaturedEpisode(), getMediaItems(), getSettings()]);
  const latest = media.filter((m) => !(featured && m.id === `episode-${featured.slug}`)).slice(0, 3);
  const base = siteUrl();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': `${base}/#organisation`,
              name: site.name,
              alternateName: site.shortName,
              url: base,
              slogan: site.tagline,
              founder: { '@type': 'Person', name: site.founder },
              ...(settings.platforms.length ? { sameAs: settings.platforms.map((p) => p.url) } : {}),
            },
            { '@type': 'WebSite', '@id': `${base}/#website`, url: base, name: site.name, inLanguage: 'en-GB' },
          ],
        }}
      />

      {/* Hero: the proposition is the artwork. Each verb steps further along one line. */}
      <section className="backdrop-studio bg-ink pb-20 pt-16 md:pb-28 md:pt-28" aria-labelledby="hero-heading">
        <Mark className="pointer-events-none absolute -right-16 bottom-0 hidden h-[78%] w-auto text-paper/[0.025] lg:block" />
        <div className="page">
          <h1 id="hero-heading" className="display text-hero">
            <span className="block">Earn better.</span>
            <span className="flex items-center gap-[0.16em]">
              <span
                className="through-line hidden h-[0.075em] w-[clamp(1.5rem,6vw,6rem)] shrink-0 rounded-full bg-amber sm:block"
                data-step="2"
                aria-hidden="true"
              />
              <span>Build stronger.</span>
            </span>
            <span className="flex items-center gap-[0.16em]">
              <span
                className="through-line hidden h-[0.075em] w-[clamp(3rem,12vw,12rem)] shrink-0 rounded-full bg-amber sm:block"
                data-step="3"
                aria-hidden="true"
              />
              <span className="text-amber">Protect what matters.</span>
            </span>
          </h1>
          <div className="mt-12 grid gap-8 border-t border-ink-line pt-10 md:mt-20 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
            <p className="max-w-[34ch] font-serif text-[clamp(1.3125rem,2.2vw,1.75rem)] leading-[1.35] text-stone-dark">
              {site.description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CheckCta placement="home_hero" />
              <ButtonLink href="/podcast" variant="line-light">
                Explore the podcast
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Three pillars as one rising sequence: each card lights its own bar of the mark. */}
      <Band tone="paper" labelledBy="pillars-heading">
        <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-end md:gap-16">
          <h2 id="pillars-heading" className="display text-h2">
            Three parts of one financial life
          </h2>
          <p className="max-w-prose font-serif text-lead text-stone-light">
            What you earn funds what you build. What you build is only as strong as what protects it. Every
            conversation on Earn.Build.Protect sits somewhere along that line.
          </p>
        </div>
        <ol className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3 md:items-start md:gap-5">
          {pillarOrder.map((key, i) => (
            <li
              key={key}
              className={`card-light flex flex-col p-7 transition-transform duration-300 hover:-translate-y-1 md:p-9 ${
                ['md:mt-16', 'md:mt-8', ''][i]
              }`}
            >
              <div className="flex items-start justify-between">
                <StepMark step={i as 0 | 1 | 2} className="h-7 w-auto text-amber-deep" />
                <span className="text-meta font-bold tabular-nums text-stone-light" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <h3 className="display mt-10 text-[clamp(2.5rem,5vw,4rem)] leading-none">{pillarCopy[key].name}</h3>
              <p className="mt-3 font-serif text-lead italic text-amber-deep">{pillarCopy[key].line}</p>
              <p className="mt-4 max-w-[38ch] text-stone-light">{pillarCopy[key].body}</p>
              <Link
                href={`/media?pillar=${key}`}
                className="group/btn mt-8 inline-flex items-center gap-2 self-start font-bold underline decoration-amber decoration-2 underline-offset-[6px] transition-colors hover:decoration-ink"
              >
                Browse {pillarCopy[key].name} conversations
                <Arrow />
              </Link>
            </li>
          ))}
        </ol>
      </Band>

      {/* Financial Resilience Check: the only amber surface on the site. */}
      <Band tone="amber" labelledBy="check-heading" className="relative overflow-hidden">
        <Mark className="pointer-events-none absolute -bottom-8 -right-8 h-80 w-auto text-ink/[0.06]" />
        <div className="relative grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-20">
          <div>
            <h2 id="check-heading" className="display text-h1">
              How financially resilient are you?
            </h2>
            <p className="mt-6 max-w-prose font-serif text-lead">
              The Financial Resilience Check is a self-assessment across earning, building and protecting. It helps you
              reflect on how prepared you feel and points out areas you may wish to explore further.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CheckCta placement="home_feature" variant="ink" />
              <ButtonLink href="/financial-resilience-check" variant="line-dark">
                How the Check works
              </ButtonLink>
            </div>
          </div>
          <dl className="card-amber rows-amber px-6 md:px-8">
            {[
              ['What it is', 'An educational tool for reflection, in a separate application.'],
              ['What you get', 'General insights for each of the three pillars.'],
              ['What it is not', 'Financial advice or a personal recommendation.'],
            ].map(([term, detail]) => (
              <div key={term} className="grid gap-1 py-5 sm:grid-cols-[8.5rem_1fr] sm:gap-4 md:py-6">
                <dt className="kicker pt-1">{term}</dt>
                <dd className="font-serif text-lead leading-snug">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>

      <Band tone="ink" labelledBy="featured-heading">
        <FeaturedEpisode episode={featured} platforms={settings.platforms} headingId="featured-heading" />
      </Band>

      <Band tone="paper-deep" labelledBy="philosophy-heading">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          <span className="display hidden select-none text-[10rem] leading-[0.8] text-amber-deep lg:block" aria-hidden="true">
            &ldquo;
          </span>
          <div>
            <h2 id="philosophy-heading" className="kicker text-stone-light">
              Why Earn.Build.Protect exists
            </h2>
            <p className="mt-6 max-w-[26ch] font-serif text-[clamp(1.75rem,4.4vw,3.5rem)] leading-[1.12] tracking-[-0.01em]">
              Financial information is everywhere. Conversations that help you make sense of your own decisions are
              harder to find.
            </p>
            <div className="mt-10 grid gap-8 border-t border-ink/15 pt-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
              <p className="max-w-prose font-serif text-lead text-stone-light">
                Earn.Build.Protect exists to bridge that gap, with honest conversations about real choices and practical
                tools you can use in your own time.
              </p>
              <div>
                <ButtonLink href="/about" variant="line-dark" arrow>
                  Read the philosophy
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Band>

      {latest.length ? (
        <Band tone="ink" labelledBy="latest-heading">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="latest-heading" className="display text-h2">
              Latest insights
            </h2>
            <ButtonLink href="/media" variant="line-light" arrow>
              Open the media library
            </ButtonLink>
          </div>
          <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((item) => (
              <li key={item.id}>
                <MediaCard item={item} />
              </li>
            ))}
          </ul>
        </Band>
      ) : null}

      <section
        className={`${latest.length ? 'bg-ink-raised' : 'bg-ink'} border-t border-ink-line py-section text-paper`}
        aria-labelledby="closing-heading"
      >
        <div className="page">
          <div className="backdrop-studio card-dark grid gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-16 md:px-14 md:py-16">
            <h2 id="closing-heading" className="display text-h1">
              Start with where you stand today
            </h2>
            <div>
              <p className="max-w-prose font-serif text-lead text-stone-dark">
                Take the Financial Resilience Check and see which of the three pillars you may want to look at first.
              </p>
              <div className="mt-8">
                <CheckCta placement="home_closing" />
              </div>
              <p className="mt-4 text-meta text-stone-dark">An educational self-assessment. Not financial advice.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
