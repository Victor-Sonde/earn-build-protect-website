import Link from 'next/link';
import { Email, LegalPage, legalMetadata } from '@/components/legal-page';
import { legal } from '@/lib/site';

export const metadata = legalMetadata(
  'Terms of use',
  '/terms',
  'The terms that apply when you use the Earn.Build.Protect website.',
);

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      intro="The terms that apply when you use this website. Please read them alongside the privacy policy and cookie policy."
    >
      <h2>About these terms</h2>
      <p>
        This website is operated by {legal.entity} (&quot;Earn.Build.Protect&quot;, &quot;we&quot;, &quot;us&quot;). By
        using the website you agree to these terms. If you do not agree, please do not use the website.
      </p>
      <p>
        You can contact us at <Email />.
      </p>

      <h2>Educational content, not advice</h2>
      <p>
        Everything on this website, including podcast episodes, videos, clips, articles and show notes, is general
        information for education. It is not financial, investment, tax, legal or other professional advice, and it
        is not a personal recommendation.
      </p>
      <ul>
        <li>The content does not take account of your personal circumstances, objectives or needs.</li>
        <li>You should not rely on it as the sole basis for any financial decision.</li>
        <li>
          If you need advice, speak to an appropriately qualified and authorised professional who can consider your
          situation.
        </li>
        <li>Nothing on this website is a promise or guarantee of any financial outcome.</li>
      </ul>

      <h2>The Financial Resilience Check</h2>
      <p>
        The Financial Resilience Check is an educational self-assessment that runs in a separate application. It
        offers general insights for reflection. It does not provide regulated financial advice and does not
        recommend any product or provider. The Check has its own terms and privacy notice, which apply when you use
        it.
      </p>

      <h2>Adviser services are separate</h2>
      <p>
        Victor Sonde&apos;s work as an adviser is separate from Earn.Build.Protect and is regulated. Where this
        website links to his adviser page or booking page, you leave this website, and any service you receive there
        is provided on its own terms and is not provided by or through this website.
      </p>

      <h2>Guests and opinions</h2>
      <p>
        Views expressed by podcast guests and contributors are their own. Including a guest or a point of view does
        not mean we endorse it, and it is not advice from us or from the guest.
      </p>

      <h2>Using the website</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the website for anything unlawful, harmful or fraudulent</li>
        <li>attempt to gain unauthorised access to the website, its servers or connected systems</li>
        <li>interfere with the website, for example by introducing malicious code or overloading it</li>
        <li>send spam, or abusive or misleading messages, through the contact form</li>
        <li>copy or collect content from the website by automated means for commercial use without our permission</li>
      </ul>

      <h2>Our content</h2>
      <p>
        The Earn.Build.Protect name, the website design, and the podcast, video and written content are owned by us
        or used with permission. You may view the content for personal, non-commercial use and share links to it. You
        may quote short extracts with clear credit to Earn.Build.Protect. Any other use needs our written permission.
      </p>

      <h2>Links to other websites</h2>
      <p>
        The website links to services run by other organisations, such as podcast and video platforms and social
        networks. We do not control those services and are not responsible for their content, terms or privacy
        practices.
      </p>

      <h2>Availability and accuracy</h2>
      <p>
        We take care to keep the website available and its content accurate at the time of publication, but we do
        not promise that it will always be available, free from errors or up to date. Rules, rates and circumstances
        change, and older content may no longer reflect the current position. We may change or remove content at any
        time.
      </p>

      <h2>Our responsibility to you</h2>
      <p>
        Nothing in these terms excludes or limits our liability where it would be unlawful to do so. This includes
        liability for death or personal injury caused by negligence and for fraud. If you are a consumer, you also
        have legal rights that these terms do not affect.
      </p>
      <p>
        Subject to that, the website and its content are provided for general information, free of charge, and we
        are not liable for loss or damage arising from your use of the website or reliance on its content, to the
        extent the law allows.
      </p>

      <h2>Law and disputes</h2>
      <p>
        These terms are governed by the law of {legal.governingLaw}. The courts of {legal.governingLaw} have
        jurisdiction, although if you are a consumer living in another part of the United Kingdom you may also bring
        a claim in the courts where you live.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The date of the latest version is shown at the top of the page,
        and the version in force when you use the website applies. See also our{' '}
        <Link href="/privacy">privacy policy</Link> and <Link href="/cookies">cookie policy</Link>.
      </p>
    </LegalPage>
  );
}
