# Deployment

The Region C site is a Next.js 16 application. Every page is statically
prerendered at build time, so it can be hosted on any static-capable host or on a
Node server, and it will handle high traffic on an event day without difficulty.

The site is built to be served either from its own subdomain or from beneath a
path on the Diocese domain, **without a code change**. Only two environment
variables differ between the two arrangements.

---

## Configuration

Both variables are read at **build time**. Changing either one requires a
rebuild — setting them at runtime has no effect.

| Variable | Meaning |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The absolute origin, no trailing slash, **without** the sub-path. Used for canonical URLs, Open Graph tags, `sitemap.xml` and `robots.txt`. |
| `NEXT_PUBLIC_BASE_PATH` | The sub-path the site is served from, e.g. `/region-c`. Leave **empty** when serving from the root of a host. |

`config/site.ts` is the single place these are read. Nothing else in the codebase
hardcodes a domain or a path segment.

---

## Option A — `cccusadiocese.org/region-c`

The Region C site appears as a section of the Diocese website.

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

## Option B — `region-c.cccusadiocese.org` (recommended first step)

The Region C site is served from its own subdomain.

**Build with:**

```bash
NEXT_PUBLIC_SITE_URL=https://region-c.cccusadiocese.org
NEXT_PUBLIC_BASE_PATH=
```

**What the Diocese web administrator must do**

One DNS record, and nothing else:

| Type | Name | Value |
| --- | --- | --- |
| `CNAME` | `region-c` | the hosting provider's target (e.g. `cname.vercel-dns.com`) |

If the host requires an apex-style A record instead, it will say so; the
principle is the same — a single record delegating the subdomain.

The Diocese should also add a link to `region-c.cccusadiocese.org` from its own
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
https://region-c.cccusadiocese.org/*  →  https://cccusadiocese.org/region-c/*
```

---

## Building and running

```bash
npm install
npm run dev        # development, http://localhost:3000
npm run typecheck  # TypeScript, no emit
npm run lint       # ESLint
npm run build      # production build
npm start          # serve the production build
npm run check      # typecheck + lint + build, in that order
```

For local development, copy `.env.example` to `.env.local`. `.env.local` is
already present and configured for the subdomain arrangement.

## Hosting notes

- **Vercel** is the least-effort host for a Next.js application: connect the
  repository, set the two environment variables, deploy. Static pages are served
  from the edge.
- **Any Node host** works: run `npm run build` then `npm start` behind a reverse
  proxy. The app listens on `PORT` (default 3000).
- **Static export** is possible if the host cannot run Node — every route is
  already static — by adding `output: 'export'` to `next.config.ts`. Note that
  this disables `next/image` optimisation, so `images.unoptimized` must be set
  too. Do this only if the host genuinely cannot run Node.

## Before launch

- Replace the placeholder e-mail addresses in `config/site.ts`, and add the
  regional telephone number.
- Replace the sample parish, event, news and resource records (see README).
- Add the Diocese's preferred link and any official artwork to `public/`.
