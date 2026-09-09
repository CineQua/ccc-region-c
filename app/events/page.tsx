import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import {
  Breadcrumbs,
  EmptyState,
  PageHeader,
  PlaceholderNotice,
  SectionHeading,
} from '@/components/ui/primitives';
import { EventCard } from '@/components/events/event-card';
import { IconArrowRight, IconCalendar } from '@/components/ui/icons';
import { buildMetadata } from '@/lib/metadata';
import { eventsAreSample, getPastEvents, getUpcomingEvents } from '@/data/events';

export const metadata = buildMetadata({
  title: 'Events',
  description:
    'Upcoming regional programmes, conventions and departmental gatherings across Region C of the Celestial Church of Christ USA Diocese.',
  path: '/events',
});

export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents().slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Upcoming Events"
        description="Regional programmes, conventions and departmental gatherings across Region C."
      >
        <ButtonLink href="/events/calendar" variant="onDark">
          <IconCalendar className="h-4.5 w-4.5" />
          Regional calendar
        </ButtonLink>
      </PageHeader>

      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
        ]}
      />

      <section className="bg-white py-12 sm:py-14">
        <Container width="wide">
          {eventsAreSample && upcoming.length > 0 ? (
            <PlaceholderNotice className="mb-6">
              The events listed here demonstrate how the regional calendar will work. Dates, venues
              and details are not confirmed and will be replaced by the ratified Region C calendar.
            </PlaceholderNotice>
          ) : null}

          {upcoming.length > 0 ? (
            <ul className="grid gap-4 lg:grid-cols-2">
              {upcoming.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No events are currently scheduled"
              description="The Region C calendar is being finalised. Regional programmes will be published here once ratified by the Secretariat."
              action={
                <ButtonLink href="/news" variant="secondary">
                  Read regional announcements
                  <IconArrowRight className="h-4 w-4" />
                </ButtonLink>
              }
            />
          )}
        </Container>
      </section>

      {past.length > 0 ? (
        <section className="border-t border-celestial-100 bg-celestial-50/50 py-12 sm:py-14">
          <Container width="wide">
            <SectionHeading eyebrow="Archive" title="Past events" as="h2" />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} variant="compact" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
