import Link from 'next/link';
import { Email, LegalPage, legalMetadata } from '@/components/legal-page';
import { legal } from '@/lib/site';

export const metadata = legalMetadata(
  'Privacy policy',
  '/privacy',
  'How Earn.Build.Protect collects, uses and protects personal information on this website.',
);

const turnstile = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
const plausible = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="What personal information this website collects, why, who it is shared with and the choices you have."
    >
      <h2>Who we are</h2>
      <p>
        This website is operated by {legal.entity} (&quot;Earn.Build.Protect&quot;, &quot;we&quot;, &quot;us&quot;). We
        are the data controller for the personal information described in this policy.
      </p>
      <p>
        For any question about this policy or your information, email <Email />.
      </p>

      <h2>The short version</h2>
      <ul>
        <li>You can read, watch and listen on this website without giving us any personal information.</li>
        <li>We only receive personal information from you when you send us a message through the contact form.</li>
        <li>This website sets no cookies of its own and does not use advertising or tracking cookies.</li>
        <li>
          The Financial Resilience Check runs in a separate application. This website never sees or stores your
          answers.
        </li>
        <li>We do not sell personal information.</li>
      </ul>

      <h2>Information we collect and why</h2>

      <h3>When you contact us</h3>
      <p>
        The contact form asks for your name, your email address, the type of enquiry and your message. We use these
        to read and reply to your enquiry and to keep a record of the conversation.
      </p>
      <p>
        Please do not include financial details, account numbers, health information or other sensitive information
        in your message. We do not need it and cannot give advice about personal circumstances through this form.
      </p>
      <p>
        If you suggest someone else as a podcast guest, please only share details that person would be comfortable
        with you sharing.
      </p>
      <p>
        <strong>Lawful basis:</strong> legitimate interests. It is in our interest, and yours, that we can respond to
        messages you choose to send us.
      </p>

      <h3>When you browse the website</h3>
      <p>
        Like every website, ours receives technical information from your browser when a page loads, including your
        internet protocol (IP) address, browser type and the page requested. Our hosting provider processes this to
        deliver the website and keep it secure. We also use your IP address briefly to limit how many contact form
        messages can be sent in a short time, which protects the form from abuse.
      </p>
      <p>
        We measure how the website is used with privacy-focused analytics that do not use cookies and do not identify
        you. We see totals, such as how many times a page was viewed or a button was clicked. We do not build
        profiles of individual visitors.
      </p>
      <p>
        <strong>Lawful basis:</strong> legitimate interests in running a secure website and understanding which
        content is useful.
      </p>

      <h3>When you play a video</h3>
      <p>
        Episode videos are hosted by YouTube. Nothing is loaded from YouTube until you press play. When you do,
        YouTube (Google) receives technical information such as your IP address and may set cookies, under its own
        privacy policy. We use YouTube&apos;s privacy-enhanced player.
      </p>

      {turnstile ? (
        <>
          <h3>Spam protection</h3>
          <p>
            The contact form uses Cloudflare Turnstile to tell people from automated software. Turnstile processes
            technical information about your browser and device for that purpose only.
          </p>
        </>
      ) : null}

      <h2>The Financial Resilience Check</h2>
      <p>
        The Financial Resilience Check is a separate application with its own privacy notice, which explains how
        information you enter there is handled. This website links to it and does not receive your answers or your
        results.
      </p>
      <p>
        Links from this website to the Check include a short campaign tag that records which page or button you came
        from, for example the homepage. The tag does not identify you.
      </p>

      <h2>Links to other services</h2>
      <p>
        This website links to services run by other organisations, including podcast and video platforms, social
        media, and Victor&apos;s adviser page and booking page. Those organisations are responsible for how they
        handle your information, and their own privacy policies apply once you leave this website. We do not pass
        your information to them when you follow a link.
      </p>

      <h2>Who we share information with</h2>
      <p>
        We use a small number of service providers to run the website. They process information on our instructions
        and only for the purposes described here.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Provider</th>
              <th scope="col">What it does</th>
              <th scope="col">Information involved</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel</td>
              <td>Hosts the website and provides cookieless analytics</td>
              <td>Technical information from your browser</td>
            </tr>
            <tr>
              <td>Resend</td>
              <td>Delivers contact form messages to our inbox</td>
              <td>Your name, email address and message</td>
            </tr>
            <tr>
              <td>Google</td>
              <td>Provides the email service where we receive, store and reply to enquiries</td>
              <td>Your name, email address, message and our replies</td>
            </tr>
            {turnstile ? (
              <tr>
                <td>Cloudflare</td>
                <td>Spam protection on the contact form</td>
                <td>Technical information about your browser and device</td>
              </tr>
            ) : null}
            {plausible ? (
              <tr>
                <td>Plausible</td>
                <td>Cookieless analytics</td>
                <td>Aggregated usage information</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p>
        We may also share information where the law requires it, or to establish, exercise or defend legal claims.
      </p>

      <h2>Transfers outside the United Kingdom</h2>
      <p>
        Some of our service providers are based in, or store information in, the United States. Where personal
        information is transferred outside the United Kingdom, we rely on safeguards recognised under United Kingdom
        data protection law, such as the UK Extension to the EU–US Data Privacy Framework or the International Data
        Transfer Agreement.
      </p>

      <h2>How long we keep information</h2>
      <ul>
        <li>
          Contact form messages and our replies: up to {legal.enquiryRetention} after the last message in the
          conversation, then deleted, unless we need to keep them longer for legal reasons.
        </li>
        <li>Analytics: kept in aggregated form that does not identify you.</li>
        <li>Technical logs held by our hosting provider: kept for a short period under the provider&apos;s own policy.</li>
      </ul>

      <h2>Your rights</h2>
      <p>Under United Kingdom data protection law you have the right to:</p>
      <ul>
        <li>ask for a copy of the personal information we hold about you</li>
        <li>ask us to correct information that is inaccurate or incomplete</li>
        <li>ask us to delete your information</li>
        <li>ask us to restrict how we use your information</li>
        <li>object to our use of your information where we rely on legitimate interests</li>
        <li>ask for your information in a portable format, where that right applies</li>
      </ul>
      <p>
        To use any of these rights, email <Email />. We will reply within one month. There is no charge.
      </p>

      <h2>How to complain</h2>
      <p>
        If you are unhappy with how we have handled your information, please tell us first so we can try to put it
        right. You also have the right to complain to the Information Commissioner&apos;s Office, the United Kingdom
        data protection regulator, at{' '}
        <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
          ico.org.uk/make-a-complaint
        </a>{' '}
        or on 0303 123 1113.
      </p>

      <h2>Children</h2>
      <p>This website is written for adults. We do not knowingly collect personal information from anyone under 18.</p>

      <h2>Changes to this policy</h2>
      <p>
        We will update this policy when the way we handle information changes, and show the date of the latest
        version at the top of the page. See also our <Link href="/cookies">cookie policy</Link> and{' '}
        <Link href="/terms">terms of use</Link>.
      </p>
    </LegalPage>
  );
}
