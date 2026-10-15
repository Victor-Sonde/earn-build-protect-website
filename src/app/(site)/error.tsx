'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="backdrop-studio bg-ink pb-32 pt-20 md:pt-28">
      <div className="page">
        <h1 className="display max-w-[16ch] text-h1">This page did not load</h1>
        <p className="mt-7 max-w-prose font-serif text-lead text-stone-dark">
          Something went wrong on our side. Try loading it again. If it keeps happening, the rest of the site is
          still available from the menu.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex min-h-[3rem] items-center rounded-full bg-amber px-6 text-small font-bold text-ink shadow-amber transition-colors hover:bg-amber-soft"
        >
          Load the page again
        </button>
      </div>
    </div>
  );
}
