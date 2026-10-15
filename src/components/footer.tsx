import Link from 'next/link';
import { getSettings } from '@/lib/content';
import { navigation, site } from '@/lib/site';
import { PlatformLinks } from './platform-links';
import { Logo, Mark } from './ui';

export async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="relative overflow-hidden border-t border-ink-line bg-ink pb-10 pt-20 text-small text-stone-dark">
      <Mark className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-auto text-paper/[0.025]" />
      <div className="page relative">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="text-paper">
            <Logo />
            <p className="mt-6 max-w-[26ch] font-serif text-lead leading-snug text-stone-dark">{site.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <h2 className="kicker text-paper">Explore</h2>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="kicker text-paper">Watch and listen</h2>
            {settings.platforms.length ? (
              <PlatformLinks platforms={settings.platforms} placement="footer" layout="list" />
            ) : (
              <p className="mt-5 max-w-[26ch]">Platform links will appear here when the podcast channels go live.</p>
            )}
          </div>
          <nav aria-label="Legal" className="md:col-start-2 lg:col-start-auto">
            <h2 className="kicker text-paper">Legal</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-paper">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="transition-colors hover:text-paper">
                  Cookie policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-paper">
                  Terms
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-16 rounded-panel bg-ink-raised/70 p-6 text-meta leading-relaxed ring-1 ring-inset ring-ink-line md:p-8">
          <div className="space-y-4">
            <p className="max-w-[80ch]">
              Earn.Build.Protect publishes general educational content. Nothing on this website is financial advice or a
              personal recommendation, and the Financial Resilience Check is an educational self-assessment, not a
              regulated advice service.
            </p>
            {settings.regulatoryDisclosure ? (
              <p className="max-w-[80ch] whitespace-pre-line" data-region="regulatory-disclosure">
                {settings.regulatoryDisclosure}
              </p>
            ) : null}
          </div>
        </div>

        <p className="mt-8 text-meta">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
