import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import {
  Breadcrumbs,
  Badge,
  EmptyState,
  PageHeader,
  PlaceholderNotice,
} from '@/components/ui/primitives';
import { IconArrowRight, IconMapPin } from '@/components/ui/icons';
import { buildMetadata } from '@/lib/metadata';
import { eventsAreSample, getUpcomingEvents, groupEventsByYear } from '@/data/events';
import { formatEventDate, isoDate } from '@/lib/format';
import { stateName } from '@/data/states';

export const metadata = buildMetadata({
  title: 'Regional Calendar',
  description:
    'The Region C calendar of regional programmes, conventions and departmental gatherings, listed by year.',
  path: '/events/calendar',
});

/**
 * Year-at-a-glance calendar.
 *
 * A dense chronological list rather than a month grid: the regional calendar
 * carries a handful of events per year, and a list reads better on a phone and
 * needs no JavaScript. A month grid can be added later as an alternative view.
 */
export default function CalendarPage() {
  const grouped = groupEventsByYear(getUpcomingEvents());

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Regional Calendar"
        description="Region C programmes listed chronologically. Individual parish calendars are held by each parish."
      >
        <ButtonLink href="/events" variant="onDark">
          Event cards
          <IconArrowRight className="h-4 w-4" />
        </ButtonLink>
      </PageHeader>

      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: 'Regional Calendar', path: '/events/calendar' },
        ]}
      />

      <section className="bg-white py-12 sm:py-14">
        <Container>
          {eventsAreSample && grouped.length > 0 ? (
            <PlaceholderNotice className="mb-8">
              This calendar contains sample entries only. The ratified Region C calendar will replace
              them.
            </PlaceholderNotice>
          ) : null}

          {grouped.length > 0 ? (
            <div className="space-y-12">
              {grouped.map((group) => (
                <section key={group.year} aria-labelledby={`year-${group.year}`}>
                  <h2
                    id={`year-${group.year}`}
                    className="rule-gold mb-6 font-serif text-3xl text-celestial-900"
                  >
                    {group.year}
                  </h2>
                  <ul className="divide-y divide-celestial-100 overflow-hidden rounded-lg border border-celestial-100">
                    {group.events.map((event) => (
                      <li key={event.id}>
                        <Link
                          href={`/events/${event.slug}`}
                          className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-celestial-50 sm:flex-row sm:items-center sm:gap-6"
                        >
                          <time
                            dateTime={isoDate(event.startDate)}
                            className="shrink-0 text-sm font-semibold text-celestial-700 sm:w-44"
                          >
                            {formatEventDate(event)}
                          </time>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-celestial-900">{event.title}</p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-celestial-600">
                              <IconMapPin className="h-3.5 w-3.5 shrink-0 text-celestial-400" aria-hidden="true" />
                              <span className="truncate">
                                {event.location}
                                {event.state ? ` · ${stateName(event.state)}` : ''}
                              </span>
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {event.category ? <Badge>{event.category}</Badge> : null}
                            <IconArrowRight className="hidden h-4 w-4 text-celestial-400 sm:block" aria-hidden="true" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <EmptyState
              title="The calendar is being finalised"
              description="Region C programmes will be published here once the calendar has been ratified."
            />
          )}

          <p className="mt-10 rounded-lg border border-celestial-100 bg-celestial-50/60 px-5 py-4 text-sm leading-relaxed text-celestial-600">
            Subscription to the Region C calendar from a phone or desktop calendar application is
            planned. Until then, dates published here are the reference for regional programmes.
          </p>
        </Container>
      </section>
    </>
  );
}
