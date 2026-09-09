# Claude Code Master Prompt — CCC USA Diocese Region C Website

I am building the official website for **Celestial Church of Christ, USA Diocese — Region C**.

I want you to act as the **senior web architect, UX designer, frontend developer, and technical strategist** for this project. Do not simply create a generic church website. This should be designed as a **regional administrative and parish hub** that can grow over time.

## 1. Organizational Context

Celestial Church of Christ USA Diocese divides the United States into geographic regions.

Region C consists of multiple U.S. states, including:

- California
- Arizona
- Nevada
- Washington
- and additional Region C states that will be confirmed later.

Every CCC parish located within a Region C state belongs to Region C.

The purpose of this website is to become the central digital hub for:

- Region C leadership
- Region C parishes
- members
- parish shepherds
- regional ministries
- regional events
- announcements
- documents/resources
- youth activities
- evangelism
- technology initiatives
- regional communication

The parent organization already has a website:

**CCC USA Diocese**  
`cccusadiocese.org`

The Region C site will eventually operate underneath the Diocese's web infrastructure.

There are two possible deployment arrangements:

**Preferred option if technically practical:**

`https://cccusadiocese.org/region-c`

**Alternative:**

`https://region-c.cccusadiocese.org`

Build the application so deployment configuration can support either arrangement without requiring a major rewrite.

If this is a Next.js project, specifically account for the possibility of using a `basePath` such as `/region-c`. Do not hardcode URLs in a way that would break assets, routing, navigation, API calls, metadata, or images when deployed beneath a path.

---

## 2. Before You Build

First inspect the existing repository and determine:

- framework
- package manager
- current directory structure
- existing dependencies
- current styling system
- deployment assumptions

Preserve anything useful that already exists.

If this is a new project, use:

- Next.js
- TypeScript
- Tailwind CSS
- responsive/mobile-first design
- reusable React components

Favor maintainability and clean architecture over unnecessary dependencies.

Do not install a large UI framework unless there is a compelling reason.

---

## 3. Design Direction

The site should feel:

- ecclesiastical
- dignified
- contemporary
- organized
- authoritative
- welcoming
- distinctly Celestial Church of Christ

Avoid making it look like:

- a generic American evangelical church template
- a corporate SaaS site
- an overly decorative religious website

Use the visual identity associated with Celestial Church of Christ as inspiration.

Primary visual direction:

- deep celestial/navy blue
- white
- restrained gold/yellow accents
- subtle sky/celestial elements where appropriate
- generous whitespace
- strong typography
- clean cards and grids

The website must remain readable and professional.

Use animation sparingly and purposefully.

---

## 4. Primary Information Architecture

Build the initial site around these main navigation sections:

### Home

### About Region C
- About Region C
- Mission & Purpose
- Region C States
- Leadership

### Parishes
- All Parishes
- Browse by State
- Parish Detail Pages

### Ministries
- Evangelism
- Women
- Youth
- Welfare
- Choir/Music
- other ministries should be easy to add

### Events
- Upcoming Events
- Regional Calendar
- Annual/major programs

### News & Updates
- announcements
- regional news
- parish highlights

### Resources
- forms
- policies
- downloadable documents
- training resources
- technology resources
- Diocese links

### Contact

Also provide a prominent link back to:

**CCC USA Diocese**

---

## 5. Homepage

Create an engaging homepage that immediately communicates:

**Celestial Church of Christ  
USA Diocese — Region C**

Develop an appropriate short subtitle such as:

**Connecting Parishes. Strengthening Fellowship. Advancing the Mission.**

The homepage should contain:

### Hero

Strong Region C identity, introduction, and CTAs such as:

- Find a Parish
- Explore Region C
- Upcoming Events

### Region C at a Glance

Create dynamic/statistical cards for:

- number of states
- number of parishes
- upcoming events
- ministries

Use placeholder values until real data is entered.

### Explore Our Region

Show Region C states visually.

Eventually I would like to introduce an interactive U.S./Region C map, so structure this component in a way that can accommodate one later.

### Find a Parish

Create an obvious parish discovery interface.

Eventually users should be able to filter/search by:

- state
- city
- parish name

### Regional Leadership

Preview key Region C leadership and link to the full Leadership page.

### Upcoming Events

Cards for the next regional events.

### Latest News

News/announcement cards.

### Resources

Quick links for Shepherds, Parish Administrators, Youth leaders, technical personnel, etc.

### Diocese Relationship

Add a small section explaining that Region C operates under the **Celestial Church of Christ USA Diocese**, with a link to the Diocese website.

---

## 6. Region C Leadership

Region C has an administrative body.

I have a reference graphic containing the current Region C Executive Members and their titles.

Build a professional `/leadership` page using individual leadership cards rather than reproducing the attached collage.

Each leader should eventually have:

```ts
{
  id,
  name,
  ecclesiasticalTitle,
  office,
  image,
  state?,
  parish?,
  bio?,
  displayOrder
}
```

The current leadership shown in my source material includes:

- **A/N/S/E. Yves Goncalves** — Evangelism Deputy Director
- **A/N/S/E. Tunde Clement** — Shepherd, Discipline & Reconciliation Chairman
- **Senior Leader Michael Balogun** — Region C Regional Choirmaster
- **A/N/S/E. Chris Isibor** — Shepherd & Protocol
- **MC Abimbola Samuel** — Women Council President
- **HMSE. Abiodun Awosika** — Financial Secretary
- **V/S/E. Yomi Dodo-Williams** — Region C Deputy Regional Supervisor
- **V/S/E. Joe Awosika** — Region C Supervisor
- **V/S/E. Richard Anisere** — Evangelism Director
- **Snr. Evang. Gabriel Shoaga** — Regional Secretary
- **A/N/S/E. Issac Awolope** — Shepherd & Grand Patron
- **V/S/E. Amos Adeoye** — Shepherd & Region C States Supervisor
- **MC Funke Shoaga** — Regional Treasurer & Choir Matron
- **MC Aanu Oshuntola** — Youth Director
- **A/N/S/E. James Adubi** — Shepherd & Special Duties Officer
- **SP.EV. Raphael Akinmolaun** — Shepherd & Member
- **MC Yewande Williams** — Welfare Director
- **SUP. EV. Ade Alaba** — Shepherd & Compliance Officer
- **Snr. Prophetess Kehinde Adebayo** — Youth Coordinator
- **Prophet David Alabi** — Youth Representative

Treat these names/titles as seed data rather than burying them inside JSX.

Create a data file such as:

`data/leadership.ts`

or an equivalent content structure.

This should allow leadership to be modified later without redesigning the page.

Give appropriate prominence to the **Region C Supervisor** and **Deputy Regional Supervisor**, followed by the remaining executive officers.

---

## 7. Parish Directory

This will eventually be one of the most important parts of the site.

Build the parish system as structured data.

Proposed parish model:

```ts
interface Parish {
  id: string;
  name: string;
  slug: string;
  state: string;
  city: string;
  address?: string;
  shepherd?: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  serviceTimes?: string[];
  description?: string;
}
```

Create:

`/parishes`

`/parishes/[slug]`

and state filtering.

The parish directory should eventually support dozens of parishes without requiring layout changes.

Provide search/filter controls.

Use placeholder parish records clearly identified as sample content unless actual data has been supplied.

Do not invent real parish information.

---

## 8. Region C States

Do not hardcode assumptions about exactly which states belong to Region C beyond those confirmed.

Create a centralized data source such as:

`data/states.ts`

Initially mark these as confirmed:

- California
- Arizona
- Nevada
- Washington

Make adding additional states trivial.

Eventually each state should be capable of having:

- state page
- state supervisor
- parish count
- parish list
- state events
- contact information

Potential route:

`/states/[state-slug]`

---

## 9. Events

Create a reusable event model:

```ts
{
  id,
  title,
  slug,
  startDate,
  endDate?,
  location,
  parish?,
  state?,
  description,
  image?,
  registrationUrl?,
  category?
}
```

Provide:

- upcoming events
- event detail page
- date display
- optional registration CTA

Architect this so Google Calendar or another calendar source could eventually be integrated.

---

## 10. News / Announcements

Build reusable news/article structures rather than static homepage text.

Support:

- title
- slug
- date
- author
- featured image
- excerpt
- article content
- category

Categories could eventually include:

- Region News
- Parish News
- Diocese
- Evangelism
- Youth
- Events

---

## 11. Resources

Build a resource center capable of holding:

- PDF documents
- forms
- official notices
- administrative resources
- training
- technology resources
- parish support materials

Each resource should have:

- title
- description
- category
- file/link
- date

Make the UI searchable/filterable later.

---

## 12. Mobile Experience

Treat mobile as a first-class experience.

Many church members will primarily visit this site using smartphones.

Ensure:

- navigation is easy
- text sizes are readable
- leadership cards work well on phones
- parish search is usable
- event cards stack properly
- touch targets are large
- no horizontal overflow
- images are optimized

---

## 13. Accessibility

Follow WCAG-oriented best practices:

- semantic HTML
- alt text
- keyboard navigation
- proper heading hierarchy
- adequate contrast
- accessible menus
- meaningful link labels
- visible focus states

---

## 14. SEO

Prepare strong metadata architecture.

Example title:

**CCC Region C | Celestial Church of Christ USA Diocese**

Support:

- page-specific metadata
- Open Graph
- canonical URLs
- sitemap
- robots.txt
- structured data where appropriate

Parish pages should eventually be optimized for local discovery.

---

## 15. Architecture

Separate:

- layout
- components
- data
- content
- utilities
- configuration

Do not scatter organization-specific data throughout components.

A structure similar to this is appropriate:

```text
app/
  page.tsx
  about/
  leadership/
  parishes/
  states/
  events/
  news/
  ministries/
  resources/
  contact/

components/
  layout/
  home/
  leadership/
  parish/
  events/
  ui/

data/
  leadership.ts
  parishes.ts
  states.ts
  events.ts
  ministries.ts

lib/

public/
  images/
```

Modify this if the existing project architecture suggests a better approach.

---

## 16. Future CMS Requirement

Do not implement a CMS yet unless one already exists in the project.

However, build the data/component architecture so we could later migrate content to:

- WordPress headless
- Sanity
- Supabase
- another CMS/database

without rebuilding the frontend.

Eventually nontechnical Region C administrators should be able to update:

- leaders
- parishes
- events
- announcements
- resources

---

## 17. Deployment Requirement

This requirement is important.

The website may eventually live at:

`cccusadiocese.org/region-c`

even if development or hosting initially occurs somewhere else.

Therefore:

- avoid hardcoded root-relative assumptions
- centralize site URL configuration
- account for Next.js `basePath` if applicable
- ensure asset URLs work beneath `/region-c`
- ensure metadata URLs work
- ensure internal links work
- document deployment configuration

Also document what the Diocese web administrator would need to do for either:

### Option A
`cccusadiocese.org/region-c`

or

### Option B
`region-c.cccusadiocese.org`

The Region C site should be deployable separately if needed while still presenting itself as part of the Diocese.

---

## 18. Development Standards

Write production-quality code.

Requirements:

- TypeScript strictness where reasonable
- reusable components
- minimal duplication
- semantic markup
- clean responsive Tailwind
- optimized images
- good Lighthouse performance
- no unnecessary JavaScript
- no giant monolithic components
- meaningful naming
- clear comments only where useful

Avoid placeholder lorem ipsum.

Use realistic CCC/Region C-oriented placeholder copy when content is unavailable, but clearly identify any invented organizational data as placeholder content.

Never invent historical claims, parish names, leadership information, doctrine, statistics, addresses, or organizational facts.

---

## 19. Work in Phases

Do not attempt to build every future feature simultaneously.

### Phase 1

Build:

1. global layout
2. header/navigation
3. footer
4. design system
5. homepage
6. About Region C
7. Leadership page
8. Parish directory shell
9. state architecture
10. Events shell
11. Resources shell
12. responsive behavior

Populate the Leadership page using the supplied executive leadership information.

### Phase 2

We will subsequently add:

- real parish records
- confirmed Region C states
- events
- ministries
- documents
- news
- maps
- administrative functionality

---

## 20. Start Now

Begin by:

1. inspecting the repository;
2. summarizing the current architecture;
3. identifying anything that should be changed;
4. proposing the page/component/data architecture;
5. establishing the visual system;
6. implementing Phase 1.

Do not stop after merely giving me recommendations. Proceed with implementation.

After implementation:

- run linting
- run TypeScript checks
- run the production build
- fix errors
- review mobile responsiveness
- report what was completed
- identify any placeholder data
- give me the next recommended development priorities.

---

## Architectural Recommendation

The parish directory should become the **core data layer** of this site, not an afterthought. Once the complete Region C parish list is available, the site can be organized hierarchically as:

**Region C → State → Parish → Shepherd / Contact / Services / Events**

For example:

`Region C → California → Los Angeles → Sanctum Parish`

That structure can later power:

- an interactive regional map
- state-level parish counts
- parish search and filtering
- event filtering
- regional statistics
- resource distribution
- Region C technology and administrative initiatives

For independent deployment, **`region-c.cccusadiocese.org`** is likely the cleaner initial option because it provides more hosting flexibility while preserving the Diocese domain identity. A path such as **`cccusadiocese.org/region-c`** can still be supported later via native integration, proxying, or redirects depending on the Diocese site's hosting architecture.
