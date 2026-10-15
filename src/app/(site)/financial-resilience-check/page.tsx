import type { Metadata } from 'next';
import { CheckCta } from '@/components/check-cta';
import { TrackedLink } from '@/components/tracked-link';
import { Arrow, Band, ButtonLink, Mark, buttonClass } from '@/components/ui';
import { getSettings } from '@/lib/content';
import { pillarCopy, pillarOrder } from '@/lib/site';

const description =
  'The Financial Resilience Check is an educational self-assessment across earning, building and protecting. See what it is, who it may suit and what to expect.';

export const metadata: Metadata = {
  title: 'Financial Resilience Check',
  description,
  alternates: { canonical: '/financial-resilience-check' },
  openGraph: { title: 'Financial Resilience Check', description, url: '/financial-resilience-check' },
};

const steps = [
  {
    title: 'Open the Check',
    body: 'The button on this page takes you to the Financial Resilience Check, which runs in its own application, separate from this website.',
  },
  {
    title: 'Answer questions across three pillars',
    body: 'You reflect on how you earn, what you are building and what protects it. Answer from where you are today, not where you think you should be.',
  },
  {
    title: 'Read your insights',
    body: 'You see general educational insights for each pillar, and the areas you may wish to explore further.',
  },
];

function Tick() {
  return (
    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-amber" aria-hidden="true">
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" focusable="false">
        <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default async function CheckPage() {
  const { protectionReview } = await getSettings();
  return (
    <>
      <section
        className="on-amber relative overflow-hidden bg-amber pb-20 pt-16 text-ink md:pb-28 md:pt-24"
        aria-labelledby="check-title"
      >
        <Mark className="pointer-events-none absolute -bottom-10 -right-10 hidden h-[85%] w-auto text-ink/[0.07] md:block" />
        <div className="page relative">
          <h1 id="check-title" className="display max-w-[15ch] text-h1">
            Understand your financial resilience. Start with a simple check.
          </h1>
          <p className="mt-8 max-w-prose font-serif text-lead md:text-[1.4375rem]">
            The Financial Resilience Check is a self-assessment that helps you reflect on how prepared you feel across
            earning, building and protecting, and where you may want to look next.
          </p>
          <div className="mt-10">
            <CheckCta placement="check_page_hero" label="Start my Financial Resilience Check" variant="ink" />
          </div>
          <p className="mt-5 text-small">An educational self-assessment. Not financial advice.</p>
        </div>
      </section>

      <Band tone="paper" labelledBy="what-it-is">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 id="what-it-is" className="display text-h2">
              What the Check is
            </h2>
            <div className="mt-6 max-w-prose space-y-5 font-serif text-lead text-stone-light">
              <p>
                Financial resilience is how well your finances could cope if life changed: a job ending, a business
                slowing, an unexpected cost, time away from work.
              </p>
              <p>
                The Check gives you a structured way to think about that. It looks at three connected areas and
                reflects back general educational insights for each one.
              </p>
            </div>
          </div>
          <dl className="card-light rows self-start px-6 md:px-8">
            {pillarOrder.map((key) => (
              <div key={key} className="grid gap-1 py-6 sm:grid-cols-[8rem_1fr] sm:gap-6">
                <dt className="display text-h3">{pillarCopy[key].name}</dt>
                <dd className="text-stone-light">{pillarCopy[key].body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>

      <Band tone="paper-deep" labelledBy="who-for">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="card-light p-7 md:p-10">
            <h2 id="who-for" className="display text-h2">
              Who it may be useful for
            </h2>
            <ul className="mt-8 max-w-prose space-y-5 font-serif text-lead">
              {[
                'Professionals who want a clearer picture of where they stand',
                'Entrepreneurs and business owners whose income moves from month to month',
                'Anyone facing a change, such as a new role, a new business or a growing family',
                'Anyone who has never sat down and looked at earning, building and protecting together',
              ].map((line) => (
                <li key={line} className="flex gap-4">
                  <Tick />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-light p-7 md:p-10">
            <h2 className="display text-h2">What to expect</h2>
            <ul className="mt-8 max-w-prose space-y-5 font-serif text-lead">
              {[
                'Questions for reflection, not a test you can pass or fail',
                'General educational insights, not a personal recommendation',
                'No requirement to speak to anyone afterwards',
              ].map((line) => (
                <li key={line} className="flex gap-4">
                  <Tick />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      <Band tone="ink" labelledBy="how-it-works">
        <h2 id="how-it-works" className="display text-h2">
          How it works
        </h2>
        <ol className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {steps.map((step, i) => (
            <li key={step.title} className="card-dark relative overflow-hidden p-7 md:p-9">
              <span className="absolute inset-x-0 top-0 h-1 bg-amber" style={{ opacity: 0.4 + i * 0.3 }} aria-hidden="true" />
              <p className="display text-h1 leading-none text-amber" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-8 text-h4 font-bold">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-3 max-w-[40ch] text-stone-dark">{step.body}</p>
            </li>
          ))}
        </ol>
      </Band>

      <Band tone="raised" labelledBy="afterwards" className="border-t border-ink-line">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div>
            <h2 id="afterwards" className="display text-h2">
              What happens afterwards
            </h2>
            <div className="mt-6 max-w-prose space-y-5 font-serif text-lead text-stone-dark">
              <p>
                What you do with your insights is up to you. Some people use them as a prompt to read, listen and
                learn more. Others use them to start a conversation with someone qualified to help.
              </p>
              <p>
                This website does not collect or see your answers. The Check runs in its own application, which
                explains how your information is handled before you begin.
              </p>
            </div>
          </div>
          <div className="rounded-panel border border-amber/40 bg-ink p-7 shadow-lift-dark md:p-10">
            <h2 className="flex items-center gap-3 text-h4 font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/15 text-amber" aria-hidden="true">
                <svg viewBox="0 0 20 20" className="h-4 w-4" focusable="false">
                  <path d="M10 6v5m0 3.5v.01" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                </svg>
              </span>
              What the Check is not
            </h2>
            <p className="mt-5 text-stone-dark">
              The Financial Resilience Check is an educational tool. It does not provide regulated financial advice,
              it does not recommend any product or provider, and its insights are not based on a full assessment of
              your personal circumstances. If you need advice, speak to an appropriately authorised adviser.
            </p>
          </div>
        </div>
      </Band>

      {/* Renders only when switched on in Website settings with approved wording, link and disclosure. */}
      {protectionReview ? (
        <Band tone="paper" labelledBy="adviser-pathway">
          <div className="card-light max-w-[48rem] p-7 sm:p-10 md:p-12" data-region="adviser-pathway">
            <h2 id="adviser-pathway" className="display text-h2">
              {protectionReview.heading}
            </h2>
            <p className="mt-5 max-w-prose whitespace-pre-line font-serif text-lead text-stone-light">{protectionReview.body}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
              <TrackedLink
                href={protectionReview.url}
                external
                event="adviser_pathway_click"
                eventProps={{ placement: 'check_page', target: 'adviser_page' }}
                className={buttonClass('ink')}
              >
                {protectionReview.buttonLabel}
                <Arrow />
              </TrackedLink>
              {protectionReview.secondary ? (
                <p>
                  <TrackedLink
                    href={protectionReview.secondary.url}
                    external
                    event="adviser_pathway_click"
                    eventProps={{ placement: 'check_page', target: 'booking' }}
                    className="text-link"
                  >
                    {protectionReview.secondary.label}
                  </TrackedLink>
                </p>
              ) : null}
            </div>
            <p className="mt-7 whitespace-pre-line border-t border-paper-line pt-5 text-small text-stone-light">
              {protectionReview.disclosure}
            </p>
          </div>
        </Band>
      ) : null}

      <Band tone="amber" labelledBy="check-closing" className="relative overflow-hidden">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="check-closing" className="display max-w-[14ch] text-h1">
            Start with where you stand today
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CheckCta placement="check_page_closing" label="Start my Financial Resilience Check" variant="ink" />
            <ButtonLink href="/podcast" variant="line-dark">
              Explore the podcast first
            </ButtonLink>
          </div>
        </div>
      </Band>
    </>
  );
}
