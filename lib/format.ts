import type { RegionEvent } from './types';

/**
 * Date formatting helpers.
 *
 * All formatting is pinned to UTC. Dates in the content layer are calendar dates
 * (`2026-10-17`), not instants: rendering them in the viewer's local zone would
 * shift an event a day backwards for anyone west of Greenwich, and would produce
 * a server/client hydration mismatch. Pinning to UTC keeps the rendered string
 * identical everywhere.
 */

const DATE_STYLE: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const SHORT_DATE_STYLE: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const TIME_STYLE: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
  hour: 'numeric',
  minute: '2-digit',
};

/** e.g. "17 October 2026" rendered US-style: "October 17, 2026". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', DATE_STYLE).format(new Date(iso));
}

/** e.g. "Oct 17, 2026". */
export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', SHORT_DATE_STYLE).format(new Date(iso));
}

/** Machine-readable value for a `<time dateTime>` attribute. */
export function isoDate(iso: string): string {
  return new Date(iso).toISOString();
}

/**
 * Machine-readable value for an event date, for `<time dateTime>` and for
 * schema.org structured data.
 *
 * Event times in the content layer are WALL CLOCK times carrying a `Z` suffix,
 * because every formatter here renders in UTC (see the note at the top of this
 * file). Emitting that `Z` verbatim would assert the wrong instant: a harvest at
 * 10:00 Pacific would be published to search engines as 10:00 UTC — 03:00 local.
 *
 * Dropping the suffix yields a local date-time, which schema.org and HTML both
 * read as the local time of the event venue. That is exactly what it is.
 */
export function eventDateTime(iso: string): string {
  return iso.includes('T') ? iso.replace(/(\.\d+)?Z$/, '') : iso;
}

/** Calendar parts used by the compact date block on event cards. */
export function dateParts(iso: string): { day: string; month: string; year: string } {
  const date = new Date(iso);
  return {
    day: new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', day: 'numeric' }).format(date),
    month: new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short' }).format(date),
    year: new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric' }).format(date),
  };
}

/**
 * Human-readable range for an event, collapsing redundant parts:
 * single day  -> "October 17, 2026"
 * same month  -> "October 17–18, 2026"
 * otherwise   -> "October 31 – November 2, 2026"
 * A timed event appends the start time.
 */
export function formatEventDate(event: RegionEvent): string {
  const start = new Date(event.startDate);
  const startLabel = formatDate(event.startDate);
  const timed = !event.allDay && event.startDate.includes('T');

  if (!event.endDate || event.endDate === event.startDate) {
    return timed ? `${startLabel} · ${formatTime(start)}` : startLabel;
  }

  const end = new Date(event.endDate);

  // A timed event that starts and finishes on one day is not a date range: it
  // would otherwise read "September 27–27, 2026" and lose its hours entirely.
  if (isSameUtcDay(start, end)) {
    return timed ? `${startLabel} · ${formatTime(start)} – ${formatTime(end)}` : startLabel;
  }
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();

  if (sameMonth) {
    const month = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long' }).format(start);
    return `${month} ${start.getUTCDate()}–${end.getUTCDate()}, ${start.getUTCFullYear()}`;
  }

  return sameYear
    ? `${stripYear(startLabel)} – ${formatDate(event.endDate)}`
    : `${startLabel} – ${formatDate(event.endDate)}`;
}

function stripYear(label: string): string {
  return label.replace(/,\s*\d{4}$/, '');
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', TIME_STYLE).format(date);
}

function isSameUtcDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

/** Join names as US-English prose: `formatList(['A', 'B', 'C'])` -> "A, B, and C". */
export function formatList(items: string[]): string {
  return new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' }).format(items);
}

/** Pluralise a count for short stat labels: `pluralise(1, 'Parish', 'Parishes')`. */
export function pluralise(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
