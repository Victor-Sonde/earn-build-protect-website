# Earn.Build.Protect website

The official website for Earn.Build.Protect: homepage, podcast, episode template, media library,
Financial Resilience Check landing page, about, contact, and draft privacy, cookie and terms pages.

The website links to the existing Financial Resilience Check application. It does not rebuild it and
never collects assessment answers.

**Implementing this site? Start with [HANDOVER.md](HANDOVER.md).**

## Status: what has and has not been done

Done and checked in a local production build:

- All Phase 1 routes build and return the expected responses
- Type check passes
- Desktop (1440 pixels) and mobile (390 pixels) layouts reviewed page by page, with no horizontal scrolling
- Empty states (nothing published) and populated states (using the labelled example content)
- Contact route: origin check, validation, honeypot, timing trap, rate limit and the "not configured" response
- Mobile menu, library search and filters, keyboard focus, skip link
- Video player makes no request to YouTube until the visitor presses play
- Content editor loads and opens entries in local mode
- Text colour contrast meets WCAG AA on every surface

Not done, because it needs accounts, credentials or approvals that only you hold:

- Not deployed to Vercel, and no domain connected
- Contact form email delivery not tested end to end (needs a Resend key and a verified domain)
- Turnstile spam check not tested against Cloudflare (needs keys)
- Content editor GitHub mode not tested (needs a GitHub App on your repository)
- Analytics events not confirmed in a dashboard (needs the Vercel project)
- No compliance or legal review of any copy
- No automated test suite and no formal accessibility audit with assistive technology
- Lighthouse performance not measured

See [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md) for every outstanding item.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16, App Router, TypeScript | As specified. Every public page is pre-rendered as static HTML |
| Styling | Tailwind CSS 3.4 | Matches the Financial Resilience Check application and avoids the Tailwind 4 native binary |
| Content | Keystatic | Free, no database, no separate service. Content is files in this repository |
| Media | YouTube, Spotify and Apple Podcasts links | No self-hosted video or audio |
| Email | Resend, called from one server route | No database of submissions |
| Analytics | Vercel Web Analytics, optional Plausible | Cookieless, so no consent banner is needed for analytics |
| Fonts | Bricolage Grotesque and Newsreader, self-hosted | No request to Google Fonts |

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in what you have
npm run dev
```

Open http://localhost:3000 for the website and http://localhost:3000/keystatic for the content editor.

Other commands: `npm run build`, `npm run start`, `npm run typecheck`.

## Project structure

```
content/                  Published content. The website reads only this folder
  episodes/ clips/ articles/ guests/ topics/
  settings.yaml           Platform links, host, founder text, approved disclosures
content-examples/         Labelled examples showing the shape of each entry. Never published
docs/                     Design system, measurement plan, launch checklist
keystatic.config.ts       The content model the editor is generated from
public/images/            Thumbnails and photos uploaded through the editor
src/app/(site)/           Public pages, with the shared header and footer
src/app/api/contact/      Contact form handler
src/app/keystatic/        Content editor
src/components/           Reusable interface components
src/lib/                  Content reader, site configuration, analytics, validation
tailwind.config.ts        Design tokens
```

## Environment variables

Every variable is documented in [.env.example](.env.example). Nothing secret is in the repository.

| Variable | Needed for | If missing |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical links, sitemap, sharing previews | Falls back to the Vercel address |
| `NEXT_PUBLIC_ASSESSMENT_URL` | Every Financial Resilience Check button | Buttons show a labelled configuration placeholder |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Letting search engines index the site | Site asks not to be indexed |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact form delivery | Form tells the sender the message was not sent |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Stronger spam protection | Honeypot, timing trap and rate limit still apply |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics | Not loaded |
| Five `KEYSTATIC` variables | Editing content from the live site | Editor works on your own machine only |

## Managing content

### What the team can edit

Podcast episodes, clips and short media, articles, guest profiles, topics, and website settings
(platform links, host profile, founder introduction, approved regulatory disclosure, and the optional
protection review section).

Every episode, clip and article has a publishing status. Only "Published" items appear on the website.
An item with a future publish date stays hidden until the site is next rebuilt on or after that date.

### Option A: edit on your own machine (works today, no setup)

1. Run `npm run dev` and open http://localhost:3000/keystatic
2. Create or edit entries and save. Saving writes files into `content/`
3. Commit and push. Vercel rebuilds and the change goes live

In this mode the editor does not exist on the live website at all. The address returns "not found".

### Option B: edit from the live website (recommended for a non-technical team)

Editors sign in with GitHub at `https://www.earnbuildprotect.com/keystatic`. Each save is a commit and Vercel
rebuilds automatically. Editors need write access to the repository, which is the access control.

1. Deploy the site once (see below)
2. Set `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` to `owner/repository` in `.env.local`, run `npm run dev`,
   and open http://localhost:3000/keystatic. Keystatic walks you through creating a GitHub App and
   writes the four remaining values into `.env.local`
3. Copy all five values into Vercel environment variables and redeploy
4. In the GitHub App settings, add `https://www.earnbuildprotect.com/api/keystatic/github/oauth/callback` as a callback address
5. Invite each editor to the repository with write access

This mode has not been tested in this build because it needs your GitHub account.

### Adding the first episode

1. Podcast episodes > Create
2. Fill in title, description, season, episode number, date and duration
3. Paste the YouTube, Spotify and Apple Podcasts links you have. Missing links are simply not shown
4. Upload a 16:9 thumbnail. Without one, the site draws a typographic cover
5. Add key takeaways, timestamps, show notes and the transcript
6. Tick the pillars, set the status to Published, and save

The homepage, podcast page, media library and sitemap all pick it up on the next build.
`content-examples/` shows a complete entry.

## Deploying to Vercel

1. Create a GitHub repository and push this project to it
2. In Vercel choose Add New > Project and import the repository. The defaults are correct: framework
   Next.js, build command `next build`, no output directory override
3. Add the environment variables from `.env.example` that you have. Leave `NEXT_PUBLIC_ALLOW_INDEXING` unset
4. Deploy. You get a `vercel.app` address to review
5. In the Vercel project, open Analytics and enable Web Analytics

### Connecting the domain

The website lives at `https://www.earnbuildprotect.com`. The Financial Resilience Check is planned
for a subdomain such as `app.earnbuildprotect.com`. They are two separate Vercel projects on one domain.

**This website**

1. Vercel project > Settings > Domains > add `www.earnbuildprotect.com` and `earnbuildprotect.com`
2. Set `www.earnbuildprotect.com` as primary, so the bare domain redirects to it
3. At the domain registrar, create the records Vercel shows. Typically a `CNAME` for `www` and an
   `A` record for the bare domain. Use the exact values Vercel displays, since they can change
4. Wait for the certificate to be issued, usually a few minutes
5. Set `NEXT_PUBLIC_SITE_URL=https://www.earnbuildprotect.com` on Production and redeploy

**The Check application, in its own Vercel project**

1. Add the chosen subdomain, for example `app.earnbuildprotect.com`, under that project's Domains
2. At the registrar, add the `CNAME` record Vercel shows for `app`
3. In that application, update anything tied to its old address: its site address setting, and the
   check that compares the request origin with the host on form submissions
4. Remove the reviewer password protection when the application is ready for the public
5. Back in this project, set `NEXT_PUBLIC_ASSESSMENT_URL` to that address and redeploy

**Email and launch**

1. In Resend, verify `earnbuildprotect.com` by adding the DNS records it lists, then set
   `CONTACT_FROM_EMAIL` to an address on the domain
2. When launch is approved, set `NEXT_PUBLIC_ALLOW_INDEXING=true` on Production and redeploy

## Running costs

Check each provider's current pricing before committing. These were correct to the best of my
knowledge at the time of writing and may have changed.

| Item | Cost | Note |
| --- | --- | --- |
| Vercel | Hobby is free but its terms restrict it to non-commercial use. Pro is about 20 US dollars per member each month | This is a commercial site, so plan for Pro. Custom analytics events also require Pro |
| Keystatic | Free | Open source, content lives in GitHub |
| GitHub | Free | Private repository on a personal or organisation account |
| Resend | Free tier covers a few thousand emails a month | Far more than a contact form needs |
| Cloudflare Turnstile | Free | |
| Plausible | Optional, paid, from about 9 US dollars a month | Only if you want it alongside or instead of Vercel analytics |
| Domain | Already secured: earnbuildprotect.com. Renewal only | The app subdomain costs nothing extra |

Realistic running cost: one Vercel Pro seat plus the domain.

## Security notes

- No secrets in the repository. Server-only keys are never exposed to the browser
- The content editor is unreachable in production unless GitHub sign-in is configured
- Contact input is validated and length-limited on the server, sent as plain text and never stored or logged
- Editor-written content is rendered through Markdoc, which does not execute raw HTML. Links are limited to safe schemes
- External links open with `noopener noreferrer`
- Security headers are set in `next.config.ts`
- `npm audit` reports issues in build-time tooling pulled in by Tailwind 3 and Keystatic. They are not
  part of what is served to visitors. Review them again before launch

## Phase 2

The structure already has a home for each planned enhancement, with nothing built ahead of need:

- Editorial articles: the collection and the `/insights/[slug]` template exist and stay empty until used
- Topic landing pages: topics are a managed list, and `/media?topic=Name` already deep-links
- Newsletter, audience questions and guest nominations: add a form component and one server route, following the contact form pattern
- Downloadable resources: a clip of type "Educational resource" can link to a file today
- Recommendations: every item carries pillars and topics, which is the data a recommender needs
