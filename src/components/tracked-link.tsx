'use client';
import type { ReactNode } from 'react';
import { type EventName, track } from '@/lib/analytics';

export function TrackedLink({
  href,
  event,
  eventProps,
  external = false,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  event: EventName;
  eventProps?: Record<string, string | number | boolean | null>;
  external?: boolean;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={() => track(event, eventProps)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
