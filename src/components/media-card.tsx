import Link from 'next/link';
import type { MediaItem } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { pillarCopy } from '@/lib/site';
import { Cover } from './cover';
import { MetaList } from './ui';

export function MediaCard({ item, tone = 'ink' }: { item: MediaItem; tone?: 'ink' | 'paper' }) {
  const muted = tone === 'ink' ? 'text-stone-dark' : 'text-stone-light';
  const meta = [
    item.kindLabel,
    item.pillars.map((p) => pillarCopy[p].name).join(', '),
    item.durationMinutes ? `${item.durationMinutes} min` : null,
    formatDate(item.date),
  ].filter((m): m is string => Boolean(m));
  const inner = (
    <>
      <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <Cover image={item.image} title={item.title} sizes="(min-width: 1080px) 28vw, (min-width: 560px) 46vw, 100vw" />
      </div>
      <div className="mt-5">
        <MetaList items={meta} tone={tone} />
      </div>
      <h3 className="mt-2.5 text-h4 font-bold leading-snug decoration-amber decoration-2 underline-offset-4 group-hover:underline">
        {item.title}
        {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </h3>
      {item.description ? <p className={`mt-2 line-clamp-3 text-small ${muted}`}>{item.description}</p> : null}
    </>
  );
  return (
    <article className="h-full">
      {item.external ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="group block h-full">
          {inner}
        </a>
      ) : (
        <Link href={item.href} className="group block h-full">
          {inner}
        </Link>
      )}
    </article>
  );
}
