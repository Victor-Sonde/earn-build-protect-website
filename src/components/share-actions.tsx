'use client';
import { useState } from 'react';
import { track } from '@/lib/analytics';

export function ShareActions({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const targets = [
    { key: 'linkedin', label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { key: 'x', label: 'X', href: `https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}` },
    { key: 'email', label: 'Email', href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];
  const chip =
    'inline-flex min-h-[2.75rem] items-center rounded-full border border-paper/25 bg-paper/[0.04] px-5 text-small font-bold transition-colors hover:border-amber hover:text-amber';
  return (
    <div>
      <h2 className="kicker text-stone-dark">Share this episode</h2>
      <ul className="mt-4 flex flex-wrap gap-2.5">
        {targets.map((t) => (
          <li key={t.key}>
            <a
              href={t.href}
              className={chip}
              onClick={() => track('share_click', { channel: t.key })}
              {...(t.key === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {t.label}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={chip}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                track('share_click', { channel: 'copy_link' });
                setTimeout(() => setCopied(false), 2500);
              } catch {
                setCopied(false);
              }
            }}
          >
            <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
