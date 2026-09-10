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

  if (!event.endDate || event.endDate === event.startDate) {
    return event.allDay || !event.startDate.includes('T')
      ? startLabel
      : `${startLabel} · ${new Intl.DateTimeFormat('en-US', TIME_STYLE).format(start)}`;
  }

  const end = new Date(event.endDate);
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

/** Join names as US-English prose: `formatList(['A', 'B', 'C'])` -> "A, B, and C". */
export function formatList(items: string[]): string {
  return new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' }).format(items);
}

/** Pluralise a count for short stat labels: `pluralise(1, 'Parish', 'Parishes')`. */
export function pluralise(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
