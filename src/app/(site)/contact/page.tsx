import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { Band, PageIntro } from '@/components/ui';
import { enquiryTypes } from '@/lib/contact';

const description =
  'Contact Earn.Build.Protect with a general enquiry, a podcast guest suggestion, a media request or a commercial collaboration.';

export const metadata: Metadata = {
  title: 'Contact',
  description,
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact Earn.Build.Protect', description, url: '/contact' },
};

const guidance: Record<keyof typeof enquiryTypes, string> = {
  general: 'Questions and feedback about the website, the podcast or the content.',
  guest: 'Tell us who the guest is and which decision they could speak about from experience.',
  media: 'Interview requests, press questions and speaking invitations.',
  commercial: 'Sponsorship, partnerships and other ways of working together.',
};

export default function ContactPage() {
  return (
    <>
      <PageIntro title="Get in touch" lead="Choose what your message is about and it will reach the right person." />
      <Band tone="paper">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <ContactForm />
          <aside aria-label="What you can contact us about" className="lg:pt-4">
            <dl className="rows">
              {(Object.keys(enquiryTypes) as (keyof typeof enquiryTypes)[]).map((key) => (
                <div key={key} className="flex gap-4 py-5">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                  <div>
                    <dt className="font-bold">{enquiryTypes[key]}</dt>
                    <dd className="mt-1 text-small text-stone-light">{guidance[key]}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-8 rounded-panel bg-paper-deep/70 p-6 text-small text-stone-light">
              This form cannot give financial advice or answer questions about your personal circumstances. Your
              message is sent by email to the Earn.Build.Protect team and is used only to reply to you.
            </p>
          </aside>
        </div>
      </Band>
    </>
  );
}
