import type { EventCategory, RegionEvent } from './types';

/**
 * Google Calendar source for the regional events calendar.
 *
 * The site reads a PUBLIC calendar with an API key rather than authenticating as
 * the Region C account. There is no OAuth token to expire, no refresh flow and
 * no credential tied to one person's password — the key is a read-only public
 * identifier, restricted to the Calendar API in the Google Cloud console.
 *
 * Configuration (see DEPLOYMENT.md):
 *   GOOGLE_CALENDAR_API_KEY  required to enable the live feed
 *   GOOGLE_CALENDAR_ID       optional; defaults to the Region C Events calendar
 *
 * When the key is absent — local development, or a fork — `fetchCalendarEvents`
 * returns null and the caller falls back to the static array in `data/events.ts`.
 * The site therefore always builds, and never renders an empty calendar because
 * a network call failed.
 */

/** The public "Region C Events" calendar. Not a secret: it is world-readable. */
const DEFAULT_CALENDAR_ID =
  '60becd2819b15c1e8bf6c3d27eadc661c41232f3c6545555609306cba39331c1@group.calendar.google.com';

/** How long a cached calendar response is served before it is refreshed. */
export const CALENDAR_REVALIDATE_SECONDS = 3600;

/** Cache tag, so an edit can be pushed live on demand via `revalidateTag`. */
export const CALENDAR_TAG = 'region-c-calendar';

/** Events starting more than this far in the past are not fetched. */
const HISTORY_WINDOW_MONTHS = 18;

/**
 * How far ahead to look.
 *
 * This bound is essential, not a tidiness measure. `singleEvents=true` expands a
 * recurring event into individual occurrences, and Google projects a yearly rule
 * roughly THIRTY YEARS into the future — the seven parish Harvests alone return
 * 210 occurrences running to 2056. Unbounded, the events page would list every
 * one of them, the build would prerender a page each, and the calendar view
 * would run year by year to 2056.
 */
const FUTURE_WINDOW_MONTHS = 24;

/* -------------------------------------------------- Google API payloads --- */

interface GoogleDate {
  /** Set on an all-day event: a calendar date, `2026-10-17`. */
  date?: string;
  /** Set on a timed event: an RFC-3339 instant with an offset. */
  dateTime?: string;
  /** IANA zone, e.g. `America/Los_Angeles`. */
  timeZone?: string;
}

interface GoogleEvent {
  id?: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: GoogleDate;
  end?: GoogleDate;
}

interface GoogleEventsResponse {
  items?: GoogleEvent[];
  nextPageToken?: string;
  /** The calendar's default zone, used when an event does not carry its own. */
  timeZone?: string;
}

/* ------------------------------------------------------------- Fetching --- */

/**
 * Reads upcoming and recent events from the public calendar.
 *
 * Returns null when the feed is not configured or the request fails, which the
 * caller treats as "use the static fallback" rather than "there are no events".
 * An empty array is meaningful and distinct: the calendar is live but bare.
 */
export async function fetchCalendarEvents(): Promise<RegionEvent[] | null> {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY?.trim();
  if (!apiKey) return null;

  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || DEFAULT_CALENDAR_ID;

  const timeMin = new Date();
  timeMin.setUTCMonth(timeMin.getUTCMonth() - HISTORY_WINDOW_MONTHS);

  const timeMax = new Date();
  timeMax.setUTCMonth(timeMax.getUTCMonth() + FUTURE_WINDOW_MONTHS);

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
  );
  url.searchParams.set('key', apiKey);
  // Expands recurring events into individual occurrences server-side, so no
  // RRULE handling is needed here.
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('timeMin', timeMin.toISOString());
  url.searchParams.set('timeMax', timeMax.toISOString());
  url.searchParams.set('maxResults', '250');

  try {
    const response = await fetch(url, {
      next: { revalidate: CALENDAR_REVALIDATE_SECONDS, tags: [CALENDAR_TAG] },
    });

    if (!response.ok) {
      console.error(
        `[calendar] Google Calendar returned ${response.status} ${response.statusText}; using fallback events.`,
      );
      return null;
    }

    const payload = (await response.json()) as GoogleEventsResponse;
    const items = payload.items ?? [];

    // Only reachable if the bounded window somehow holds 250+ occurrences.
    // Logged rather than paged: silently dropping events would be worse.
    if (payload.nextPageToken) {
      console.warn(
        `[calendar] More than ${items.length} events in the window; later ones are not shown. Add paging if this is genuine.`,
      );
    }

    const mapped = items
      .filter((item) => item.status !== 'cancelled')
      .map((item) => toRegionEvent(item, payload.timeZone))
      .filter((event): event is RegionEvent => event !== null);

    return withUniqueSlugs(mapped);
  } catch (error) {
    console.error('[calendar] Could not reach Google Calendar; using fallback events.', error);
    return null;
  }
}

/* -------------------------------------------------------------- Mapping --- */

/** Converts one Google event, or null when it carries no title or start. */
function toRegionEvent(item: GoogleEvent, calendarTimeZone?: string): RegionEvent | null {
  const title = item.summary?.trim();
  if (!title || !item.start) return null;

  const allDay = Boolean(item.start.date);
  const startDate = allDay
    ? item.start.date!
    : toWallClockIso(item.start.dateTime, item.start.timeZone ?? calendarTimeZone);

  if (!startDate) return null;

  const endDate = resolveEnd(item, allDay, calendarTimeZone, startDate);
  const { description, category, registrationUrl, parish, state } = parseDescription(
    item.description,
  );

  return {
    // Google ids are stable across edits, so a React key never churns.
    id: item.id ? `gcal-${item.id}` : `gcal-${slugify(title)}-${startDate}`,
    title,
    slug: slugify(title),
    startDate,
    ...(endDate && endDate !== startDate ? { endDate } : {}),
    ...(allDay ? { allDay: true } : {}),
    location: item.location?.trim() || 'Venue to be confirmed',
    ...(parish ? { parish } : {}),
    ...(state ? { state } : {}),
    description: description || 'A Region C gathering. Details to be confirmed.',
    ...(registrationUrl ? { registrationUrl } : {}),
    ...(category ? { category } : {}),
  };
}

/**
 * The event's final day, inclusive.
 *
 * Google reports an all-day event's `end.date` EXCLUSIVELY — a single-day event
 * on the 17th ends on the 18th. This codebase treats `endDate` as the last day
 * of the event (see `endOf` in data/events.ts), so the exclusive bound is pulled
 * back by one day. Without this every multi-day event runs a day long and a
 * finished event lingers in "upcoming" for an extra day.
 */
function resolveEnd(
  item: GoogleEvent,
  allDay: boolean,
  calendarTimeZone: string | undefined,
  startDate: string,
): string | undefined {
  if (!item.end) return undefined;

  if (allDay) {
    if (!item.end.date) return undefined;
    const exclusive = new Date(`${item.end.date}T00:00:00Z`);
    if (Number.isNaN(exclusive.getTime())) return undefined;
    exclusive.setUTCDate(exclusive.getUTCDate() - 1);
    const inclusive = exclusive.toISOString().slice(0, 10);
    // Guard against a malformed range that would end before it starts.
    return inclusive < startDate ? undefined : inclusive;
  }

  return toWallClockIso(item.end.dateTime, item.end.timeZone ?? calendarTimeZone) ?? undefined;
}

/**
 * Re-expresses an instant as its wall-clock time in `timeZone`, labelled `Z`.
 *
 * `lib/format.ts` renders every date with `timeZone: 'UTC'` on purpose, so that
 * a calendar date is not shifted a day by the viewer's own zone. A timed Google
 * event is a true instant (`2026-10-17T18:00:00-07:00`), and formatting that in
 * UTC would print 01:00 the following day. Converting to the calendar's local
 * wall clock and then labelling it `Z` makes the existing UTC-pinned formatters
 * print the time the organiser actually entered.
 */
function toWallClockIso(dateTime?: string, timeZone?: string): string | null {
  if (!dateTime) return null;

  const instant = new Date(dateTime);
  if (Number.isNaN(instant.getTime())) return null;

  if (!timeZone) return instant.toISOString();

  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(instant);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value;

    const year = get('year');
    const month = get('month');
    const day = get('day');
    const hour = get('hour');
    const minute = get('minute');
    const second = get('second');

    if (!year || !month || !day || !hour || !minute || !second) return instant.toISOString();

    return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
  } catch {
    // An unrecognised zone should not lose the event.
    return instant.toISOString();
  }
}

/* ---------------------------------------------------------- Description --- */

const CATEGORIES: readonly EventCategory[] = [
  'Regional',
  'Evangelism',
  'Youth',
  'Women',
  'Choir & Music',
  'Convention',
  'Training',
  'Harvest',
];

interface ParsedDescription {
  description: string;
  category?: EventCategory;
  registrationUrl?: string;
  parish?: string;
  state?: string;
}

/**
 * Pulls structured fields out of the event description.
 *
 * Google Calendar has no custom fields, so an administrator adds labelled lines
 * to the description and they are lifted out here. Everything unlabelled stays
 * as the visible prose. Labels are case-insensitive:
 *
 *   Category: Youth
 *   Register: https://example.org/tickets
 *   Parish: Bethel Parish
 *   State: CA
 */
function parseDescription(raw?: string): ParsedDescription {
  if (!raw) return { description: '' };

  const text = stripHtml(raw);
  const prose: string[] = [];
  const result: ParsedDescription = { description: '' };

  for (const line of text.split('\n')) {
    const match = /^\s*(category|register|registration|parish|state)\s*:\s*(.+?)\s*$/i.exec(line);

    if (!match) {
      prose.push(line);
      continue;
    }

    const label = match[1].toLowerCase();
    const value = match[2].trim();

    if (label === 'category') {
      // An unrecognised category is dropped rather than widening the union.
      result.category = CATEGORIES.find((entry) => entry.toLowerCase() === value.toLowerCase());
    } else if (label === 'register' || label === 'registration') {
      if (/^https?:\/\//i.test(value)) result.registrationUrl = value;
    } else if (label === 'parish') {
      result.parish = value;
    } else if (label === 'state') {
      if (/^[A-Za-z]{2}$/.test(value)) result.state = value.toUpperCase();
    }
  }

  result.description = prose.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return result;
}

/** Google descriptions may carry light HTML; the UI renders plain text. */
function stripHtml(input: string): string {
  return input
    .replace(/\r\n/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
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
      .replace(/-+$/, '') || 'event'
  );
}

/**
 * Disambiguates events that slugify identically.
 *
 * An annual programme keeps the same title every year, so the first occurrence
 * holds the bare slug and later ones are suffixed with their year — and then an
 * index, should a title repeat twice within one year.
 */
function withUniqueSlugs(list: RegionEvent[]): RegionEvent[] {
  const taken = new Set<string>();

  return list.map((event) => {
    if (!taken.has(event.slug)) {
      taken.add(event.slug);
      return event;
    }

    const year = event.startDate.slice(0, 4);
    let candidate = `${event.slug}-${year}`;
    let suffix = 2;
    while (taken.has(candidate)) {
      candidate = `${event.slug}-${year}-${suffix}`;
      suffix += 1;
    }

    taken.add(candidate);
    return { ...event, slug: candidate };
  });
}
