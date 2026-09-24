# Deployment

The Region C site is a Next.js 16 application. Every page is statically
prerendered at build time, so it can be hosted on any static-capable host or on a
Node server, and it will handle high traffic on an event day without difficulty.

The site is built to be served either from its own subdomain or from beneath a
path on the Diocese domain, **without a code change**. Only two environment
variables differ between the two arrangements.

---

## Current state of the Diocese site (verified 9 September 2026)

Before choosing an arrangement, note what `cccusadiocese.org` actually runs on
today, because it constrains the options:

- **Platform: Wix.** The apex A records resolve to `185.230.63.171/.186/.107`,
  which reverse-resolve to `wixsite.com`; page assets are served from
  `static.wixstatic.com`.
- **`regionc.cccusadiocese.org` does not currently resolve** — the subdomain is
  free, with no conflicting record.
- The Diocese site organises content by parish and state, and has no existing
  `/region-c` path or region-based navigation to collide with.

**Consequence: Option A is not achievable while the Diocese remains on Wix.**
Wix does not provide reverse proxying, URL rewriting to an external host,
`.htaccess`/Nginx configuration, or the ability to upload a subdirectory of files
to be served as part of the site. There is no supported Wix mechanism for serving
this application from `cccusadiocese.org/region-c`.

Putting Cloudflare in front of the domain to rewrite the path is not a workaround
worth pursuing: Wix manages its own CDN and SSL for the apex, and proxying it is
unsupported and liable to break certificate renewal on the main Diocese site.

Embedding the region site in an `<iframe>` on a Wix page is technically possible
and should be rejected: it breaks deep linking, back-button behaviour, SEO
indexing of parish pages, and mobile scrolling.

**Therefore: deploy Option B now.** Option A remains fully supported in the code
and becomes a two-variable rebuild plus a proxy rule if the Diocese ever migrates
off Wix to a platform that can proxy (self-hosted, Vercel, Netlify, Cloudflare).

---

## Configuration

Both variables are read at **build time**. Changing either one requires a
rebuild — setting them at runtime has no effect.

| Variable | Meaning |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The absolute origin, no trailing slash, **without** the sub-path. Used for canonical URLs, Open Graph tags, `sitemap.xml` and `robots.txt`. |
| `NEXT_PUBLIC_BASE_PATH` | The sub-path the site is served from, e.g. `/region-c`. Leave **empty** when serving from the root of a host. |

---

## Events: the Google Calendar feed

Events are read from the public **"Region C Events"** Google Calendar, owned by
the Region C Google account. `lib/calendar.ts` holds the adapter; `data/events.ts`
exposes it to the pages.

| Variable | Meaning |
| --- | --- |
| `GOOGLE_CALENDAR_API_KEY` | **Required to enable the live feed.** A Google Cloud API key restricted to the Calendar API. Not `NEXT_PUBLIC_` — it must stay server-side. |
| `GOOGLE_CALENDAR_ID` | Optional. Overrides the calendar being read; defaults to the Region C Events calendar already set in `lib/calendar.ts`. |

**Why an API key and not a connected account.** The calendar is published
publicly, so the site only needs to read it. That avoids OAuth entirely: there is
no refresh token to expire, and no credential tied to one person's password that
breaks when they change it or leave the role.

**If the key is absent or Google is unreachable**, the site falls back to the
static sample array in `data/events.ts` and logs the reason. It never renders an
empty calendar because of a failed network call. An empty *live* calendar is
treated as genuinely empty and shows the "no events scheduled" state.

**Window.** The site reads 18 months back and **24 months forward**
(`FUTURE_WINDOW_MONTHS`). The forward bound is load-bearing, not cosmetic:
Google expands a recurring event into individual occurrences and projects a
yearly rule roughly thirty years out. The seven parish Harvests alone return
**210 occurrences running to 2056** if the window is left open — which would list
all 210 as "upcoming", prerender a page for each, and run the calendar view year
by year to 2056. Widen it only deliberately.

**Freshness.** The feed is cached for one hour (`CALENDAR_REVALIDATE_SECONDS`),
so a calendar edit appears within the hour without a redeploy.

## News: the Google Form and Sheet

Region C announcements are submitted through a Google Form, which writes each
response as a row in a Google Sheet. The site reads that Sheet the same way it
reads the calendar. `lib/news-sheet.ts` holds the adapter; `data/news.ts`
exposes it to the pages.

| Variable | Meaning |
| --- | --- |
| `NEWS_SHEET_ID` | **Required to enable the live newsroom.** The id in the sheet's URL, between `/d/` and `/edit`. |
| `GOOGLE_SHEETS_API_KEY` | Optional. Falls back to `GOOGLE_CALENDAR_API_KEY`, so one key can serve both — but that key's API restrictions must then list **both** the Calendar API and the Sheets API, and the Sheets API must be enabled on the project. |
| `NEWS_SHEET_RANGE` | Optional. Defaults to `A:Z` of the first tab, which is where Form responses land. |

The Sheet must be shared so that **anyone with the link can view**; the API key
cannot read a private sheet.

### The Status column is not optional

A Google Form is open to anyone holding its link. Without a gate, a leaked or
forwarded URL would let anyone publish under the Secretariat's name.

**Only rows whose Status cell reads `Published` are rendered** (`Approved`,
`Live`, `Yes` and `True` are accepted too, case-insensitively). A submission
arrives with Status blank, which means it is *not* published; someone on the
Secretariat sets the cell when it should go live.

If the Sheet has no recognisable Status column at all, the adapter **publishes
nothing and falls back to the static array**, rather than treating every row as
approved. That failure mode is deliberate.

### Building the form

`scripts/create-news-form.gs` creates the whole thing — Form, linked Sheet,
Status column with a dropdown, and link-sharing — so the column headers match
this adapter exactly. Run it once at https://script.google.com signed in as the
Region C account; it prints the `NEWS_SHEET_ID` to paste into Vercel. Building
the form by hand works too; the questions are below.

### Form questions

Column headers are matched by wording, not position, so questions can be
reordered or reworded slightly without breaking anything. The words that must
survive are in bold.

| Form question | Fills | Required |
| --- | --- | --- |
| Post **title** | headline, and the URL slug | yes |
| **Category** | one of: Region News, Parish News, Diocese, Evangelism, Youth, Events — use a dropdown | falls back to Region News |
| **Byline** | the author line | falls back to "Region C Secretariat" |
| **Summary** | the standfirst and the text on cards | derived from the body if blank |
| **Body** | the article. **Leave a blank line between paragraphs** | yes |
| Publication **date** | the displayed date; lets a post be backdated | falls back to the form timestamp |
| **Image URL** | an optional picture | optional |
| **Status** | the moderation gate — add this column in the Sheet, not the Form | **yes** |

Add **Status** as a column in the Sheet to the right of the form's own columns.
Google Forms only ever appends its own columns, so an extra one is safe.

**Images** are rendered with a plain `<img>`, not `next/image`. The URL is typed
into a form and may point at any host, and `next/image` throws on a host absent
from `images.remotePatterns` — which would break the page rather than just skip
the picture. The trade-off is that these images are not resized or converted, so
paste URLs to reasonably sized files. If the images settle on one host, add it to
`remotePatterns` in `next.config.ts` and switch to the optimiser.

### News from other CCC publications

The foot of `/news` carries headlines from independent Celestial Church of Christ
publications: a headline, the publisher's own summary, and a link to their page.
Nothing is republished — the reader always ends up on the source's site, and the
section is labelled and attributed so nothing reads as a Region C statement.

`lib/external-news.ts` holds the list of sources. Adding one is an entry in
`SOURCES`; there is no environment variable, because a public news site is not a
credential. Sources are read through the **WordPress REST API** rather than RSS:
it returns JSON, needs no XML parser, and filters by category server-side.

To check whether a candidate publication can be read this way, open
`<site>/wp-json/wp/v2/posts?per_page=1`. JSON means yes. Anything else means the
site is not WordPress or has the API turned off, and it cannot be included
without scraping its HTML — which breaks whenever the publisher restyles, and is
not worth doing.

**There is deliberately no fallback.** If a publisher is unreachable, its section
is omitted. Showing a stale copy of somebody else's news, or an error in place of
their headlines, would both be worse.

**Headlines are shown exactly as published**, including when they are in full
capitals. Converting them to title case was tried and removed: it produced
`31St` and `44Th`, and lowercased ecclesiastical titles into `Mse` and `Emf`.
The set of acronyms that must survive — CCC titles, agencies, place names — is
not reliably enumerable, and misrendering a cleric's title is worse than a
shouted headline.

### Approving submissions

`scripts/news-approval-app.gs` is a small web app for reviewing submissions: it
lists everything pending, shows each post in full, and approves or rejects it in
one tap — setting Status and refreshing the site in the same action. Setup and
deployment options are documented at the top of that file.

It is an Apps Script web app rather than an `/admin` page on this site for one
reason: approving means **writing** to the sheet. The site only ever reads it,
with a read-only key on a public sheet. An admin page here would need a
service-account credential, a sign-in system and a write scope; Apps Script
already runs as the sheet's owner and is authenticated by Google.

Authorisation is the sheet's own sharing list, not a list of emails in code.
Deployed as "execute as the user accessing", someone without edit access to the
sheet simply cannot approve.

### A short address for the approval app

| Variable | Meaning |
| --- | --- |
| `APPROVE_URL` | Optional. The approval web app's `/exec` URL. Set it and `https://<site>/approve` forwards there; leave it unset and that route does not exist. |

Worth setting: it is what gets bookmarked on a phone, and it means the Apps
Script address can change — a new deployment issues a new URL — without anyone
re-bookmarking. It is kept in the environment rather than in the repository so
the address is not published; it is a redirect to a page behind Google sign-in,
not a secret.

The redirect is omitted entirely under `output: 'export'`, which does not
support redirects.

### Publishing a calendar change immediately

To skip the wait, open:

```
https://<site>/api/revalidate-calendar?secret=<CALENDAR_REVALIDATE_SECRET>
```

It discards the cached calendar **and news** responses and nothing else, so the
next page view refetches from Google. It is safe to bookmark on a phone and safe
to hit repeatedly. A successful call returns `{"revalidated":true,...}`.

Append `&only=news` or `&only=calendar` to refresh just one of the two.

| Variable | Meaning |
| --- | --- |
| `CALENDAR_REVALIDATE_SECRET` | A long random string. **Until it is set the endpoint refuses every request**, so a missing variable cannot leave an open refresh URL on the internet. |

Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

The secret may also be sent as an `x-calendar-secret` header instead of a query
parameter, and the endpoint accepts `POST` as well as `GET`, so it can later be
driven by a webhook. A wrong secret returns `401` and is compared in constant
time; an unset one returns `503`.

> **Note for `output: 'export'`:** `npm run build:static` sets `app/api/` aside
> for the duration of the build. A static export cannot serve a route that reads
> its request, and has no cache to revalidate in any case. The folder is restored
> afterwards — see `scripts/build-static.mjs`.

> **Note for `output: 'export'`:** static export has no revalidation, so events
> freeze at build time and a calendar change needs a rebuild. This is one more
> reason to stay on a Node-capable host (see above).

### How an administrator enters an event

Title, date, time and location map across directly. Google Calendar has no
custom fields, so the remaining details go on their own lines in the
**description**, and are lifted out of the visible text automatically:

```
Category: Youth
Register: https://example.org/tickets
Parish: Bethel Parish
State: CA
```

All four are optional and case-insensitive. `Category` must be one of
`Regional`, `Evangelism`, `Youth`, `Women`, `Choir & Music`, `Convention` or
`Training` — anything else is ignored rather than shown. `State` is a two-letter
code. Everything else in the description is shown as the event's prose.

Recurring events are expanded by Google into individual occurrences, so a
repeating programme lists correctly. An annual programme that keeps the same
title each year gets a year-suffixed URL for later occurrences.

`config/site.ts` is the single place these are read. Nothing else in the codebase
hardcodes a domain or a path segment.

---

## Option A — `cccusadiocese.org/region-c` (blocked on Wix; retained for later)

The Region C site appears as a section of the Diocese website. **Not currently
achievable** — see the section above. Retained here because the application
already supports it, and because it is the right destination if the Diocese
migrates off Wix.

**Build with:**

```bash
NEXT_PUBLIC_SITE_URL=https://cccusadiocese.org
NEXT_PUBLIC_BASE_PATH=/region-c
```

Next.js then prefixes every internal link, static chunk, image and public asset
with `/region-c` automatically. This has been verified against a production
build: internal links, `/_next/static/*` chunks, the canonical tag, the Open
Graph image and the sitemap all resolve beneath `/region-c`, with no unprefixed
root-relative URLs remaining.

**What the Diocese web administrator must do**

The Region C application still runs as its own service. The Diocese site needs to
forward the `/region-c` path to it. Choose whichever matches the Diocese hosting:

*If the Diocese site sits behind Nginx or Apache:*

```nginx
location /region-c/ {
    proxy_pass         http://REGION_C_HOST:3000;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
}
```

Note the path is **not** stripped: the application already expects to receive
`/region-c/...`, because it was built with that `basePath`.

*If the Diocese site is on WordPress:* WordPress cannot serve this application
itself. The `/region-c` path must be handled by the web server **before**
WordPress sees it (the block above), or via the host's reverse-proxy feature.
A WordPress "page" at that slug will conflict — it must not exist.

*If the Diocese site is on Vercel, Netlify or Cloudflare:* use a rewrite rather
than a redirect, so the address bar keeps showing `cccusadiocese.org/region-c`.
On Vercel, in the Diocese project's `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/region-c/:path*", "destination": "https://REGION_C_HOST/region-c/:path*" }
  ]
}
```

**Trade-off:** this arrangement gives the strongest identity — one domain, one
site — but it couples Region C deployments to the Diocese's web infrastructure,
and someone with access to that infrastructure has to make the change.

---

## Option B — `regionc.cccusadiocese.org` (recommended, and currently the only viable route)

The Region C site is served from its own subdomain.

**Build with:**

```bash
NEXT_PUBLIC_SITE_URL=https://regionc.cccusadiocese.org
NEXT_PUBLIC_BASE_PATH=
```

**What the Diocese web administrator must do**

One DNS record, and nothing else:

| Type | Name | Value |
| --- | --- | --- |
| `CNAME` | `regionc` | the hosting provider's target (e.g. `cname.vercel-dns.com`) |

If the host requires an apex-style A record instead, it will say so; the
principle is the same — a single record delegating the subdomain.

The Diocese should also add a link to `regionc.cccusadiocese.org` from its own
navigation, so the relationship is visible in both directions. This site already
links back to the Diocese from the header strip, the footer, the homepage and the
contact page.

**Why this is the recommended starting point:** it needs no change to the Diocese
site itself, no proxy configuration, and no coordination on deploys — while still
presenting Region C as part of the Diocese domain. Moving to Option A later is a
rebuild with two changed variables plus a proxy rule, not a rewrite.

### If you later move from B to A

Keep the subdomain alive and 301-redirect it to the path form, so existing links,
bookmarks and search results are preserved. The route structure is identical
between the two, so a blanket redirect is sufficient:

```
https://regionc.cccusadiocese.org/*  →  https://cccusadiocese.org/region-c/*
```

---

## What to request from the Diocese web administrator

Everything needed for the subdomain launch. Items 1-3 are blocking; the rest are
housekeeping.

**1. Who holds the domain, and where DNS is actually served from.**
`cccusadiocese.org` is registered and hosted through Wix, but the authoritative
nameservers may sit at Wix or at an external registrar, and the record must be
added wherever the live zone is. Ask specifically: *"Is DNS for the domain managed
in the Wix dashboard, or at a registrar such as GoDaddy or Namecheap — and who has
login access?"*

**2. One DNS record.** Ask them to add a single `CNAME`:

| Type | Host / Name | Points to |
| --- | --- | --- |
| `CNAME` | `regionc` | supplied once the host is chosen (e.g. `cname.vercel-dns.com`) |

The exact target comes from the hosting provider after the project is created, so
tell them the record is coming and confirm they are willing to add it. In Wix this
is Domains → the domain → DNS Records → add a CNAME under subdomains; Wix permits
a subdomain to point at an external service.

This record does not touch the main Diocese site. It creates a new name alongside
it and cannot affect `cccusadiocese.org` or `www`.

**3. Written approval to publish under the Diocese domain**, and the name of
whoever signs off on regional content.

**4. A "Region C" link in the Diocese navigation**, once live, so the
relationship reads in both directions. This site already links back to the
Diocese from the header, footer, homepage and contact page.

**5. Confirmation that no `regionc` record already exists.** As of
9 September 2026 the name does not resolve publicly, but an unpublished or parked
record would conflict.

**6. Region C's official e-mail addresses** (and a telephone number), to replace
the placeholders in `config/site.ts`.

### What NOT to ask for

Do not ask for `cccusadiocese.org/region-c` yet. Wix cannot serve it, so the
request can only produce a "no" or, worse, an attempt to force it with an iframe.
Ask instead whether the Diocese has any plan to migrate off Wix — if the answer is
yes, note the path arrangement as the eventual target and revisit then.

### Certificate note

The HTTPS certificate for `regionc.cccusadiocese.org` is issued automatically by
the host (Vercel, Netlify, Cloudflare Pages) *after* the CNAME resolves. The
Diocese administrator does not need to supply or install a certificate, and Wix's
certificate for the main site is unaffected.

---

## Who supplies the CNAME value (the order matters)

A common misreading is that the Diocese administrator invents the CNAME value and
hands it over. It is the other way round:

1. **You choose and create the hosting project first** (Vercel, Netlify, Cloudflare
   Pages or GitHub Pages), connecting it to the
   `github.com/CineQua/ccc-region-c` repository.
2. **You add the custom domain** `regionc.cccusadiocese.org` inside that host's
   dashboard.
3. **The host then displays the exact DNS target** to point at — for example
   `cname.vercel-dns.com`, or `<username>.github.io` for GitHub Pages.
4. **You send that value to the Diocese administrator**, who creates the record.
5. The host detects the record, validates the domain and issues the TLS
   certificate automatically. Propagation is usually minutes.

So the administrator receives a value from you; they do not originate one. The
only thing to establish with them in advance is *whether they are willing and able
to add the record*, and who has access to do it — the value follows later.

GitHub itself does not provide the domain or the DNS. The repository is the
source; a host builds and serves it. The one exception is GitHub Pages, which is
both — see below.

---

## Hosting the repository

### Vercel — recommended

Made by the authors of Next.js; the least work and the fewest constraints.

- Connect the GitHub repository; it detects Next.js with no configuration.
- Set `NEXT_PUBLIC_SITE_URL=https://regionc.cccusadiocese.org` and leave
  `NEXT_PUBLIC_BASE_PATH` empty.
- Every push to `main` deploys; pull requests get preview URLs.
- `next/image` optimisation works, which will matter once real parish and
  leadership photographs are added.
- Free tier is sufficient for a site of this size and traffic.

### GitHub Pages — possible, with real trade-offs

GitHub Pages serves static files only; it cannot run Node. This site can be
exported statically, and that has been verified:

```bash
npm run build:static    # writes out/ — 37 HTML pages, sitemap.xml, robots.txt, OG image
```

If you go this route, three things are required:

1. **`.nojekyll`** must exist in the published output. GitHub Pages runs Jekyll by
   default, and Jekyll ignores directories beginning with an underscore — which
   would silently discard the entire `_next/` folder and leave an unstyled,
   scriptless site. This is the single most common way a Next.js deployment to
   Pages fails.
2. **A `CNAME` file** containing `regionc.cccusadiocese.org` in the published
   output, or the equivalent custom-domain setting in the repository's Pages
   configuration.
3. **`NEXT_PUBLIC_BASE_PATH` stays empty** when using a custom domain. It would
   only be needed if serving from `cinequa.github.io/ccc-region-c`, which the
   custom domain replaces.

The trade-off to weigh: static export disables the `next/image` optimiser, so
photographs ship at full size. With no photographs supplied yet this costs
nothing today, but a page of twenty unoptimised headshots on a phone connection
is exactly the kind of regression this site should avoid — and many members will
be on phones.

**Recommendation: use Vercel.** It deploys from the same GitHub repository, needs
no export step, no `.nojekyll`, and keeps image optimisation. Choose GitHub Pages
only if the region specifically wants to avoid a third-party account.

---

## Building and running

```bash
npm install
npm run dev        # development, http://localhost:3000
npm run typecheck  # TypeScript, no emit
npm run lint       # ESLint
npm run build      # production build (Node host)
npm run build:static  # static export to out/ (GitHub Pages and similar)
npm start          # serve the production build
npm run check      # typecheck + lint + build, in that order
```

For local development, copy `.env.example` to `.env.local`. `.env.local` is
already present and configured for the subdomain arrangement.

## Before launch

- Replace the placeholder e-mail addresses in `config/site.ts`, and add the
  regional telephone number.
- Replace the sample parish, event, news and resource records (see README).
- Add the Diocese's preferred link and any official artwork to `public/`.
