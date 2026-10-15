import type { Platform } from '@/lib/content';
import { TrackedLink } from './tracked-link';

export function PlatformLinks({
  platforms,
  placement,
  layout = 'row',
  tone = 'light',
}: {
  platforms: Platform[];
  placement: string;
  layout?: 'row' | 'list';
  tone?: 'light' | 'dark';
}) {
  if (!platforms.length) return null;
  if (layout === 'list') {
    return (
      <ul className="mt-4 space-y-3">
        {platforms.map((p) => (
          <li key={p.key}>
            <TrackedLink
              href={p.url}
              external
              event="platform_click"
              eventProps={{ platform: p.key, placement }}
              className="transition-colors hover:text-paper"
            >
              {p.label}
            </TrackedLink>
          </li>
        ))}
      </ul>
    );
  }
  const chip =
    tone === 'light'
      ? 'border-paper/25 bg-paper/[0.04] text-paper hover:border-amber hover:text-amber'
      : 'border-ink/40 text-ink hover:border-ink hover:bg-ink hover:text-paper';
  return (
    <ul className="flex flex-wrap gap-2.5">
      {platforms.map((p) => (
        <li key={p.key}>
          <TrackedLink
            href={p.url}
            external
            event="platform_click"
            eventProps={{ platform: p.key, placement }}
            className={`inline-flex min-h-[2.75rem] items-center rounded-full border px-5 text-small font-bold transition-colors ${chip}`}
          >
            {p.label}
          </TrackedLink>
        </li>
      ))}
    </ul>
  );
}
