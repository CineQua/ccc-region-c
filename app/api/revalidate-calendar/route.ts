import { createHash, timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { CALENDAR_TAG } from '@/lib/calendar';
import { NEWS_TAG } from '@/lib/news-sheet';
import { EXTERNAL_NEWS_TAG } from '@/lib/external-news';

/**
 * On-demand refresh of the Google-backed content: the events calendar and the
 * news sheet.
 *
 * Both are cached for an hour, so an edit normally appears within the hour.
 * Whoever maintains them can hit this endpoint to publish a change straight
 * away instead of waiting:
 *
 *   https://<site>/api/revalidate-calendar?secret=<CALENDAR_REVALIDATE_SECRET>
 *
 * It is safe to bookmark on a phone and safe to hit repeatedly: it discards the
 * cached Google responses and nothing else, and the next page view refetches.
 * `?only=calendar`, `?only=news` or `?only=external` narrows it to one.
 *
 * Configuration: set `CALENDAR_REVALIDATE_SECRET` to a long random string in the
 * hosting environment. Until it is set the endpoint refuses every request, so a
 * missing variable cannot leave an open refresh URL on the internet.
 *
 * NOT available under `output: 'export'`, which cannot serve a route that reads
 * its request. A static export has no revalidation at all — see DEPLOYMENT.md.
 */

// Reads the query string, so it must never be prerendered.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handle(request);
}

/** POST is accepted too, so this can later be driven by a webhook. */
export async function POST(request: Request) {
  return handle(request);
}

function handle(request: Request): Response {
  const expected = process.env.CALENDAR_REVALIDATE_SECRET?.trim();

  if (!expected) {
    return Response.json(
      {
        revalidated: false,
        error:
          'Refresh endpoint is not configured. Set CALENDAR_REVALIDATE_SECRET to enable it.',
      },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const supplied =
    url.searchParams.get('secret') ?? request.headers.get('x-calendar-secret') ?? '';

  if (!matches(supplied, expected)) {
    // Deliberately terse: a wrong secret learns nothing about the right one.
    return Response.json({ revalidated: false, error: 'Unauthorized.' }, { status: 401 });
  }

  // Discards the cached Google responses. `{ expire: 0 }` rather than the usual
  // "max" profile: the point of this endpoint is that the very next page view
  // shows the change, so that view should wait for the refetch instead of being
  // served the stale copy it was trying to get rid of.
  const only = url.searchParams.get('only')?.toLowerCase();
  const tags =
    only === 'calendar'
      ? [CALENDAR_TAG]
      : only === 'news'
        ? [NEWS_TAG]
        : only === 'external'
          ? [EXTERNAL_NEWS_TAG]
          : [CALENDAR_TAG, NEWS_TAG, EXTERNAL_NEWS_TAG];

  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return Response.json({
    revalidated: true,
    tags,
    at: new Date().toISOString(),
  });
}

/**
 * Constant-time comparison.
 *
 * Both values are hashed first so the buffers are always the same length:
 * `timingSafeEqual` throws on a length mismatch, and comparing lengths up front
 * would leak the secret's length.
 */
function matches(supplied: string, expected: string): boolean {
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(supplied), digest(expected));
}
