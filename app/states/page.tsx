import { Container } from '@/components/ui/container';
import { Breadcrumbs, PageHeader, SectionHeading } from '@/components/ui/primitives';
import { StateCard } from '@/components/home/explore-region';
import { buildMetadata } from '@/lib/metadata';
import { orderedStates } from '@/data/states';
import { countParishesByState } from '@/data/parishes';

export const metadata = buildMetadata({
  title: 'Region C States',
  description:
    'The United States served by Region C of the Celestial Church of Christ USA Diocese: California, Arizona, Nevada and Washington.',
  path: '/states',
});

export default function StatesPage() {
  const counts = countParishesByState();

  return (
    <>
      <PageHeader
        eyebrow="Region C"
        title="Region C States"
        description="Region C serves Celestial Church of Christ parishes across the western United States. Additional Region C states will be listed here as they are confirmed by the Diocese."
      />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Region C States', path: '/states' },
        ]}
      />

      <section className="bg-white py-12 sm:py-16">
        <Container width="wide">
          <SectionHeading
            eyebrow="Confirmed states"
            title="Choose a state"
            description="Each state page lists the Region C parishes within it, together with regional contacts."
          />

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orderedStates.map((state) => (
              <li key={state.code}>
                <StateCard state={state} parishCount={counts[state.code] ?? 0} />
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-lg border border-celestial-100 bg-celestial-50/60 p-6">
            <h2 className="text-base font-semibold text-celestial-900">
              Is your state part of Region C?
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-celestial-600">
              The states listed above are those confirmed for Region C. Further Region C states are
              expected, and will appear here once the Diocese has confirmed them. If you worship at a
              Celestial Church of Christ parish in a state that is not listed, contact the Region C
              Secretariat.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
