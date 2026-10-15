import { NextResponse } from 'next/server';
import { contactSchema, enquiryTypes } from '@/lib/contact';
import { siteUrl } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Contact handler.
 *  - Validates and length-limits every field on the server.
 *  - Spam protection: honeypot field, minimum completion time, per-address rate limit and,
 *    when keys are configured, Cloudflare Turnstile.
 *  - Delivers the message by email through Resend. Nothing is written to a database or to logs.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best-effort limit held in memory per server instance. Turnstile is the stronger control in production.
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // Non-browser clients send no Origin header. Other controls still apply.
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  // Compare hosts only. Behind Vercel the forwarded host is the public one.
  const allowed = new Set<string>();
  for (const h of [request.headers.get('x-forwarded-host'), request.headers.get('host')]) {
    if (h) allowed.add(h.split(',')[0].trim());
  }
  try {
    allowed.add(new URL(siteUrl()).host);
  } catch {
    /* ignore */
  }
  return allowed.has(originHost);
}

const oneLine = (value: string) => value.replace(/[\r\n\t]+/g, ' ').trim();
const fail = (status: number, code: string, message: string, fields?: Record<string, string>) =>
  NextResponse.json({ ok: false, code, message, fields }, { status });

export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail(403, 'forbidden', 'This form can only be sent from the website.');

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return fail(415, 'unsupported', 'Unsupported request.');
  }

  const raw = await request.text();
  if (raw.length > 12_000) return fail(413, 'too_large', 'The message is too long.');

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape');
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, 'invalid', 'The form could not be read. Reload the page and try again.');
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return fail(429, 'rate_limited', 'Too many messages in a short time. Wait ten minutes and try again.');
  }

  // Honeypot and timing trap. Automated submissions get a success response and are dropped.
  const startedAt = typeof body.startedAt === 'number' ? body.startedAt : 0;
  const tooFast = !startedAt || Date.now() - startedAt < 2500;
  if ((typeof body.website === 'string' && body.website.length > 0) || tooFast) {
    return NextResponse.json({ ok: true });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail(400, 'validation', 'Check the highlighted fields and try again.', fields);
  }
  const data = result.data;

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
    if (!token) return fail(400, 'challenge', 'Complete the spam check and try again.');
    try {
      const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: new URLSearchParams({ secret: turnstileSecret, response: token, remoteip: ip }),
        signal: AbortSignal.timeout(8000),
      });
      const outcome = (await verify.json()) as { success?: boolean };
      if (!outcome.success) return fail(400, 'challenge', 'The spam check did not pass. Reload the page and try again.');
    } catch {
      return fail(502, 'challenge_unavailable', 'The spam check is unavailable. Try again in a few minutes.');
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return fail(
      503,
      'not_configured',
      'The contact form is not connected to an inbox yet, so your message was not sent.',
    );
  }

  const label = enquiryTypes[data.enquiryType];
  try {
    const send = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: oneLine(`Website enquiry: ${label} from ${data.name}`).slice(0, 180),
        // Plain text only, so nothing a sender types can be interpreted as markup.
        text: `Type: ${label}\nName: ${oneLine(data.name)}\nEmail: ${data.email}\n\n${data.message}\n`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!send.ok) throw new Error(`Email provider responded ${send.status}`);
  } catch (error) {
    // Log the failure without any personal data.
    console.error('Contact form delivery failed:', error instanceof Error ? error.message : 'unknown error');
    return fail(502, 'delivery_failed', 'Your message could not be sent. Try again in a few minutes.');
  }

  return NextResponse.json({ ok: true });
}
