import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/primitives';
import { ButtonLink } from '@/components/ui/button';
import { IconArrowRight, IconChurch, IconMapPin } from '@/components/ui/icons';
import { orderedStates } from '@/data/states';
import { countParishesByState } from '@/data/parishes';
import { pluralise } from '@/lib/format';
import type { RegionState } from '@/lib/types';

/**
 * Explore Our Region.
 *
 * Renders the Region C states as a card grid. The section is structured as a
 * `RegionMap` slot plus a state list so that an interactive US/Region C map can
 * be dropped into `<RegionMapSlot />` later without disturbing the list, which
 * must remain as the accessible, no-JavaScript equivalent of the map.
 */
export function ExploreRegion() {
  const counts = countParishesByState();

  return (
    <section aria-labelledby="explore-heading" className="bg-celestial-50/50 py-16 sm:py-20">
      <Container width="wide">
        <SectionHeading
          eyebrow="Explore our region"
          title="The states Region C serves"
          description="Region C covers Celestial Church of Christ parishes across the western United States. Choose a state to see its parishes and regional contacts."
          action={
            <ButtonLink href="/states" variant="secondary">
              All Region C states
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />

        <RegionMapSlot />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {orderedStates.map((state) => (
            <li key={state.code}>
              <StateCard state={state} parishCount={counts[state.code] ?? 0} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * Reserved slot for the future interactive regional map.
 *
 * Kept as a named export and a self-contained block so the map component can
 * replace its contents in isolation. Until then it renders nothing, rather than
 * an empty frame that would read as a broken image.
 */
export function RegionMapSlot() {
  return null;
}

export function StateCard({ state, parishCount }: { state: RegionState; parishCount: number }) {
  const pending = state.status === 'pending';

  return (
    <Link
      href={`/states/${state.slug}`}
      className="group flex h-full flex-col rounded-lg border border-celestial-100 bg-white p-5 shadow-card transition-shadow duration-200 hover:border-celestial-200 hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-md bg-celestial-800 font-serif text-sm font-semibold tracking-wide text-gold-300"
        >
          {state.code}
        </span>
        <IconMapPin className="h-5 w-5 text-celestial-300" aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-lg text-celestial-900">{state.name}</h3>

      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-celestial-600">
        <IconChurch className="h-4 w-4 text-celestial-400" aria-hidden="true" />
        {parishCount > 0
          ? `${parishCount} ${pluralise(parishCount, 'parish', 'parishes')} listed`
          : 'Parishes to be listed'}
      </p>

      {pending ? (
        <p className="mt-3 text-xs font-medium text-gold-700">Awaiting confirmation</p>
      ) : null}

      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-celestial-700">
        View state
        <IconArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
