import '../globals.css';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { CheckCta } from '@/components/check-cta';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { site, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${site.name}: ${site.proposition}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    title: `${site.name}: ${site.proposition}`,
    description: site.description,
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
  appleWebApp: { title: site.name, statusBarStyle: 'black-translucent' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#1e1c1a', width: 'device-width', initialScale: 1 };

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header cta={<CheckCta placement="mobile_menu" className="w-full" />} />
      <main id="main">{children}</main>
      <Footer />
      {/* Cookieless page and event analytics. Active automatically on Vercel once Web Analytics is enabled. */}
      {process.env.VERCEL ? <Analytics /> : null}
      {plausibleDomain ? (
        <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.tagged-events.js" />
      ) : null}
    </>
  );
}
