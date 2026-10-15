'use client';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { contactSchema, enquiryTypes, type EnquiryType } from '@/lib/contact';
import { Arrow } from './ui';

type Status = 'idle' | 'sending' | 'sent' | 'error';
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const field =
  'mt-2 block min-h-[3.25rem] w-full rounded-tile border border-ink/25 bg-paper px-4 py-3 text-base text-ink transition-colors placeholder:text-stone-light hover:border-ink/50 focus:border-ink aria-[invalid=true]:border-2 aria-[invalid=true]:border-[#8c1d18]';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const startedAt = useRef(0);
  const summary = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const type = new URLSearchParams(window.location.search).get('type');
    const select = document.getElementById('enquiryType') as HTMLSelectElement | null;
    if (select && type && type in enquiryTypes) select.value = type;
  }, []);

  useEffect(() => {
    if (status === 'error') summary.current?.focus();
    if (status === 'sent') done.current?.focus();
  }, [status, errors]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      enquiryType: String(form.get('enquiryType') ?? '') as EnquiryType,
      message: String(form.get('message') ?? ''),
      consent: form.get('consent') === 'on',
    };
    const check = contactSchema.safeParse(payload);
    if (!check.success) {
      const next: Record<string, string> = {};
      for (const issue of check.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setFormError('Check the highlighted fields and try again.');
      setStatus('error');
      return;
    }
    setErrors({});
    setFormError('');
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...check.data,
          website: String(form.get('website') ?? ''),
          startedAt: startedAt.current,
          turnstileToken: String(form.get('cf-turnstile-response') ?? ''),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok || !result.ok) {
        setErrors(result.fields ?? {});
        setFormError(result.message ?? 'Your message could not be sent. Try again in a few minutes.');
        setStatus('error');
        return;
      }
      track('contact_form_submitted', { enquiry_type: check.data.enquiryType });
      setStatus('sent');
    } catch {
      setFormError('Your message could not be sent. Check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div ref={done} tabIndex={-1} role="status" className="card-light p-8 md:p-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber text-ink" aria-hidden="true">
          <svg viewBox="0 0 20 20" className="h-6 w-6" focusable="false">
            <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="display mt-6 text-h3">Message sent</h2>
        <p className="mt-3 max-w-prose font-serif text-lead text-stone-light">
          Thank you. Your message has gone to the Earn.Build.Protect team.
        </p>
      </div>
    );
  }

  const describe = (name: string) => (errors[name] ? `${name}-error` : undefined);
  const ErrorText = ({ name }: { name: string }) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-2 text-small font-bold text-[#8c1d18]">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="card-light relative grid gap-6 p-6 sm:p-8 md:p-10">
      {status === 'error' && formError ? (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          className="rounded-tile border-2 border-[#8c1d18] bg-[#fbeceb] px-5 py-4 text-small font-bold text-[#8c1d18]"
        >
          {formError}
        </div>
      ) : null}

      <div>
        <label htmlFor="enquiryType" className="text-small font-bold">
          What is your message about?
        </label>
        <select
          id="enquiryType"
          name="enquiryType"
          defaultValue="general"
          aria-invalid={Boolean(errors.enquiryType)}
          aria-describedby={describe('enquiryType')}
          className={field}
        >
          {Object.entries(enquiryTypes).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ErrorText name="enquiryType" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-small font-bold">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe('name')}
            className={field}
          />
          <ErrorText name="name" />
        </div>
        <div>
          <label htmlFor="email" className="text-small font-bold">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={200}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describe('email')}
            className={field}
          />
          <ErrorText name="email" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-small font-bold">
          Your message
        </label>
        <p id="message-hint" className="mt-1 text-small text-stone-light">
          Please do not include personal financial details, account numbers or health information.
        </p>
        <textarea
          id="message"
          name="message"
          rows={7}
          maxLength={4000}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={['message-hint', describe('message')].filter(Boolean).join(' ')}
          className={field}
        />
        <ErrorText name="message" />
      </div>

      {/* Honeypot: hidden from people and assistive technology, tempting to automated form fillers. */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-small">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describe('consent')}
            className="mt-1 h-5 w-5 shrink-0 accent-[#1e1c1a]"
          />
          <span>
            I agree that Earn.Build.Protect can use these details to reply to my message, as described in the{' '}
            <Link href="/privacy" className="text-link">
              privacy policy
            </Link>
            .
          </span>
        </label>
        <ErrorText name="consent" />
      </div>

      {turnstileSiteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" />
        </>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group/btn inline-flex min-h-[3rem] items-center gap-2.5 rounded-full bg-ink px-7 text-small font-bold text-paper shadow-lift transition-colors hover:bg-ink-raised disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending message' : 'Send message'}
          <Arrow />
        </button>
      </div>
    </form>
  );
}
