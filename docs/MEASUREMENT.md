# Measurement plan

Journey: Discover > Explore content > Build trust > Engage > Financial Resilience Check > optional
protection review.

## Events

| Event | Fires when | Properties | What it tells you |
| --- | --- | --- | --- |
| Page view | Any page loads | Path, referrer | Discovery and exploration |
| `episode_view` | An episode page loads | `episode` | Which conversations pull people in |
| `episode_play` | Visitor presses play | `episode` | Real intent to watch, not just a visit |
| `platform_click` | Click to YouTube, Spotify and so on | `platform`, `placement`, `episode` | Where the audience prefers to listen |
| `resilience_check_click` | Click on any Check button | `placement` | Which page and position sends people to the Check |
| `contact_form_submitted` | A message is accepted | `enquiry_type` | Guest, media and commercial interest |
| `adviser_pathway_click` | Click on the adviser page button or the booking link | `placement`, `target` (`adviser_page` or `booking`) | Only exists once that section is approved and switched on |
| `share_click` | Share or copy link | `channel` | Advocacy |

No event carries a name, an email address or anything a visitor typed.

## Reading the numbers honestly

A `resilience_check_click` is interest, not a lead. The funnel worth reporting is:

1. Visitors
2. Visitors who viewed or played content
3. Check clicks (from this website)
4. Checks started and completed (from the assessment application)
5. Conversations requested (from the assessment application)

Steps 4 and 5 can only come from the assessment application. This website cannot see them, by design.

## Joining the two applications

Every Check link carries campaign parameters:

```
utm_source=ebp_website
utm_medium=referral
utm_campaign=financial_resilience_check
utm_content=<placement>    for example home_hero, episode_<slug>, check_page_hero
```

Recommended approach, which needs a small change in the assessment application:

1. On arrival, the assessment application reads the four parameters and stores them against the
   anonymous session, not against a person
2. It reports starts, completions and conversation requests grouped by `utm_content`
3. Compare those counts with `resilience_check_click` counts here

This gives attribution by placement and by episode without cookies shared across domains, without
passing any identifier between the applications, and without this website ever holding assessment data.

Before switching it on, confirm two things: that storing campaign parameters is consistent with the
assessment application's privacy notice, and that it stays within the compliance decisions already
accepted for that application, in particular that the protection pathway carries no data transfer.

## Consent

As built, the website sets no cookies and uses cookieless analytics, and YouTube loads only after a
visitor presses play. On that basis no consent banner is included. This is a technical description,
not legal advice: have it confirmed as part of the privacy and cookie policy review. Adding any
advertising pixel, remarketing tag or cookie-based tool changes the answer and requires a consent
mechanism before that tool loads.
