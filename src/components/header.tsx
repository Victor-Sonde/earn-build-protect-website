'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { navigation } from '@/lib/site';
import { Logo } from './ui';

const CHECK_HREF = '/financial-resilience-check';

export function Header({ cta }: { cta: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-colors duration-300 ${
        scrolled || open ? 'border-ink-line bg-ink/90 backdrop-blur-xl backdrop-saturate-150' : 'border-transparent bg-ink'
      }`}
    >
      <div className="page flex min-h-[var(--header-height)] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) =>
            item.href === CHECK_HREF ? (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
                className="ml-3 inline-flex min-h-[2.75rem] items-center gap-2 rounded-full px-4 text-small font-bold text-amber ring-1 ring-inset ring-amber/45 transition-colors hover:bg-amber hover:text-ink aria-[current=page]:bg-amber aria-[current=page]:text-ink"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
                className="inline-flex min-h-[2.75rem] items-center rounded-full px-4 text-small font-medium text-stone-dark transition-colors hover:bg-paper/[0.06] hover:text-paper aria-[current=page]:bg-paper/[0.08] aria-[current=page]:text-paper"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <button
          type="button"
          className="inline-flex min-h-[2.75rem] items-center gap-2.5 rounded-full px-4 text-small font-bold ring-1 ring-inset ring-ink-line transition-colors hover:bg-paper/[0.06] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-4" aria-hidden="true">
            <span
              className={`absolute left-0 h-0.5 w-4 rounded bg-current transition-transform duration-200 ${open ? 'top-[5px] rotate-45' : 'top-0'}`}
            />
            <span
              className={`absolute left-0 h-0.5 w-4 rounded bg-current transition-transform duration-200 ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`}
            />
          </span>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-height))] overflow-y-auto border-b border-ink-line bg-ink shadow-[0_32px_64px_-16px_rgb(0_0_0/0.7)] lg:hidden"
      >
        <nav aria-label="Main, mobile" className="page flex flex-col pb-8 pt-2">
          {navigation.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              className="display flex items-baseline gap-4 border-b border-ink-line py-4 text-h3 aria-[current=page]:text-amber"
            >
              <span className="w-6 font-display text-meta font-bold tabular-nums text-stone-dark" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {item.label}
            </Link>
          ))}
          <div className="pt-7">{cta}</div>
        </nav>
      </div>
    </header>
  );
}
