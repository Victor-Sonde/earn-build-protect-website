import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'amber' | 'ink' | 'line-light' | 'line-dark';

const variants: Record<Variant, string> = {
  amber: 'bg-amber text-ink shadow-amber hover:bg-amber-soft',
  ink: 'bg-ink text-paper shadow-lift hover:bg-ink-raised',
  'line-light': 'text-paper ring-1 ring-inset ring-paper/35 hover:bg-paper/[0.07] hover:ring-paper/70',
  'line-dark': 'text-ink ring-1 ring-inset ring-ink/50 hover:bg-ink hover:text-paper hover:ring-ink',
};

export function buttonClass(variant: Variant = 'amber', extra = '') {
  return `group/btn inline-flex min-h-[3rem] items-center justify-center gap-2.5 rounded-full px-6 py-3 text-center text-small font-bold leading-tight transition-[background-color,color,box-shadow] duration-200 ${variants[variant]} ${extra}`;
}

/** Decorative arrow for buttons. Nudges forward on hover. */
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 10h11m-4.5-5L15 10l-4.5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ButtonLink({
  href,
  variant = 'amber',
  children,
  className = '',
  arrow = variant === 'amber' || variant === 'ink',
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

/** A page band. `tone` sets the surface and gives focus rings the right contrast. */
export function Band({
  tone = 'ink',
  children,
  className = '',
  id,
  labelledBy,
}: {
  tone?: 'ink' | 'raised' | 'paper' | 'paper-deep' | 'amber';
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  const tones = {
    ink: 'bg-ink text-paper',
    raised: 'bg-ink-raised text-paper',
    paper: 'on-paper bg-paper text-ink',
    'paper-deep': 'on-paper bg-paper-deep text-ink',
    amber: 'on-amber bg-amber text-ink',
  };
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} py-section ${className}`}>
      <div className="page">{children}</div>
    </section>
  );
}

export function PageIntro({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="backdrop-studio border-b border-ink-line bg-ink pb-16 pt-14 md:pb-24 md:pt-24">
      <div className="page">
        <Mark className="h-6 w-auto text-amber" />
        <h1 className="display mt-8 max-w-[18ch] text-h1">{title}</h1>
        {lead ? <p className="mt-7 max-w-prose font-serif text-lead text-stone-dark md:text-[1.4375rem]">{lead}</p> : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </div>
  );
}

/** A row of short facts, the first one highlighted. Used above titles on cards and episode pages. */
export function MetaList({ items, tone = 'ink' }: { items: string[]; tone?: 'ink' | 'paper' }) {
  const muted = tone === 'ink' ? 'text-stone-dark' : 'text-stone-light';
  const accent = tone === 'ink' ? 'text-amber' : 'text-amber-deep';
  return (
    <ul className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-meta ${muted}`}>
      {items.map((m, i) => (
        <li key={i} className={`flex items-center gap-2.5 ${i === 0 ? `font-bold ${accent}` : ''}`}>
          {i > 0 ? <span className="h-1 w-1 rounded-full bg-current opacity-50" aria-hidden="true" /> : null}
          {m}
        </li>
      ))}
    </ul>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" prevents editor-supplied text from closing the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

/** The mark: three bars joined by one line. Earn, Build and Protect are one system. */
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden="true" focusable="false">
      <rect x="0" y="20" width="12" height="12" fill="currentColor" />
      <rect x="18" y="10" width="12" height="22" fill="currentColor" />
      <rect x="36" y="0" width="12" height="32" fill="currentColor" />
    </svg>
  );
}

/** The mark with one bar lit, for the Earn, Build and Protect steps. */
export function StepMark({ step, className = '' }: { step: 0 | 1 | 2; className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden="true" focusable="false">
      {[
        { x: 0, y: 20, h: 12 },
        { x: 18, y: 10, h: 22 },
        { x: 36, y: 0, h: 32 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width="12" height={b.h} fill="currentColor" opacity={i === step ? 1 : 0.22} />
      ))}
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="Earn.Build.Protect home">
      <Mark className="h-5 w-auto text-amber transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="display text-[1.1875rem] leading-none tracking-[-0.02em]">Earn.Build.Protect</span>
    </Link>
  );
}
