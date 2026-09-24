import type { ExternalArticle } from './types';

/**
 * News from other Celestial Church of Christ publications.
 *
 * Headline, the publisher's own summary and a link to their page — never the
 * article itself. Excerpting and linking is ordinary practice and keeps the
 * reader going to the source; republishing someone else's reporting would not
 * be, and would risk another body's words reading as a Region C statement.
 *
 * Sources are read through the WordPress REST API rather than RSS: it returns
 * JSON, so no XML parser is needed, and it can filter by category server-side.
 *
 * Headlines are passed through verbatim, including when a publisher sets them
 * in full capitals. Title-casing them was built and removed: besides mangling
 * ordinals, it rewrote `EMF` — the initials of the Pastor, Emmanuel Mobiyina
 * Friday Oshoffa — as `Emf`. Nothing can reliably tell a person's initials from
 * a word, so the text is left as its publisher set it.
 *
 * Unlike the calendar and the newsroom there is NO fallback. This is
 * supplementary content: if a publisher is unreachable its section is simply
 * not rendered, which is preferable to showing a stale copy of someone else's
 * news or an error where their headlines should be.
 */

export const EXTERNAL_NEWS_REVALIDATE_SECONDS = 3600;

/** Cache tag, so the feed can be refreshed on demand alongside the others. */
export const EXTERNAL_NEWS_TAG = 'external-news';

interface Source {
  /** Shown to the reader as the publisher. */
  name: string;
  /** The publisher's home page, linked from the attribution line. */
  home: string;
  /** WordPress REST root, no trailing slash. */
  api: string;
  /** Category id to read for USA coverage; omit if the source has none. */
  usaCategoryId?: number;
  /** How many to take from each scope. */
  usaLimit: number;
  worldLimit: number;
}

/**
 * Add a publication by adding an entry here.
 *
 * Check a candidate first: `<site>/wp-json/wp/v2/posts?per_page=1` should return
 * JSON. If it does not, the site is not WordPress or has the API disabled, and
 * it cannot be read this way.
 */
const SOURCES: readonly Source[] = [
  {
    name: 'Celestial Prerogative News',
    home: 'https://celestialprerogativenews.com',
    api: 'https://celestialprerogativenews.com/wp-json/wp/v2',
    // "United State of America", 147 posts as at September 2026.
    usaCategoryId: 7,
    usaLimit: 5,
    worldLimit: 4,
  },
];

interface WpPost {
  id?: number;
  date?: string;
  link?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
}

/* ------------------------------------------------------------- Fetching --- */

export async function fetchExternalNews(): Promise<{
  usa: ExternalArticle[];
  worldwide: ExternalArticle[];
}> {
  const results = await Promise.all(SOURCES.map(readSource));

  const usa = results.flatMap((r) => r.usa);

  // A worldwide feed includes the USA posts, so anything already shown above is
  // dropped rather than repeated a few centimetres lower. Headlines are matched
  // as well as links: a publisher may run the same story at two addresses, and
  // to a reader that is simply the same item listed twice.
  const seen = new Set(usa.flatMap((a) => [a.url, titleKey(a.title)]));
  const worldwide: ExternalArticle[] = [];

  for (const article of results.flatMap((r) => r.worldwide)) {
    if (seen.has(article.url) || seen.has(titleKey(article.title))) continue;
    seen.add(article.url);
    seen.add(titleKey(article.title));
    worldwide.push(article);
  }

  const byDateDesc = (a: ExternalArticle, b: ExternalArticle) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

  const worldLimit = SOURCES.reduce((n, s) => n + s.worldLimit, 0);

  return {
    usa: usa.sort(byDateDesc),
    worldwide: worldwide.sort(byDateDesc).slice(0, worldLimit),
  };
}

async function readSource(source: Source) {
  const [usa, worldwide] = await Promise.all([
    source.usaCategoryId
      ? readPosts(source, 'usa', { categories: String(source.usaCategoryId), per_page: String(source.usaLimit) })
      : Promise.resolve([]),
    // Over-fetch: most of a worldwide feed's newest posts are also the USA ones
    // already shown, and they are removed after this.
    readPosts(source, 'worldwide', { per_page: String(source.worldLimit + source.usaLimit * 2) }),
  ]);
  return { usa, worldwide };
}

async function readPosts(
  source: Source,
  scope: 'usa' | 'worldwide',
  params: Record<string, string>,
): Promise<ExternalArticle[]> {
  const url = new URL(`${source.api}/posts`);
  url.searchParams.set('_fields', 'id,date,link,title,excerpt');
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  try {
    const response = await fetch(url, {
      next: { revalidate: EXTERNAL_NEWS_REVALIDATE_SECONDS, tags: [EXTERNAL_NEWS_TAG] },
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      console.error(`[external-news] ${source.name} returned ${response.status}; section omitted.`);
      return [];
    }

    const posts = (await response.json()) as WpPost[];
    if (!Array.isArray(posts)) return [];

    return posts
      .map((post) => toArticle(post, source, scope))
      .filter((article): article is ExternalArticle => article !== null);
  } catch (error) {
    console.error(`[external-news] Could not reach ${source.name}; section omitted.`, error);
    return [];
  }
}

/* -------------------------------------------------------------- Mapping --- */

function toArticle(
  post: WpPost,
  source: Source,
  scope: 'usa' | 'worldwide',
): ExternalArticle | null {
  const title = clean(post.title?.rendered ?? '');
  const url = (post.link ?? '').trim();
  if (!title || !/^https?:\/\//i.test(url)) return null;

  return {
    id: `${new URL(source.home).hostname}-${post.id ?? url}`,
    title,
    url,
    // WordPress returns a local date-time; only the date is ever displayed.
    date: (post.date ?? '').slice(0, 10) || new Date().toISOString().slice(0, 10),
    excerpt: trimToWord(clean(post.excerpt?.rendered ?? ''), 180),
    source: source.name,
    sourceUrl: source.home,
    scope,
  };
}

/** Strips the publisher's markup and decodes the entities WordPress emits. */
function clean(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  ndash: '–',
  mdash: '—',
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => safeCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => safeCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => NAMED_ENTITIES[String(name).toLowerCase()] ?? match);
}

function safeCodePoint(code: number): string {
  return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
}

/**
 * Cuts at a word boundary.
 *
 * WordPress excerpts are already truncated, often mid-word and with a trailing
 * ellipsis, so this tidies rather than shortens in most cases.
 */
function trimToWord(text: string, max: number): string {
  const withoutTrailing = text.replace(/[\s.…]*(\[\s*…?\s*\]|\.\.\.|…)\s*$/, '').trim();
  if (withoutTrailing.length <= max) return withoutTrailing;

  const cut = withoutTrailing.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).replace(/[,;:.\s]+$/, '')}…`;
}

/** Headline reduced to a comparable key, so near-identical titles collapse. */
function titleKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
