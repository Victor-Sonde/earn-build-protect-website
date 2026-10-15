'use client';
import { useEffect, useMemo, useState } from 'react';
import type { MediaItem } from '@/lib/content';
import { pillarCopy, pillarOrder, type Pillar } from '@/lib/site';
import { MediaCard } from './media-card';

type Format = MediaItem['kind'];
const formats: { value: Format; label: string }[] = [
  { value: 'episode', label: 'Episodes' },
  { value: 'clip', label: 'Clips' },
  { value: 'article', label: 'Articles' },
];

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="inline-flex min-h-[2.75rem] items-center rounded-full bg-paper px-5 text-small font-bold ring-1 ring-inset ring-ink/20 transition-colors hover:ring-ink/60 aria-pressed:bg-ink aria-pressed:text-paper aria-pressed:ring-ink"
    >
      {children}
    </button>
  );
}

export function MediaLibrary({ items, topics }: { items: MediaItem[]; topics: string[] }) {
  const [pillar, setPillar] = useState<Pillar | null>(null);
  const [format, setFormat] = useState<Format | null>(null);
  const [topic, setTopic] = useState('');
  const [query, setQuery] = useState('');

  // Filters can be linked to directly, for example /media?pillar=earn
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('pillar');
    const f = params.get('format');
    if (p && (pillarOrder as string[]).includes(p)) setPillar(p as Pillar);
    if (f && formats.some((x) => x.value === f)) setFormat(f as Format);
    const t = params.get('topic');
    if (t && topics.includes(t)) setTopic(t);
    const q = params.get('q');
    if (q) setQuery(q.slice(0, 80));
  }, [topics]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (pillar) params.set('pillar', pillar);
    if (format) params.set('format', format);
    if (topic) params.set('topic', topic);
    if (query.trim()) params.set('q', query.trim());
    const next = params.toString();
    window.history.replaceState(null, '', next ? `?${next}` : window.location.pathname);
  }, [pillar, format, topic, query]);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      if (pillar && !item.pillars.includes(pillar)) return false;
      if (format && item.kind !== format) return false;
      if (topic && !item.topics.includes(topic)) return false;
      if (!words.length) return true;
      const haystack = `${item.title} ${item.description} ${item.topics.join(' ')} ${item.kindLabel}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }, [items, pillar, format, topic, query]);

  const filtering = Boolean(pillar || format || topic || query.trim());
  const clear = () => {
    setPillar(null);
    setFormat(null);
    setTopic('');
    setQuery('');
  };

  const describeFilters = [
    pillar ? pillarCopy[pillar].name : null,
    format ? formats.find((f) => f.value === format)?.label.toLowerCase() : null,
    topic || null,
    query.trim() ? `"${query.trim()}"` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="card-light grid gap-8 p-6 md:p-9">
        <div>
          <label htmlFor="library-search" className="kicker text-stone-light">
            Search the library
          </label>
          <div className="relative mt-3 max-w-2xl">
            <svg
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-light"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M13 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              id="library-search"
              type="search"
              value={query}
              maxLength={80}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try a topic, a guest or a question"
              className="block min-h-[3.5rem] w-full rounded-full border border-ink/25 bg-paper pl-14 pr-5 text-base text-ink transition-colors placeholder:text-stone-light hover:border-ink/50 focus:border-ink"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          <fieldset>
            <legend className="kicker text-stone-light">Pillar</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {pillarOrder.map((p) => (
                <Chip key={p} pressed={pillar === p} onClick={() => setPillar(pillar === p ? null : p)}>
                  {pillarCopy[p].name}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="kicker text-stone-light">Format</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {formats.map((f) => (
                <Chip key={f.value} pressed={format === f.value} onClick={() => setFormat(format === f.value ? null : f.value)}>
                  {f.label}
                </Chip>
              ))}
            </div>
          </fieldset>
          {topics.length ? (
            <div>
              <label htmlFor="library-topic" className="kicker text-stone-light">
                Topic
              </label>
              <select
                id="library-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-3 block min-h-[2.75rem] rounded-full border border-ink/25 bg-paper px-5 text-small font-bold text-ink hover:border-ink/50"
              >
                <option value="">All topics</option>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      </form>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-small text-stone-light">
        <p role="status" aria-live="polite">
          {items.length === 0
            ? 'Nothing has been published yet.'
            : `${results.length} of ${items.length} ${items.length === 1 ? 'item' : 'items'}${filtering ? ` for ${describeFilters}` : ''}`}
        </p>
        {filtering ? (
          <button type="button" onClick={clear} className="text-link text-ink">
            Clear filters
          </button>
        ) : null}
      </div>

      {results.length ? (
        <ul className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <li key={item.id}>
              <MediaCard item={item} tone="paper" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-card border-2 border-dashed border-paper-line bg-paper-bright/50 px-6 py-16 text-center md:px-12 md:py-20">
          {items.length === 0 ? (
            <>
              <h2 className="display text-h3">The library opens with season one</h2>
              <p className="mx-auto mt-3 max-w-prose font-serif text-lead text-stone-light">
                Episodes, clips and articles will be collected here as they are released. The filters above already
                work, so you can see how the library will be organised.
              </p>
            </>
          ) : (
            <>
              <h2 className="display text-h3">Nothing published for {describeFilters} yet</h2>
              <p className="mx-auto mt-3 max-w-prose font-serif text-lead text-stone-light">
                Try removing a filter, or browse everything that has been released so far.
              </p>
              <button
                type="button"
                onClick={clear}
                className="mt-7 inline-flex min-h-[3rem] items-center rounded-full bg-ink px-6 text-small font-bold text-paper transition-colors hover:bg-ink-raised"
              >
                Show everything
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
