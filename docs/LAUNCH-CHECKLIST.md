# Outstanding configuration and launch readiness

## Decisions and approvals only you can give

- [x] Compliance review of the website. Victor reported clear sign-off from the compliance reviewer on
      11 October 2026. Keep the written approval on file with the other submission documents. Any later
      change to copy that describes the Check or protection services needs to go back for review
- [ ] Adviser pathway section on the Check page: switched on, 11 October 2026, reusing the PROTECT card
      wording approved for the Check application (statement, "Go to Victor's adviser page", "Book a time
      with Victor's adviser practice", and the "Nothing from this check is sent anywhere" line). Links
      carry no query string and no referrer. Before launch:
      - compare the wording against the live PROTECT card, word for word
      - reviewer confirmation that the card is cleared for the website: Victor confirmed on 11 October 2026
        that this is approved. The written approval is held by Victor and is not stored with this project
      - confirm the heading "Protect", which labels the section and is the one element added for the website
      - Victor confirmed on 11 October 2026 that the Calendly address entered is the approved one
- [x] Footer regulatory disclosure: none required, confirmed by Victor on 11 October 2026. The field in
      Website settings stays empty
- [ ] Confirm the general education statement in the footer
- [ ] Confirm the copy describing the Check matches the live application: what it asks, what it shows
      afterwards and how it describes its own data handling
- [ ] Approve the four editorial principles on the About page. They were drafted from the brief
- [x] Privacy policy, cookie policy and terms: drafted and approved by Victor on 11 October 2026. The
      draft notices are removed and `legal.approved` is `true` in `src/lib/site.ts`. They were drafted
      without a lawyer and are not legal advice. Confirmed details: legal entity "Victor Sonde, trading
      as Earn.Build.Protect"; 24 month retention for contact enquiries; governing law England and Wales;
      no postal address published; mailbox hosted by Google
- [ ] Information Commissioner's Office: complete the fee self-assessment, register if required, and add
      the registration number to the privacy policy
- [ ] Compliance reviewer to see the "Adviser services are separate" section of the terms
- [ ] Confirm the transfer safeguards named in the privacy policy against each provider's terms
- [ ] Victor's written agreement to publishing earnbuildprotect@gmail.com on the legal pages in place
      of hello@earnbuildprotect.com, which does not exist. Confirm the Gmail inbox is monitored
- [ ] Confirm that no cookie banner is needed, as part of that review

## Configuration

- [x] Domain secured: earnbuildprotect.com
- [ ] `www.earnbuildprotect.com` and the bare domain connected in Vercel, with `www` as primary
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.earnbuildprotect.com` set on Production
- [ ] Final subdomain for the Check confirmed (planned: `app.earnbuildprotect.com`) and connected to the Check's own Vercel project
- [ ] The Check application updated for its new address, including its origin check on submissions
- [ ] `NEXT_PUBLIC_ASSESSMENT_URL` set to the confirmed subdomain. If the Check is still
      behind password protection, visitors from this site will hit a sign-in prompt
- [ ] Resend account, domain verified, three contact variables set
- [ ] Send a real test message through the live contact form and confirm it arrives
- [ ] Turnstile keys set, and the challenge confirmed on the live contact page
- [ ] Vercel plan confirmed as suitable for commercial use
- [ ] Vercel Web Analytics enabled, and one of each event confirmed in the dashboard
- [ ] Content editor mode chosen. If GitHub mode, the GitHub App created and editors invited

## Content and assets

- [ ] Platform links entered as each channel goes live. Nothing is shown for a platform without a link
- [ ] Host profile entered once you are ready to announce the host
- [ ] Founder introduction entered, using confirmed information only
- [ ] Logo files supplied if a brand logo exists. The current mark is a proposal
- [x] Favicon and app icons, drawn from the proposed mark. Regenerate with `npm run icons` if the
      final logo differs
- [ ] Studio stills and portraits
- [ ] First episode entered with thumbnail, links, notes and transcript

## Final checks on the live address

- [ ] Every page on a real phone and a real desktop browser
- [ ] Every Check button reaches the application
- [ ] Sharing preview looks right when a link is pasted into LinkedIn and WhatsApp
- [ ] Episode page validated with Google's Rich Results Test
- [ ] Lighthouse run for performance and accessibility
- [ ] Screen reader pass on the homepage, an episode and the contact form
- [ ] `npm audit` reviewed
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true` set on Production, redeployed, and `/robots.txt` checked
- [ ] Sitemap submitted in Google Search Console
