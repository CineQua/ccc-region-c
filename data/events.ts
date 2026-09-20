import { cache } from 'react';
import type { RegionEvent } from '@/lib/types';
import { fetchCalendarEvents } from '@/lib/calendar';

/**
 * Region C events.
 *
 * The live source is the public "Region C Events" Google Calendar, read through
 * `lib/calendar.ts`. The array below is the FALLBACK, used when the calendar is
 * not configured (no `GOOGLE_CALENDAR_API_KEY`) or unreachable at build time, so
 * the site never renders an empty events page because of a network failure.
 *
 * SAMPLE CONTENT: the entries below illustrate the event system and are flagged
 * with `isPlaceholder: true`. Dates, venues and registration links are not real.
 * Once the calendar is live these are no longer rendered.
 *
 * Every accessor here is async: they await the calendar. `groupEventsByYear` is
 * pure and stays synchronous.
 */
export const fallbackEvents: RegionEvent[] = [
  {
    id: 'evt-regional-workers-retreat',
    title: 'Region C Workers Retreat',
    slug: 'region-c-workers-retreat',
    startDate: '2026-10-17',
    endDate: '2026-10-18',
    allDay: true,
    location: 'Venue to be confirmed',
    state: 'CA',
    category: 'Training',
    description:
      'A two-day gathering for shepherds, parish administrators and departmental workers across Region C, focused on spiritual renewal and practical parish administration.',
    isPlaceholder: true,
  },
  {
    id: 'evt-regional-evangelism-outreach',
    title: 'Regional Evangelism Outreach',
    slug: 'regional-evangelism-outreach',
    startDate: '2026-11-14',
    allDay: true,
    location: 'Venue to be confirmed',
    category: 'Evangelism',
    description:
      'A coordinated Region C outreach mobilising parishes across the region under the direction of the Evangelism Department.',
    isPlaceholder: true,
  },
  {
    id: 'evt-youth-convocation',
    title: 'Region C Youth Convocation',
    slug: 'region-c-youth-convocation',
    startDate: '2027-01-16',
    allDay: true,
    location: 'Venue to be confirmed',
    category: 'Youth',
    description:
      'A regional gathering for Celestial Church of Christ youth, hosted by the Region C Youth Department.',
    isPlaceholder: true,
  },
  {
    id: 'evt-women-council-conference',
    title: 'Women Council Regional Conference',
    slug: 'women-council-regional-conference',
    startDate: '2027-03-13',
    allDay: true,
    location: 'Venue to be confirmed',
    category: 'Women',
    description:
      'The annual conference of the Region C Women Council, convened by the Women Council President.',
    isPlaceholder: true,
  },
  {
    id: 'evt-regional-choir-festival',
    title: 'Regional Choir Festival',
    slug: 'regional-choir-festival',
    startDate: '2027-05-15',
    allDay: true,
    location: 'Venue to be confirmed',
    category: 'Choir & Music',
    description:
      'Parish choirs from across Region C gather under the Regional Choirmaster for a festival of praise and worship.',
    isPlaceholder: true,
  },
];

/**
 * Every known event, live calendar first.
 *
 * Wrapped in React's `cache` so the calendar is read once per render pass no
 * matter how many components ask — the home page alone asks twice.
 */
export const getAllEvents = cache(async (): Promise<RegionEvent[]> => {
  const live = await fetchCalendarEvents();
  return live ?? fallbackEvents;
});

/**
 * True while the events shown are sample records, which drives the UI notice.
 * A live calendar is never "sample", even when it is empty.
 */
export async function eventsAreSample(): Promise<boolean> {
  const list = await getAllEvents();
  return list.length > 0 && list.every((event) => event.isPlaceholder);
}

/**
 * Events that have not yet finished, soonest first.
 * `reference` is injectable so pages and tests are not tied to the wall clock.
 */
export async function getUpcomingEvents(
  limit?: number,
  reference: Date = new Date(),
): Promise<RegionEvent[]> {
  const cutoff = reference.getTime();
  const upcoming = (await getAllEvents())
    .filter((event) => endOf(event).getTime() >= cutoff)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return typeof limit === 'number' ? upcoming.slice(0, limit) : upcoming;
}

export async function getPastEvents(reference: Date = new Date()): Promise<RegionEvent[]> {
  const cutoff = reference.getTime();
  return (await getAllEvents())
    .filter((event) => endOf(event).getTime() < cutoff)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export async function getEventBySlug(slug: string): Promise<RegionEvent | undefined> {
  return (await getAllEvents()).find((event) => event.slug === slug);
}

/** Group events by calendar year, earliest year first — used by the calendar view. */
export function groupEventsByYear(list: RegionEvent[]): { year: number; events: RegionEvent[] }[] {
  const groups = new Map<number, RegionEvent[]>();
  for (const event of list) {
    const year = new Date(event.startDate).getUTCFullYear();
    groups.set(year, [...(groups.get(year) ?? []), event]);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, yearEvents]) => ({ year, events: yearEvents }));
}

/** End of an event, treating an all-day event as running to the end of its final day. */
function endOf(event: RegionEvent): Date {
  const raw = event.endDate ?? event.startDate;
  const end = new Date(raw);
  if (event.allDay || !raw.includes('T')) {
    end.setUTCHours(23, 59, 59, 999);
  }
  return end;
}
