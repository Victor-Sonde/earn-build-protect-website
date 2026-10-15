import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { legal } from '@/lib/site';
import { Band, PageIntro } from './ui';

export function legalMetadata(title: string, path: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: legal.approved ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <PageIntro title={title} lead={intro} />
      <Band tone="paper">
        <div className="card-light mx-auto max-w-[52rem] px-6 py-10 sm:px-10 md:px-16 md:py-16">
          {legal.approved ? (
            <p className="kicker inline-flex rounded-full bg-paper-deep px-4 py-2 text-stone-light">Last updated {legal.lastUpdated}</p>
          ) : (
            <div className="rounded-tile border-2 border-ink bg-paper-deep p-6" role="note">
              <h2 className="text-h4 font-bold">Draft for review</h2>
              <p className="mt-2">
                This {title.toLowerCase()} is a draft dated {legal.lastUpdated}. It has not yet been reviewed or
                approved and is not final.
              </p>
            </div>
          )}
          <div className="legal mt-10 max-w-prose">{children}</div>
        </div>
      </Band>
    </>
  );
}

export function Email() {
  return (
    <a href={`mailto:${legal.contactEmail}`} className="font-bold underline decoration-amber decoration-2 underline-offset-4">
      {legal.contactEmail}
    </a>
  );
}
