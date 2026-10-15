import Link from 'next/link';
import { Email, LegalPage, legalMetadata } from '@/components/legal-page';

export const metadata = legalMetadata(
  'Cookie policy',
  '/cookies',
  'How the Earn.Build.Protect website uses cookies and similar technologies.',
);

const turnstile = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie policy"
      intro="This website sets no cookies of its own. This page explains what that means and where other services may set theirs."
    >
      <h2>What cookies are</h2>
      <p>
        Cookies are small files a website can store on your device. Some are needed for a website to work. Others
        remember your preferences or track what you do across websites. Similar technologies, such as local storage,
        work in a comparable way and are covered by this policy too.
      </p>

      <h2>Cookies set by this website</h2>
      <p>
        None. The Earn.Build.Protect website does not set cookies and does not use advertising, remarketing or
        cross-site tracking technologies. That is why you are not shown a cookie banner.
      </p>

      <h2>Analytics without cookies</h2>
      <p>
        We measure visits and clicks using analytics that do not store anything on your device and do not identify
        you. We see totals only.
      </p>

      <h2>Cookies set by other services</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">When it applies</th>
              <th scope="col">What happens</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>YouTube (Google)</td>
              <td>Only after you press play on a video</td>
              <td>
                YouTube loads the video and may set cookies or use local storage on your device, under Google&apos;s
                own policies. We use the privacy-enhanced player. If you do not press play, nothing is loaded from
                YouTube.
              </td>
            </tr>
            {turnstile ? (
              <tr>
                <td>Cloudflare Turnstile</td>
                <td>On the contact page</td>
                <td>
                  Checks that the form is being completed by a person. It may store a short-lived token on your
                  device, which is strictly necessary for protecting the form from spam.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <h2>Other websites we link to</h2>
      <p>
        When you follow a link to another service, such as a podcast platform, a social network, the Financial
        Resilience Check or a booking page, that service may set its own cookies. Its own cookie policy applies.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can block or delete cookies in your browser settings, and most browsers let you do this for individual
        websites. Because this website sets no cookies, blocking them does not change how it works. Blocking
        third-party cookies may affect video playback.
      </p>

      <h2>Changes and contact</h2>
      <p>
        If we ever add a tool that uses cookies which are not strictly necessary, we will update this page and ask
        for your consent before that tool loads. For questions, email <Email />. See also our{' '}
        <Link href="/privacy">privacy policy</Link>.
      </p>
    </LegalPage>
  );
}
