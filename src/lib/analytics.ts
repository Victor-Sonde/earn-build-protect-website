'use client';
import { track as vercelTrack } from '@vercel/analytics';

/**
 * Conversion events. Every name here is an engagement signal, not a qualified lead:
 * a click on the Financial Resilience Check button says someone was interested, nothing more.
 */
export type EventName =
  | 'episode_view'
  | 'episode_play'
  | 'platform_click'
  | 'resilience_check_click'
  | 'contact_form_submitted'
  | 'adviser_pathway_click'
  | 'share_click';

type Props = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

/** Sends one event to whichever privacy-conscious analytics tools are active. Never sends personal data. */
export function track(event: EventName, props: Props = {}) {
  try {
    vercelTrack(event, props);
    window.plausible?.(event, { props });
  } catch {
    // Analytics must never break the page.
  }
}
