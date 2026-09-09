# CCC USA Diocese — Region C

The official website for **Celestial Church of Christ, USA Diocese — Region C**:
a regional administrative and parish hub, not a brochure site.

Built with Next.js 16 (App Router), TypeScript and Tailwind CSS 4. No UI
framework, no component library, no state library — the dependency list is Next,
React and Tailwind.

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # typecheck + lint + production build
```

---

## Architecture

Organisation-specific content lives in `data/`. It is never embedded in
components. Adding a parish, a state, an event, an announcement, a ministry or a
resource is an entry in one file — pages, navigation, counters, filters, the
sitemap and structured data all derive from it.

```
app/          Routes (App Router). One directory per section.
components/
  layout/     Header, footer, brand
  ui/         Design-system primitives (button, card, badge, icons, …)
  home/       Homepage sections
  leadership/ parish/ events/ news/ resources/   Feature components
data/         The content layer — the file you edit to change the site
lib/          Types, date formatting, metadata builders, class helper
config/       site.ts (URLs, org details) and navigation.ts
public/       Static assets
```

### The data layer

| File | Holds | Notes |
| --- | --- | --- |
| `data/leadership.ts` | The 20 Region C Executive members | **Real**, transcribed from the official listing |
| `data/states.ts` | Region C states | **Real** — CA, AZ, NV, WA confirmed |
| `data/ministries.ts` | Ministry departments | Real structure; descriptive copy is generic |
| `data/parishes.ts` | Parish directory | **Sample records only** |
| `data/events.ts` | Regional calendar | **Sample records only** |
| `data/news.ts` | Announcements | **Sample records only** |
| `data/resources.ts` | Resource centre | Shelf is real; documents not yet supplied |

Every interface is defined in `lib/types.ts`. That file is the contract between
content and presentation: a later move to a CMS (Sanity, Supabase, headless
WordPress) only has to satisfy those shapes, and no component changes.

### Placeholder data

Nothing organisational has been invented. Records that are illustrative carry
`isPlaceholder: true`, which does three things automatically:

1. a **Sample** badge appears on the card;
2. a **Sample content** notice appears on the page;
3. the record is excluded from `sitemap.xml` and emits no structured data, so
   search engines never index example content as a real parish or event.

Removing the flag — once verified data replaces the sample — reverses all three.

Leadership headshots have not been supplied, so leader cards render a monogram
and the caption "Photograph pending". Set `image` on a leader in
`data/leadership.ts` and the card switches to the photograph with no other
change.

---

## Common tasks

**Add a parish** — append a `Parish` to `data/parishes.ts`. It appears in the
directory, its state page, the search index, the homepage counter, the sitemap
and gets its own page at `/parishes/<slug>` with local-business structured data.

**Add a Region C state** — append a `RegionState` to `data/states.ts`. Use
`status: 'pending'` for a state not yet ratified; it renders as awaiting
confirmation and is excluded from published counts.

**Change a leader or an office** — edit `data/leadership.ts`. `displayOrder`
controls position; `tier: 'principal'` gives the larger card (currently the
Supervisor and Deputy Supervisor); `portfolio` decides the section they appear
under and which ministry pages list them.

**Add an event** — append a `RegionEvent` to `data/events.ts`. Upcoming/past
splitting, the year-grouped calendar and the ministry cross-links are automatic.

**Publish a document** — put the file in `public/documents/`, then set `href` to
`/documents/<file>` on its entry in `data/resources.ts` and remove
`isPlaceholder`. Until then it shows as "document pending" rather than as a
broken download.

**Add a navigation item** — `config/navigation.ts`. Header, mobile drawer and
footer all read from it.

---

## Design system

Deep celestial navy, white, restrained gold. Tokens are defined once in
`app/globals.css` under `@theme`; there are no ad-hoc hex values in components.
Gold is an accent only — it is never used for body text on white, where it would
fail contrast.

Typography pairs Source Serif 4 (headings — ecclesiastical, dignified) with Inter
(body and interface — legible at small sizes).

## Accessibility

Semantic landmarks and a single `h1` per page with an ordered heading hierarchy;
a skip link; visible focus rings on every interactive element including on navy
surfaces; `aria-current` on the active nav item; live regions announcing search
result counts; decorative SVG hidden from assistive technology; touch targets at
or above 44px; `prefers-reduced-motion` honoured.

## Performance

Every route is statically prerendered. Client-side JavaScript is limited to three
components that genuinely need it — the mobile drawer, parish search and resource
search. Desktop navigation dropdowns are CSS-only. Icons are inline SVG rather
than an icon package.

---

## Deployment

The site runs from either `cccusadiocese.org/region-c` or
`region-c.cccusadiocese.org` with no code change — two environment variables
differ. **See [DEPLOYMENT.md](./DEPLOYMENT.md)** for both arrangements and for
what the Diocese web administrator has to do in each case.

## Source material

`ccc-region-c-claude-code-master-prompt.md` — the project brief.
`regionc-admin.jpg` — the official Region C Executive Members graphic, the source
for `data/leadership.ts`.
