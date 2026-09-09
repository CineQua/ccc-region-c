import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { Breadcrumbs, Card, PageHeader, SectionHeading } from '@/components/ui/primitives';
import { IconArrowRight, ministryIcons } from '@/components/ui/icons';
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/config/site';
import { orderedMinistries } from '@/data/ministries';

export const metadata = buildMetadata({
  title: 'Mission & Purpose',
  description:
    'The purpose of Region C: connecting parishes, strengthening fellowship and advancing the mission of the Celestial Church of Christ across the western United States.',
  path: '/about/mission',
});

/**
 * Purpose statements describing what the region does administratively. These are
 * organisational descriptions, not doctrinal statements: doctrine belongs to the
 * church and the Diocese, and none is asserted here.
 */
const purposes = [
  {
    title: 'Connecting parishes',
    body: 'Region C keeps parishes across its states in contact with one another — sharing information, coordinating programmes, and ensuring no parish serves in isolation.',
  },
  {
    title: 'Strengthening fellowship',
    body: 'Regional gatherings, departmental programmes and joint services bring members together beyond the boundaries of their own parish.',
  },
  {
    title: 'Advancing the mission',
    body: 'The region coordinates evangelism across its states, supporting parishes in outreach and in the care of those who come.',
  },
  {
    title: 'Supporting those who serve',
    body: 'Shepherds, parish administrators and departmental workers receive administrative guidance, forms, training material and regional support.',
  },
  {
    title: 'Carrying diocesan direction',
    body: 'Region C conveys the guidance and announcements of the USA Diocese to its parishes, and represents its parishes to the Diocese.',
  },
  {
    title: 'Building for the future',
    body: 'Regional records, communication and technology are being organised so that Region C can grow in an orderly way as new parishes are established.',
  },
];

export default function MissionPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Mission & Purpose"
        description={siteConfig.tagline}
      />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'About Region C', path: '/about' },
          { name: 'Mission & Purpose', path: '/about/mission' },
        ]}
      />

      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="prose-region">
            <p className="font-serif text-xl leading-snug text-celestial-800 sm:text-2xl">
              Region C exists to serve the parishes of the Celestial Church of Christ within its
              states — connecting them to one another, to the departments of the church, and to the{' '}
              {siteConfig.diocese}.
            </p>
            <p className="mt-6">
              The work of the region is administrative and pastoral rather than doctrinal. Doctrine,
              order and worship belong to the Celestial Church of Christ; Region C exists to see that
              the parishes within its states are supported, coordinated and well governed.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-y border-celestial-100 bg-celestial-50/50 py-14 sm:py-16">
        <Container width="wide">
          <SectionHeading
            eyebrow="Our purpose"
            title="What Region C sets out to do"
            align="center"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {purposes.map((purpose) => (
              <li key={purpose.title}>
                <Card className="h-full p-6">
                  <h3 className="text-lg text-celestial-900">{purpose.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-celestial-700">{purpose.body}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <Container width="wide">
          <SectionHeading
            eyebrow="Ministries"
            title="How the work is carried out"
            description="The mission of the region is delivered through its ministry departments, each under a member of the Region C Executive."
            action={
              <ButtonLink href="/ministries" variant="secondary">
                All ministries
                <IconArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedMinistries.map((ministry) => {
              const Icon = ministryIcons[ministry.icon];
              return (
                <li key={ministry.id}>
                  <Card className="flex h-full flex-col p-6">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-md bg-celestial-50 text-celestial-700"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-celestial-900">
                      {ministry.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-celestial-600">
                      {ministry.summary}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
    </>
  );
}
