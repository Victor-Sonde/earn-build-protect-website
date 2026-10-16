# Handover to Levi: Earn.Build.Protect website

Prepared 11 October 2026 for Levi, on behalf of Victor Sonde.

## 1. What you are receiving

A complete Next.js website for Earn.Build.Protect, ready to deploy. The build work is finished.
Your job is implementation: get it live on Vercel at `https://www.earnbuildprotect.com`, connect the
services it depends on, and run the live checks.

| Item | Detail |
| --- | --- |
| Framework | Next.js 16 (App Router), TypeScript, Tailwind CSS 3.4 |
| Content | Keystatic. Content is files in the `content` folder, no database |
| Hosting | Vercel |
| Email | Resend, called from one server route (`src/app/api/contact/route.ts`) |
| Analytics | Vercel Web Analytics, cookieless |
| Node version | 20.9 or newer |

Read these in order:

1. This file
2. `README.md` for setup, environment variables, content editing and deployment detail
3. `docs/LAUNCH-CHECKLIST.md` for every open and closed item
4. `docs/MEASUREMENT.md` for analytics events
5. `docs/DESIGN-SYSTEM.md` if you touch the interface

## 2. Current state

Checked in a local production build: all routes, type check, desktop and mobile layouts, contact
route validation and spam rules, mobile menu, library filters, keyboard focus, colour contrast, and
the content editor in local mode.

Not yet done, because each needs an account or credential:

1. Not deployed. No domain connected
2. Contact form email delivery not tested end to end
3. Cloudflare Turnstile spam check not tested
4. Content editor GitHub mode not tested
5. Analytics events not confirmed in a dashboard
6. No Lighthouse run, no automated test suite, no formal accessibility audit
7. Favicon and app icons use the proposed mark. Regenerate with `npm run icons` if the final logo differs

## 3. What is already decided and approved

Victor has confirmed each of these. Treat them as settled.

| Area | Decision |
| --- | --- |
| Domain | `www.earnbuildprotect.com` is primary. The bare domain redirects to it |
| Check application | Stays a separate application on a subdomain, planned as `app.earnbuildprotect.com`. Final address to be confirmed by Victor |
| Compliance | Website copy signed off by the compliance reviewer, 11 October 2026 |
| Footer | No regulatory disclosure required. The general education statement stays |
| Adviser section | Live on the Financial Resilience Check page, using the wording approved for the Check application, with two links: the adviser page and the Calendly booking page |
| Legal pages | Privacy policy, cookie policy and terms approved by Victor, 11 October 2026 |
| Legal entity | Victor Sonde, trading as Earn.Build.Protect |
| Contact address | `earnbuildprotect@gmail.com` (Gmail). No mailbox exists on the domain. Changed from `hello@earnbuildprotect.com`, pending Victor's written agreement |
| Retention | Contact enquiries kept 24 months |

## 4. Do not change without Victor's written agreement

This website sits alongside a regulated financial protection business. Some wording has been through
compliance approval and must stay exactly as it is.

1. Any copy that describes the Financial Resilience Check, on any page
2. The adviser section: its heading, statement, link labels, link addresses and small print. These live in `content/settings.yaml` under `protectionReview`
3. The two adviser links must keep opening in a new tab with `rel="noopener noreferrer"` and must never carry a query string, campaign tag or any identifier
4. The footer statement that the site is general education and not financial advice
5. The three legal pages and the `legal` settings in `src/lib/site.ts`
6. The word "review" must not be used for anything on the protection side, in copy or in visible page source
7. Do not add any tool that sets cookies, any advertising pixel or any remarketing tag. The site has no cookie banner because it sets no cookies. Adding one of these changes that and needs a consent mechanism first
8. Do not collect Financial Resilience Check answers on this website, and do not pass any visitor data between this website and the Check beyond the existing campaign tags on the link

If something here blocks you, stop and ask Victor before working around it.

## 5. Your tasks, in order

### Step 1: Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Confirm it builds with `npm run build` and `npm run typecheck`.

### Step 2: Create the repository

1. Create a private GitHub repository
2. Push this project to it
3. Never commit `.env.local` or any real key. `.gitignore` already excludes them

### Step 3: Create the Vercel project

1. Import the repository into Vercel. The defaults are correct
2. Use a plan that permits commercial use. The free Hobby plan does not, and custom analytics events also need Pro. Confirm the cost with Victor before upgrading
3. Leave `NEXT_PUBLIC_ALLOW_INDEXING` unset for now, so search engines are asked not to index the site
4. Enable Web Analytics in the project

### Step 4: Set environment variables in Vercel

Every variable is documented in `.env.example`. Names starting `NEXT_PUBLIC_` are built into the
pages, so redeploy after changing them.

| Variable | Value | When |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.earnbuildprotect.com` | Now |
| `NEXT_PUBLIC_ASSESSMENT_URL` | The confirmed Check address | Step 7 |
| `RESEND_API_KEY` | From Resend | Step 6 |
| `CONTACT_TO_EMAIL` | `earnbuildprotect@gmail.com` | Step 6 |
| `CONTACT_FROM_EMAIL` | `Earn.Build.Protect <website@earnbuildprotect.com>` | Step 6 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` | From Cloudflare | Step 8 |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true`, Production only | Step 11, on Victor's go-ahead |

Share keys with Victor through a password manager, never through Notion, Slack, WhatsApp or email.

### Step 5: Connect the domain

1. In the Vercel project, add `www.earnbuildprotect.com` and `earnbuildprotect.com`
2. Set `www.earnbuildprotect.com` as primary
3. Add the DNS records Vercel shows at the domain registrar. Victor holds the registrar login
4. Wait for the certificate, then confirm both addresses load and the bare domain redirects

### Step 6: Email

1. Enquiries go to `earnbuildprotect@gmail.com`, which is also the address published on the legal pages. Resend sends from `website@earnbuildprotect.com`, which needs no mailbox. Do not add MX records for the domain unless a mailbox or forwarding is set up later
2. Create a Resend account and verify `earnbuildprotect.com` by adding the DNS records it lists
3. Set the three contact variables and redeploy
4. Send a real message through the live contact form and confirm it arrives, with reply-to set to the sender
5. Take care that the Resend DNS records and the mailbox DNS records do not conflict

### Step 7: Connect the Check application

The Check is a separate project (`financial-resilience-insights`) with its own Vercel deployment.
Coordinate each of these with Victor, because that application carries its own compliance approval.

1. Add the confirmed subdomain to the Check's Vercel project and create its DNS record
2. In the Check, update anything tied to its old address, including the comparison of request origin and host on form submissions. A mismatch there caused false 403 errors before
3. Remove the reviewer password protection only when Victor confirms the Check is ready for the public
4. Set `NEXT_PUBLIC_ASSESSMENT_URL` on this project and redeploy
5. Click every Financial Resilience Check button on the live site and confirm each one arrives at the Check

Until step 4 is done, every Check button shows a labelled configuration placeholder. That is intended.

### Step 8: Spam protection

1. Create a Cloudflare Turnstile widget for the domain
2. Set the two Turnstile variables and redeploy
3. Confirm the challenge appears on the contact page and a message still sends

Turning this on automatically adds Cloudflare to the privacy policy and cookie policy. No copy edit is needed.

### Step 9: Content editing for the team

The editor works on a local machine today at `/keystatic`. To let the team edit from the live site,
set up Keystatic GitHub mode as described in the README under "Managing content". Agree with Victor
who needs editor access before inviting anyone to the repository.

### Step 10: Live checks

Work through "Final checks on the live address" in `docs/LAUNCH-CHECKLIST.md`. In particular:

1. Every page on a real phone and a real desktop browser
2. Both adviser links open the correct destination in a new tab with no parameters attached
3. Sharing preview when a link is pasted into LinkedIn and WhatsApp
4. One of each analytics event visible in the Vercel dashboard
5. A Lighthouse run for performance and accessibility
6. `npm audit` reviewed
7. If Victor supplies a different logo, update the favicon and app icons (`npm run icons`)

### Step 11: Go live

Only on Victor's explicit go-ahead:

1. Set `NEXT_PUBLIC_ALLOW_INDEXING=true` on Production and redeploy
2. Confirm `/robots.txt` allows indexing and lists the sitemap
3. Submit `https://www.earnbuildprotect.com/sitemap.xml` in Google Search Console

## 6. Items Victor still owns

These are not yours to resolve, but they affect launch. Ask Victor for status.

1. Final address for the Check application
2. Word-for-word comparison of the adviser section against the live card in the Check
3. Compliance reviewer to see the "Adviser services are separate" section of the terms
4. Information Commissioner's Office fee check, and the registration number if he registers
5. Platform links for YouTube, Spotify, Apple Podcasts and social accounts as each goes live
6. Host profile, founder introduction, logo files, studio stills and portraits
7. The first episode: thumbnail, links, show notes and transcript

Platform links, the host profile and the founder introduction are entered in the content editor under
Website settings. Nothing is shown for a field that is empty.

## 7. Running costs to expect

Confirm current prices with each provider.

| Item | Expected cost |
| --- | --- |
| Vercel | One Pro seat, about 20 US dollars a month |
| Resend | Free tier is enough for a contact form |
| Cloudflare Turnstile | Free |
| Keystatic and GitHub | Free |
| Google Workspace | Only if needed for the mailbox |
| Domain | Renewal only |

## 8. When you are done

Send Victor:

1. The live address and the Vercel project link
2. Confirmation of each step above, with anything you could not complete and why
3. A list of every account created and who owns it. Accounts should be owned by Victor, with you added as a member
4. Any change you made to code or copy, however small
