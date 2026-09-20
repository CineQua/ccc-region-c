import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import {
  Breadcrumbs,
  Card,
  PageHeader,
  SectionHeading,
} from '@/components/ui/primitives';
import { LeaderCard } from '@/components/leadership/leader-card';
import { EventCard } from '@/components/events/event-card';
import { IconArrowRight, ministryIcons } from '@/components/ui/icons';
import { buildMetadata } from '@/lib/metadata';
import { getMinistryBySlug, ministries, orderedMinistries } from '@/data/ministries';
import { getLeaderById } from '@/data/leadership';
import { getUpcomingEvents } from '@/data/events';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ministries.map((ministry) => ({ slug: ministry.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const ministry = getMinistryBySlug(slug);

  if (!ministry) {
    return buildMetadata({
      title: 'Ministry not found',
      description: 'This ministry could not be found.',
      path: `/ministries/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${ministry.name} Ministry`,
    description: ministry.summary,
    path: `/ministries/${ministry.slug}`,
  });
}

/** Ministry name → the event category its programmes are filed under. */
const eventCategoryForMinistry: Record<string, string> = {
  evangelism: 'Evangelism',
  women: 'Women',
  youth: 'Youth',
  'choir-and-music': 'Choir & Music',
};

export default async function MinistryPage({ params }: PageProps) {
  const { slug } = await params;
  const ministry = getMinistryBySlug(slug);

  if (!ministry) notFound();

  const Icon = ministryIcons[ministry.icon];
  const officers = ministry.leaderIds
    .map((id) => getLeaderById(id))
    .filter((leader) => leader !== undefined);

  const category = eventCategoryForMinistry[ministry.slug];
  const relatedEvents = category
    ? (await getUpcomingEvents()).filter((event) => event.category === category)
    : [];

  const otherMinistries = orderedMinistries.filter((item) => item.id !== ministry.id);

  return (
    <>
      <PageHeader eyebrow="Ministries" title={ministry.name} description={ministry.summary} />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Ministries', path: '/ministries' },
          { name: ministry.name, path: `/ministries/${ministry.slug}` },
        ]}
      />

      <section className="bg-white py-12 sm:py-14">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div>
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-md bg-celestial-800 text-gold-300"
              >
                <Icon className="h-6 w-6" />
              </span>

              <div className="prose-region mt-6">
                {ministry.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <h2 className="rule-gold mt-10 text-xl text-celestial-900">Areas of focus</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {ministry.focusAreas.map((focus) => (
                  <li
                    key={focus}
                    className="flex items-start gap-2.5 rounded-md border border-celestial-100 bg-celestial-50/50 px-4 py-3 text-sm text-celestial-800"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                    />
                    {focus}
                  </li>
                ))}
              </ul>
            </div>

            <aside>
              <Card className="p-6">
                <h2 className="text-base font-semibold text-celestial-900">Departmental contact</h2>
                <p className="mt-2 text-sm leading-relaxed text-celestial-600">
                  Enquiries about the {ministry.name} department may be directed through the Region C
                  Secretariat.
                </p>
                <ButtonLink href="/contact" variant="secondary" className="mt-4 w-full">
                  Contact Region C
                  <IconArrowRight className="h-4 w-4" />
                </ButtonLink>
              </Card>

              <Card className="mt-4 p-6">
                <h2 className="text-base font-semibold text-celestial-900">Other ministries</h2>
                <ul className="mt-3 space-y-1.5">
                  {otherMinistries.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/ministries/${item.slug}`}
                        className="flex min-h-10 items-center justify-between gap-2 text-sm text-celestial-700 underline-offset-4 hover:text-celestial-900 hover:underline"
                      >
                        {item.name}
                        <IconArrowRight className="h-4 w-4 text-celestial-400" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            </aside>
          </div>
        </Container>
      </section>

      {officers.length > 0 ? (
        <section className="border-t border-celestial-100 bg-celestial-50/50 py-12 sm:py-14">
          <Container width="wide">
            <SectionHeading
              eyebrow="Oversight"
              title={`${ministry.name} leadership`}
              description="Members of the Region C Executive carrying this portfolio."
              as="h2"
              action={
                <ButtonLink href="/leadership" variant="secondary">
                  Full executive
                  <IconArrowRight className="h-4 w-4" />
                </ButtonLink>
              }
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {officers.map((leader) => (
                <li key={leader.id}>
                  <LeaderCard leader={leader} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {relatedEvents.length > 0 ? (
        <section className="border-t border-celestial-100 bg-white py-12 sm:py-14">
          <Container width="wide">
            <SectionHeading
              eyebrow="Calendar"
              title={`${ministry.name} programmes`}
              as="h2"
              action={
                <ButtonLink href="/events" variant="secondary">
                  All events
                  <IconArrowRight className="h-4 w-4" />
                </ButtonLink>
              }
            />
            <ul className="grid gap-4 lg:grid-cols-3">
              {relatedEvents.map((event) => (
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
