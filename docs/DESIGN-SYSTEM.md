# Design system

## Direction

A premium media brand, not a broker's website. Dark studio surfaces, warm paper for reading, and one
amber accent used with restraint.

The signature is the hero: the brand proposition set as three stepped lines joined by a single amber
line. Earn, Build and Protect read as one progression, never three separate businesses. The same idea
repeats in the mark (three rising bars) and in the pillar band (three columns on one rule).

Amber as a full surface is reserved for the Financial Resilience Check, so the principal call to
action is recognisable everywhere it appears.

Content sits in soft, rounded cards that lift slightly off the band beneath them: light cards on paper
bands, raised cards on dark bands, a translucent ink card on amber. Dark heroes carry a faint grid and
a soft amber glow (`.backdrop-studio`), and the mark appears large and nearly transparent as a
background motif.

There is no stock photography. Where a thumbnail is missing, the site draws a typographic cover.
Real studio stills and portraits will lift the site considerably once they exist.

## Colour

Defined once in `src/app/globals.css`, mapped in `tailwind.config.ts`.

| Token | Value | Use |
| --- | --- | --- |
| `ink` | #1E1C1A | Primary dark surface, text on light surfaces |
| `ink-raised` | #2A2623 | Raised dark bands and covers |
| `ink-line` | #403A35 | Rules on dark |
| `paper` | #F1EADD | Primary light surface, text on dark |
| `paper-bright` | #F8F4EC | Cards on light bands |
| `paper-deep` | #E5DAC7 | Alternate light band |
| `paper-line` | #CFC1A8 | Rules on light |
| `amber` | #DD9A2C | Accent, primary button, Check surface |
| `amber-deep` | #85530A | Amber text on light surfaces |
| `amber-soft` | #F0C57A | Button hover |
| `stone-dark` | #B9AF9F | Secondary text on dark |
| `stone-light` | #584F44 | Secondary text on light |

Measured contrast: paper on ink 14.2, secondary on ink 7.8, amber on ink 7.1, ink on amber 7.1,
secondary on paper 6.7, amber-deep on paper 5.4, amber-deep on paper-deep 4.7. All meet WCAG AA.

## Typography

| Role | Typeface | Notes |
| --- | --- | --- |
| Display and interface | Bricolage Grotesque, variable | Headlines use the `.display` class: weight 800, width 82, tight tracking |
| Editorial reading | Newsreader, variable | Lead paragraphs, show notes, transcripts, articles |

Scale (ratio 1.25 on a 17 pixel base): `meta`, `small`, `base`, `lead`, `h4`, `h3`, `h2`, `h1`, `hero`.
The top three are fluid. Reading measure is capped at 40rem with the `max-w-prose` token.

Small uppercase labels (section labels, footer column headings, card meta) use the `.kicker` class:
meta size, bold, 0.14em tracking.

## Spacing and layout

- Page width `max-w-page` (82rem) with a fluid `gutter`
- Vertical rhythm between bands: `py-section`, fluid from 4rem to 8rem
- Breakpoints: `sm` 560, `md` 820, `lg` 1080, `xl` 1320. Mobile first
- Corners: `rounded-full` for buttons, chips and the search field, `rounded-tile` (10px) for form
  fields, `rounded-panel` (20px) for cards and artwork, `rounded-card` (28px) for large empty states
- Shadows: `shadow-lift` for cards on light bands, `shadow-lift-dark` on dark, `shadow-amber` for the
  amber button only
- Surface classes in `globals.css`: `.card-light`, `.card-dark`, `.card-amber`, with `.rows`,
  `.rows-dark` and `.rows-amber` for hairline-divided rows inside them, and `.text-link` for inline
  links with an amber underline

## Components

| Component | File | Purpose |
| --- | --- | --- |
| `Band` | `ui.tsx` | A full-width section in one of five tones |
| `PageIntro` | `ui.tsx` | Standard page heading block |
| `ButtonLink`, `buttonClass`, `Arrow` | `ui.tsx` | Pill buttons in four variants: amber, ink, line-light, line-dark. Amber and ink carry an arrow by default |
| `MetaList` | `ui.tsx` | Dot-separated meta row with the first item highlighted |
| `Mark`, `StepMark`, `Logo` | `ui.tsx` | Brand mark, the mark with one pillar's bar lit, and the wordmark |
| `CheckCta` | `check-cta.tsx` | The only route to the Check. Tracks clicks, shows the configuration placeholder |
| `Header`, `Footer` | | Sticky header that turns translucent on scroll, mobile menu, disclosures |
| `Cover` | `cover.tsx` | 16:9 artwork with typographic fallback |
| `MediaCard` | `media-card.tsx` | Episode, clip and article card |
| `FeaturedEpisode` | `featured-episode.tsx` | Featured episode or the in-production state |
| `MediaLibrary` | `media-library.tsx` | Search and filters with empty states |
| `VideoEmbed` | `video-embed.tsx` | Click-to-load, privacy-enhanced YouTube player |
| `PlatformLinks` | `platform-links.tsx` | Only shows platforms that have a link |
| `ContactForm` | `contact-form.tsx` | Validated form with accessible errors |
| `ShareActions` | `share-actions.tsx` | Share links and copy link |
| `RichText` | `markdoc.tsx` | Safe rendering of editor-written content |
| `LegalPage` | `legal-page.tsx` | Layout for legal pages, with the draft notice |

## Accessibility

Skip link, one `h1` per page, labelled landmarks, visible 3 pixel focus ring on every surface,
44 pixel minimum touch targets, form errors linked to their fields and announced, reduced-motion
respected. The only non-triggered motion on the site is the hero line drawing once on load. Hover
states lift cards and nudge arrows; all of it is switched off under reduced motion.

## Assets still needed

Brand logo files if a logo already exists (the current mark is a proposal), studio stills, host and
founder portraits, and episode thumbnails.

## Icons

The favicon and app icons are drawn from the proposed mark by `scripts/generate-icons.mjs`
(`npm run icons`), with no dependencies. It writes `src/app/favicon.ico`, `src/app/apple-icon.png`
and the three manifest icons in `public/`. `src/app/icon.svg` is the scalable tab icon and
`src/app/manifest.ts` the web app manifest. If a final logo arrives, update the bars in the script and
in `icon.svg`, then run the script again.
