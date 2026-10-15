'use client';
import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';

/**
 * Click-to-load YouTube player. Nothing is requested from YouTube, and no YouTube cookies can be
 * set, until the visitor chooses to play. The player uses the privacy-enhanced domain and never autoplays
 * on page load.
 */
export function VideoEmbed({ id, title, slug }: { id: string; title: string; slug: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-panel bg-gradient-to-br from-ink-raised to-ink shadow-lift-dark ring-1 ring-inset ring-ink-line">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setActive(true);
            track('episode_play', { episode: slug });
          }}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-amber text-ink shadow-amber ring-8 ring-amber/15 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" aria-hidden="true">
              <path d="M6 4l14 8-14 8z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-h4 font-bold">Play video</span>
          <span className="max-w-[44ch] text-meta text-stone-dark">
            The video is provided by YouTube. Playing it loads content from YouTube, which may set cookies.
          </span>
        </button>
      )}
    </div>
  );
}

/** Records one episode view per page load. */
export function EpisodeViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track('episode_view', { episode: slug });
  }, [slug]);
  return null;
}
