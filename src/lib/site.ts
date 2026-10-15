/** Brand constants and environment-driven configuration. No secrets live here. */

export const site = {
  name: 'Earn.Build.Protect',
  shortName: 'EBP',
  tagline: 'Real conversations. Smarter decisions. Stronger financial futures.',
  proposition: 'Earn better. Build stronger. Protect what matters.',
  description:
    "Real conversations, practical insights and tools to help you navigate life's financial decisions.",
  founder: 'Victor Sonde',
  locale: 'en_GB',
} as const;

/** Canonical site address. Set NEXT_PUBLIC_SITE_URL once the domain is confirmed. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

/**
 * Address of the existing Financial Resilience Check application.
 * Returns null when NEXT_PUBLIC_ASSESSMENT_URL is not set, so the interface can show a
 * labelled configuration placeholder instead of an invented destination.
 */
export function assessmentUrl(placement: string): string | null {
  const raw = process.env.NEXT_PUBLIC_ASSESSMENT_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    // Campaign parameters let the assessment application attribute arrivals without sharing personal data.
    url.searchParams.set('utm_source', 'ebp_website');
    url.searchParams.set('utm_medium', 'referral');
    url.searchParams.set('utm_campaign', 'financial_resilience_check');
    url.searchParams.set('utm_content', placement);
    return url.toString();
  } catch {
    return null;
  }
}

export const pillarCopy = {
  earn: {
    name: 'Earn',
    line: 'Where resilience starts',
    body: 'Income, careers, entrepreneurship, side businesses and career transitions. The conversations about growing what comes in.',
  },
  build: {
    name: 'Build',
    line: 'What you do with it',
    body: 'Habits, saving, assets and planning. The conversations about turning income into something that lasts.',
  },
  protect: {
    name: 'Protect',
    line: 'What keeps it standing',
    body: 'Income continuity, emergency preparedness and family protection. The conversations about what happens if life changes the plan.',
  },
} as const;

export type Pillar = keyof typeof pillarCopy;
export const pillarOrder: Pillar[] = ['earn', 'build', 'protect'];

export const navigation = [
  { href: '/podcast', label: 'Podcast' },
  { href: '/media', label: 'Media library' },
  { href: '/financial-resilience-check', label: 'Financial Resilience Check' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const platformLabels = {
  youtube: 'YouTube',
  spotify: 'Spotify',
  applePodcasts: 'Apple Podcasts',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
} as const;
export type PlatformKey = keyof typeof platformLabels;

/**
 * Legal page settings. The three legal pages read from here, so a change of entity, contact
 * address or retention period is made once.
 */
export const legal = {
  /** The legal person responsible for the website. Replace with the registered company name and number if one is formed. */
  entity: 'Victor Sonde, trading as Earn.Build.Protect',
  contactEmail: 'hello@earnbuildprotect.com',
  /** How long contact form enquiries are kept after the last message in the conversation. */
  enquiryRetention: '24 months',
  governingLaw: 'England and Wales',
  /** Shown as the "last updated" date once the pages are approved. */
  lastUpdated: '11 October 2026',
  /**
   * Set to true only when the privacy policy, cookie policy and terms have been reviewed and approved.
   * While false, each page carries a "draft for review" notice and asks search engines not to index it.
   */
  approved: true,
} as const;
