import type { Metadata } from 'next';
import { CheckCta } from '@/components/check-cta';
import { Band, ButtonLink, PageIntro, StepMark } from '@/components/ui';
import { getSettings } from '@/lib/content';
import { pillarCopy, pillarOrder, site } from '@/lib/site';

const description =
  'Earn.Build.Protect is a financial resilience media and engagement brand. Read why it exists, how the three pillars connect and the principles behind the content.';

export const metadata: Metadata = {
  title: 'About',
  description,
  alternates: { canonical: '/about' },
  openGraph: { title: 'About Earn.Build.Protect', description, url: '/about' },
};

const principles = [
  {
    title: 'Education, not advice',
    body: 'Everything published here is general information. It is there to help you think, ask better questions and decide for yourself.',
  },
  {
    title: 'Lived experience first',
    body: 'The most useful lessons come from people who have faced the decision. Conversations start with what happened, not with theory.',
  },
  {
    title: 'Plain language',
    body: 'If an idea cannot be explained simply, it is explained again until it can. Jargon is translated, not assumed.',
  },
  {
    title: 'No promised outcomes',
    body: 'Nobody can guarantee a financial result, so nothing here does. Content shows options and trade-offs, not certainties.',
  },
];

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <PageIntro
        title="Helping people make sense of real financial decisions"
        lead="Earn.Build.Protect is a media and financial resilience initiative. It brings together a podcast, a growing library of practical content and the Financial Resilience Check."
      />

      <Band tone="paper" labelledBy="why">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <h2 id="why" className="display text-h2 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            Why it exists
          </h2>
          <div className="max-w-prose space-y-6 font-serif text-lead text-stone-light">
            <p className="border-l-4 border-amber pl-6 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.3] text-ink">
              Financial information is everywhere. Relatable conversations that help people make sense of their own
              decisions are harder to find.
            </p>
            <p>
              Most people do not struggle for lack of facts. They struggle to connect those facts to their own
              situation: a career that is changing, a business that is growing, a family that depends on them.
            </p>
            <p>
              Earn.Build.Protect exists to bridge that gap. The mission is to help people earn better, build stronger
              and protect what matters, through real conversations, practical insights and useful tools.
            </p>
          </div>
        </div>
      </Band>

      <Band tone="paper-deep" labelledBy="philosophy">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div>
            <h2 id="philosophy" className="display text-h2">
              One philosophy, three pillars
            </h2>
            <p className="mt-5 max-w-prose font-serif text-lead text-stone-light">
              Earning, building and protecting are not separate subjects. Each one depends on the other two, and
              financial resilience is what you get when all three are working together.
            </p>
          </div>
          <dl className="card-light rows px-6 md:px-9">
            {pillarOrder.map((key, i) => (
              <div key={key} className="grid gap-3 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <dt>
                  <StepMark step={i as 0 | 1 | 2} className="mb-3 h-5 w-auto text-amber-deep" />
                  <span className="display block text-h3">{pillarCopy[key].name}</span>
                  <span className="font-serif italic text-amber-deep">{pillarCopy[key].line}</span>
                </dt>
                <dd className="self-end text-stone-light">{pillarCopy[key].body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>

      <Band tone="ink" labelledBy="principles">
        <h2 id="principles" className="display text-h2">
          Editorial principles
        </h2>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
          {principles.map((p, i) => (
            <li key={p.title} className="card-dark p-7 md:p-9">
              <span className="text-meta font-bold tabular-nums text-amber" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-h3 font-bold tracking-[-0.01em]">{p.title}</h3>
              <p className="mt-3 max-w-[48ch] text-stone-dark">{p.body}</p>
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="paper" labelledBy="founder">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div>
            <h2 id="founder" className="display text-h2">
              Founder
            </h2>
          </div>
          <div className="card-light flex max-w-[44rem] flex-col gap-6 p-7 sm:flex-row sm:items-start md:p-10">
            <span
              className="display flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ink text-h3 text-amber"
              aria-hidden="true"
            >
              {site.founder
                .split(' ')
                .map((w) => w[0])
                .join('')}
            </span>
            <div>
              <h3 className="text-h3 font-bold">{site.founder}</h3>
              <p className="mt-1 text-small font-bold text-amber-deep">
                Founder of Earn.Build.Protect. Creator and executive producer of the podcast.
              </p>
              {settings.founderBio ? (
                <p className="mt-5 whitespace-pre-line font-serif text-lead text-stone-light">{settings.founderBio}</p>
              ) : (
                <p className="mt-5 font-serif text-lead text-stone-light">
                  {site.founder} created Earn.Build.Protect to help people navigate real-life financial decisions.
                </p>
              )}
            </div>
          </div>
        </div>
      </Band>

      <Band tone="raised" labelledBy="about-next">
        <h2 id="about-next" className="display text-h2">
          Where to go next
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          <div className="card-dark flex flex-col p-7 md:p-10">
            <h3 className="text-h3 font-bold">The podcast</h3>
            <p className="mt-3 max-w-[44ch] flex-1 text-stone-dark">
              Conversations about earning, building and protecting, with the people who have lived the decisions.
            </p>
            <div className="mt-8">
              <ButtonLink href="/podcast" variant="line-light" arrow>
                Explore the podcast
              </ButtonLink>
            </div>
          </div>
          <div className="backdrop-studio card-dark flex flex-col p-7 ring-amber/40 md:p-10">
            <h3 className="text-h3 font-bold">The Financial Resilience Check</h3>
            <p className="mt-3 max-w-[44ch] flex-1 text-stone-dark">
              An educational self-assessment across the same three pillars. Not financial advice.
            </p>
            <div className="mt-8">
              <CheckCta placement="about_page" />
            </div>
          </div>
        </div>
      </Band>
    </>
  );
}
