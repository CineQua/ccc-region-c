import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import {
  Badge,
  Breadcrumbs,
  Card,
  JsonLd,
  PageHeader,
  PlaceholderNotice,
  SectionHeading,
} from '@/components/ui/primitives';
import { EventCard } from '@/components/events/event-card';
import { IconArrowRight, IconCalendar, IconExternal, IconMapPin } from '@/components/ui/icons';
import { buildMetadata } from '@/lib/metadata';
import { absoluteUrl } from '@/config/site';
import { getAllEvents, getEventBySlug, getUpcomingEvents } from '@/data/events';
import { stateName } from '@/data/states';
import { eventDateTime, formatEventDate } from '@/lib/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getAllEvents()).map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return buildMetadata({
      title: 'Event not found',
      description: 'This event could not be found on the Region C calendar.',
      path: `/events/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: event.title,
    description: event.description,
    path: `/events/${event.slug}`,
    type: 'article',
    noIndex: event.isPlaceholder,
  });
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const others = (await getUpcomingEvents())
    .filter((item) => item.id !== event.id)
    .slice(0, 3);

  return (
    <>
      <PageHeader eyebrow={event.category ?? 'Region C event'} title={event.title}>
        <div className="flex flex-col gap-3 text-celestial-100 sm:flex-row sm:flex-wrap sm:gap-6">
          <p className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5 shrink-0 text-gold-300" aria-hidden="true" />
            <time dateTime={eventDateTime(event.startDate)}>{formatEventDate(event)}</time>
          </p>
          <p className="flex items-center gap-2">
            <IconMapPin className="h-5 w-5 shrink-0 text-gold-300" aria-hidden="true" />
            {event.location}
            {event.state ? ` · ${stateName(event.state)}` : ''}
          </p>
        </div>
      </PageHeader>

      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: event.title, path: `/events/${event.slug}` },
        ]}
      />

      <section className="bg-white py-12 sm:py-14">
        <Container width="wide">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              {event.isPlaceholder ? (
                <PlaceholderNotice className="mb-6">
                  This is a sample calendar entry included with the initial build. The date, venue
                  and details shown are not confirmed.
                </PlaceholderNotice>
              ) : null}

              <div className="prose-region">
                <p>{event.description}</p>
              </div>

              {event.registrationUrl ? (
                <div className="mt-8">
                  <ButtonLink href={event.registrationUrl} external size="lg">
                    Register for this event
                    <IconExternal className="h-4 w-4" />
                  </ButtonLink>
                </div>
              ) : null}
            </div>

            <aside className="space-y-4">
              <Card className="p-6">
                <h2 className="text-base font-semibold text-celestial-900">Event details</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-celestial-500">Date</dt>
                    <dd className="mt-1 text-celestial-900">
                      <time dateTime={eventDateTime(event.startDate)}>{formatEventDate(event)}</time>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-celestial-500">Location</dt>
                    <dd className="mt-1 text-celestial-900">{event.location}</dd>
                  </div>
                  {event.state ? (
                    <div>
                      <dt className="text-celestial-500">State</dt>
                      <dd className="mt-1 text-celestial-900">{stateName(event.state)}</dd>
                    </div>
                  ) : null}
                  {event.parish ? (
                    <div>
                      <dt className="text-celestial-500">Host parish</dt>
                      <dd className="mt-1 text-celestial-900">{event.parish}</dd>
                    </div>
                  ) : null}
                  {event.category ? (
                    <div>
                      <dt className="text-celestial-500">Category</dt>
                      <dd className="mt-1">
                        <Badge>{event.category}</Badge>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </Card>

              <Card className="p-6">
                <h2 className="text-base font-semibold text-celestial-900">Regional calendar</h2>
                <p className="mt-2 text-sm leading-relaxed text-celestial-600">
                  See every regional programme scheduled for Region C.
                </p>
                <ButtonLink href="/events/calendar" variant="secondary" className="mt-4 w-full">
                  View the calendar
                  <IconArrowRight className="h-4 w-4" />
                </ButtonLink>
              </Card>
            </aside>
          </div>
        </Container>
      </section>

      {others.length > 0 ? (
        <section className="border-t border-celestial-100 bg-celestial-50/50 py-12 sm:py-14">
          <Container width="wide">
            <SectionHeading eyebrow="Also coming up" title="Other regional events" as="h2" />
            <ul className="grid gap-4 lg:grid-cols-3">
              {others.map((item) => (
                <li key={item.id}>
                  <EventCard event={item} variant="compact" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Event structured data, emitted only for confirmed events. */}
      {!event.isPlaceholder ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.title,
            description: event.description,
            startDate: eventDateTime(event.startDate),
            ...(event.endDate ? { endDate: eventDateTime(event.endDate) } : {}),
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: { '@type': 'Place', name: event.location },
            url: absoluteUrl(`/events/${event.slug}`),
            organizer: {
              '@type': 'Organization',
              name: 'Celestial Church of Christ USA Diocese — Region C',
              url: absoluteUrl('/'),
            },
          }}
        />
      ) : null}
    </>
  );
}
