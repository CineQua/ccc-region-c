import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import {
  Breadcrumbs,
  Card,
  EmptyState,
  PageHeader,
  PlaceholderNotice,
  SectionHeading,
} from '@/components/ui/primitives';
import { ParishCard } from '@/components/parish/parish-card';
import { EventCard } from '@/components/events/event-card';
import { IconArrowRight, IconMail } from '@/components/ui/icons';
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/config/site';
import { getStateBySlug, states } from '@/data/states';
import { getParishesByState, parishDirectoryIsSample } from '@/data/parishes';
import { getUpcomingEvents } from '@/data/events';
import { getLeaderById } from '@/data/leadership';
import { pluralise } from '@/lib/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return states.map((state) => ({ slug: state.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const state = getStateBySlug(slug);

  if (!state) {
    return buildMetadata({
      title: 'State not found',
      description: 'This state is not part of Region C.',
      path: `/states/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${state.name} Parishes`,
    description:
      state.summary ??
      `Celestial Church of Christ parishes in ${state.name}, served by Region C of the CCC USA Diocese.`,
    path: `/states/${state.slug}`,
  });
}

export default async function StatePage({ params }: PageProps) {
  const { slug } = await params;
  const state = getStateBySlug(slug);

  if (!state) notFound();

  const stateParishes = getParishesByState(state.code);
  // Events explicitly tied to this state; region-wide events are not duplicated here.
  const stateEvents = (await getUpcomingEvents()).filter((event) => event.state === state.code);
  const supervisor = state.supervisorId ? getLeaderById(state.supervisorId) : undefined;

  return (
    <>
      <PageHeader eyebrow="Region C States" title={state.name} description={state.summary} />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Region C States', path: '/states' },
          { name: state.name, path: `/states/${state.slug}` },
        ]}
      />

      <section className="bg-white py-12 sm:py-14">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="Parishes"
                title={`Region C parishes in ${state.name}`}
                description={
                  stateParishes.length > 0
                    ? `${stateParishes.length} ${pluralise(stateParishes.length, 'parish is', 'parishes are')} currently listed for ${state.name}.`
                    : undefined
                }
              />

              {parishDirectoryIsSample && stateParishes.length > 0 ? (
                <PlaceholderNotice className="mb-5">
                  These are example records. Verified parish listings for {state.name} will replace
                  them.
                </PlaceholderNotice>
              ) : null}

              {stateParishes.length > 0 ? (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {stateParishes.map((parish) => (
                    <li key={parish.id}>
                      <ParishCard parish={parish} />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title={`No parishes listed for ${state.name} yet`}
                  description={`Region C parishes in ${state.name} are being collected for publication. If you administer a parish in this state, please send its details to the Region C Secretariat.`}
                  action={
                    <ButtonLink href="/contact" variant="secondary">
                      Contact the Secretariat
                      <IconArrowRight className="h-4 w-4" />
                    </ButtonLink>
                  }
                />
              )}

              {stateEvents.length > 0 ? (
                <div className="mt-14">
                  <SectionHeading
                    eyebrow="Calendar"
                    title={`Events in ${state.name}`}
                    as="h2"
                  />
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {stateEvents.map((event) => (
                      <li key={event.id}>
                        <EventCard event={event} variant="compact" />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <aside className="space-y-4">
              <Card className="p-6">
                <h2 className="text-base font-semibold text-celestial-900">State information</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-celestial-500">Region</dt>
                    <dd className="mt-1 text-celestial-900">Region C — {siteConfig.dioceseName}</dd>
                  </div>
                  <div>
                    <dt className="text-celestial-500">Parishes listed</dt>
                    <dd className="mt-1 text-celestial-900">{stateParishes.length}</dd>
                  </div>
                  <div>
                    <dt className="text-celestial-500">State supervisor</dt>
                    <dd className="mt-1 text-celestial-900">
                      {supervisor
                        ? `${supervisor.ecclesiasticalTitle} ${supervisor.name}`
                        : 'To be confirmed'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-celestial-500">Status</dt>
                    <dd className="mt-1 text-celestial-900">
                      {state.status === 'confirmed' ? 'Confirmed Region C state' : 'Awaiting confirmation'}
                    </dd>
                  </div>
                </dl>
              </Card>

              <Card className="p-6">
                <h2 className="text-base font-semibold text-celestial-900">Regional contact</h2>
                <p className="mt-2 text-sm leading-relaxed text-celestial-600">
                  For questions about parishes or programmes in {state.name}, contact the Region C
                  Secretariat.
                </p>
                <a
                  href={`mailto:${siteConfig.contact.secretariatEmail}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium break-all text-celestial-800 underline-offset-4 hover:underline"
                >
                  <IconMail className="h-4 w-4 shrink-0 text-celestial-400" aria-hidden="true" />
                  {siteConfig.contact.secretariatEmail}
                </a>
                <ButtonLink href="/parishes" variant="secondary" className="mt-5 w-full">
                  Search all parishes
                  <IconArrowRight className="h-4 w-4" />
                </ButtonLink>
              </Card>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
