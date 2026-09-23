import type { NewsArticle, NewsCategory } from './types';

/**
 * Google Sheet source for Region C news.
 *
 * Announcements are submitted through a Google Form, which writes each response
 * into a Sheet. The site reads that Sheet the same way it reads the calendar:
 * published publicly, read with an API key, no OAuth and no token to expire.
 *
 * A row is only rendered when its Status cell says it is published. A Google
 * Form is open to anyone holding the link, so without that gate a leaked form
 * URL would let anyone publish under the Secretariat's name. Submissions arrive
 * as proposals; a person decides what goes live.
 *
 * Configuration (see DEPLOYMENT.md):
 *   NEWS_SHEET_ID           required to enable the live feed
 *   GOOGLE_SHEETS_API_KEY   optional; falls back to GOOGLE_CALENDAR_API_KEY
 *   NEWS_SHEET_RANGE        optional; defaults to the first tab, columns A:Z
 *
 * When unset or unreachable, `fetchNewsRows` returns null and the caller falls
 * back to the static array in `data/news.ts`, so the site always builds.
 */

export const NEWS_REVALIDATE_SECONDS = 3600;

/** Cache tag, so a new post can be pushed live on demand via `revalidateTag`. */
export const NEWS_TAG = 'region-c-news';

/** Status cell values that mean "show this on the site", compared lowercased. */
const PUBLISHED_VALUES = new Set(['published', 'publish', 'approved', 'live', 'yes', 'true']);

const CATEGORIES: readonly NewsCategory[] = [
  'Region News',
  'Parish News',
  'Diocese',
  'Evangelism',
  'Youth',
  'Events',
];

/**
 * Column aliases.
 *
 * A Form writes each question's wording as the column header, so headers are
 * matched loosely — lowercased with non-alphanumerics stripped — rather than by
 * position. Renaming a question or reordering columns therefore does not break
 * the site, and only the words below need to survive.
 */
const FIELD_ALIASES: Record<string, readonly string[]> = {
  title: ['posttitle', 'title', 'headline'],
  category: ['category', 'newscategory'],
  author: ['byline', 'author', 'postedby', 'submittedby'],
  excerpt: ['summary', 'excerpt', 'shortdescription', 'standfirst'],
  content: ['body', 'content', 'postbody', 'fullstory', 'article', 'bodytext'],
  date: ['publicationdate', 'publishdate', 'postdate', 'date'],
  image: ['imageurl', 'image', 'photourl', 'photo', 'picture'],
  status: ['status', 'publishstatus', 'publicationstatus'],
  timestamp: ['timestamp'],
};

interface SheetValuesResponse {
  values?: string[][];
}

const normaliseHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

/* ------------------------------------------------------------- Fetching --- */

export async function fetchNewsRows(): Promise<NewsArticle[] | null> {
  const sheetId = process.env.NEWS_SHEET_ID?.trim();
  const apiKey = (
    process.env.GOOGLE_SHEETS_API_KEY ?? process.env.GOOGLE_CALENDAR_API_KEY
  )?.trim();

  if (!sheetId || !apiKey) return null;

  const range = process.env.NEWS_SHEET_RANGE?.trim() || 'A:Z';
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(range)}`,
  );
  url.searchParams.set('key', apiKey);
  // Dates and numbers as the sheet displays them, not as serial numbers.
  url.searchParams.set('valueRenderOption', 'FORMATTED_VALUE');

  try {
    const response = await fetch(url, {
      next: { revalidate: NEWS_REVALIDATE_SECONDS, tags: [NEWS_TAG] },
    });

    if (!response.ok) {
      console.error(
        `[news] Google Sheets returned ${response.status} ${response.statusText}; using fallback news.`,
      );
      return null;
    }

    const payload = (await response.json()) as SheetValuesResponse;
    const rows = payload.values ?? [];
    if (rows.length < 2) return [];

    const headers = rows[0].map(normaliseHeader);
    const indexOf = (field: keyof typeof FIELD_ALIASES) => {
      for (const alias of FIELD_ALIASES[field]) {
        const i = headers.indexOf(alias);
        if (i !== -1) return i;
      }
      return -1;
    };

    const columns = {
      title: indexOf('title'),
      category: indexOf('category'),
      author: indexOf('author'),
      excerpt: indexOf('excerpt'),
      content: indexOf('content'),
      date: indexOf('date'),
      image: indexOf('image'),
      status: indexOf('status'),
      timestamp: indexOf('timestamp'),
    };

    if (columns.title === -1) {
      console.error('[news] Sheet has no recognisable title column; using fallback news.');
      return null;
    }
    if (columns.status === -1) {
      // Refusing here is deliberate: without the gate every submission would be
      // published automatically, which is exactly what the gate exists to stop.
      console.error('[news] Sheet has no Status column; refusing to publish unmoderated rows.');
      return null;
    }

    const articles = rows
      .slice(1)
      .map((row, i) => toArticle(row, columns, i))
      .filter((article): article is NewsArticle => article !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return withUniqueSlugs(articles);
  } catch (error) {
    console.error('[news] Could not reach Google Sheets; using fallback news.', error);
    return null;
  }
}

/* -------------------------------------------------------------- Mapping --- */

type Columns = Record<string, number>;

function toArticle(row: string[], columns: Columns, rowIndex: number): NewsArticle | null {
  const cell = (key: string) => {
    const i = columns[key];
    return i === -1 || i === undefined ? '' : (row[i] ?? '').trim();
  };

  if (!PUBLISHED_VALUES.has(cell('status').toLowerCase())) return null;

  const title = cell('title');
  if (!title) return null;

  const content = splitParagraphs(cell('content'));
  const excerpt = cell('excerpt') || deriveExcerpt(content);
  const date = parseDate(cell('date')) ?? parseDate(cell('timestamp')) ?? todayIso();

  return {
    // Row position is not stable if rows are deleted, so the id is built from
    // the slug, which is derived from the title and disambiguated below.
    id: `sheet-${slugify(title)}-${rowIndex}`,
    title,
    slug: slugify(title),
    date,
    author: cell('author') || 'Region C Secretariat',
    ...(validImageUrl(cell('image')) ? { image: cell('image') } : {}),
    excerpt,
    content: content.length > 0 ? content : [excerpt].filter(Boolean),
    category: parseCategory(cell('category')),
  };
}

/** Blank lines separate paragraphs, as they do when typed into a form field. */
function splitParagraphs(body: string): string[] {
  return body
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}

function deriveExcerpt(content: string[]): string {
  const first = content[0] ?? '';
  if (first.length <= 200) return first;
  const cut = first.slice(0, 200);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 120 ? lastSpace : 200).trimEnd()}…`;
}

/** Unrecognised categories fall back rather than widening the union. */
function parseCategory(value: string): NewsCategory {
  return CATEGORIES.find((c) => c.toLowerCase() === value.toLowerCase()) ?? 'Region News';
}

/**
 * Accepts `2026-09-23`, and the `23/09/2026` or `9/23/2026` a Sheet may display
 * depending on its locale. Ambiguous day/month pairs are read as US order,
 * matching the sheet's own locale.
 */
function parseDate(value: string): string | null {
  if (!value) return null;

  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const slash = /^(\d{1,2})[/](\d{1,2})[/](\d{4})/.exec(value);
  if (slash) {
    const [, a, b, year] = slash;
    const month = Number(a);
    const day = Number(b);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

const todayIso = () => new Date().toISOString().slice(0, 10);

/** Only absolute http(s) URLs; anything else is dropped rather than rendered. */
function validImageUrl(value: string): boolean {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/* ----------------------------------------------------------------- Slug --- */

function slugify(value: string): string {
  return (
    value
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
      .replace(/-+$/, '') || 'post'
  );
}

/** Two posts may share a headline across years; the later one takes a suffix. */
function withUniqueSlugs(list: NewsArticle[]): NewsArticle[] {
  const taken = new Set<string>();

  return list.map((article) => {
    if (!taken.has(article.slug)) {
      taken.add(article.slug);
      return { ...article, id: `sheet-${article.slug}` };
    }

    const year = article.date.slice(0, 4);
    let candidate = `${article.slug}-${year}`;
    let suffix = 2;
    while (taken.has(candidate)) {
      candidate = `${article.slug}-${year}-${suffix}`;
      suffix += 1;
    }

    taken.add(candidate);
    return { ...article, slug: candidate, id: `sheet-${candidate}` };
  });
}
