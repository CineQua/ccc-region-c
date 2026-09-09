import type { RegionEvent } from '@/lib/types';

/**
 * Region C events.
 *
 * SAMPLE CONTENT: the entries below illustrate the event system and are flagged
 * with `isPlaceholder: true`. Dates, venues and registration links are not real
 * and must be replaced with the ratified Region C calendar.
 *
 * Calendar integration path: `getUpcomingEvents()` is the only accessor the UI
 * calls, so a future Google Calendar or CMS source can replace the static array
 * without touching a single component.
 */
export const events: RegionEvent[] = [
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

/** True while the calendar contains only sample records. Drives the UI notice. */
export const eventsAreSample: boolean =
  events.length > 0 && events.every((event) => event.isPlaceholder);

/**
 * Events that have not yet finished, soonest first.
 * `reference` is injectable so pages and tests are not tied to the wall clock.
 */
export function getUpcomingEvents(limit?: number, reference: Date = new Date()): RegionEvent[] {
  const cutoff = reference.getTime();
  const upcoming = events
    .filter((event) => endOf(event).getTime() >= cutoff)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return typeof limit === 'number' ? upcoming.slice(0, limit) : upcoming;
}

export function getPastEvents(reference: Date = new Date()): RegionEvent[] {
  const cutoff = reference.getTime();
  return events
    .filter((event) => endOf(event).getTime() < cutoff)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export function getEventBySlug(slug: string): RegionEvent | undefined {
  return events.find((event) => event.slug === slug);
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
