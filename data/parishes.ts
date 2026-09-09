import type { Parish } from '@/lib/types';
import { orderedStates } from './states';

/**
 * Region C parish directory.
 *
 * IMPORTANT: every record below is SAMPLE CONTENT, flagged with
 * `isPlaceholder: true` and surfaced in the UI as such. No real parish name,
 * address, shepherd, telephone number or service time has been invented.
 *
 * When the verified Region C parish list is supplied, replace this array
 * wholesale and remove the `isPlaceholder` flags. The directory, state pages,
 * search, filtering and counters are all driven from this one file and will
 * scale to dozens of parishes without layout changes.
 */
export const parishes: Parish[] = [
  {
    id: 'sample-ca-1',
    name: 'Sample Parish — Los Angeles',
    slug: 'sample-parish-los-angeles',
    state: 'CA',
    city: 'Los Angeles',
    description:
      'Example record showing how a Region C parish will appear in the directory once verified details are supplied by the Secretariat.',
    serviceTimes: [
      { label: 'Sunday Service', day: 'Sunday', time: 'Time to be confirmed' },
      { label: 'Midweek Service', day: 'Wednesday', time: 'Time to be confirmed' },
    ],
    isPlaceholder: true,
  },
  {
    id: 'sample-ca-2',
    name: 'Sample Parish — Sacramento',
    slug: 'sample-parish-sacramento',
    state: 'CA',
    city: 'Sacramento',
    description:
      'Example record demonstrating multiple parishes within a single Region C state.',
    isPlaceholder: true,
  },
  {
    id: 'sample-ca-3',
    name: 'Sample Parish — Oakland',
    slug: 'sample-parish-oakland',
    state: 'CA',
    city: 'Oakland',
    description:
      'Example record demonstrating city-level browsing within the parish directory.',
    isPlaceholder: true,
  },
  {
    id: 'sample-az-1',
    name: 'Sample Parish — Phoenix',
    slug: 'sample-parish-phoenix',
    state: 'AZ',
    city: 'Phoenix',
    description: 'Example record for Arizona pending confirmed parish details.',
    isPlaceholder: true,
  },
  {
    id: 'sample-nv-1',
    name: 'Sample Parish — Las Vegas',
    slug: 'sample-parish-las-vegas',
    state: 'NV',
    city: 'Las Vegas',
    description: 'Example record for Nevada pending confirmed parish details.',
    isPlaceholder: true,
  },
  {
    id: 'sample-wa-1',
    name: 'Sample Parish — Seattle',
    slug: 'sample-parish-seattle',
    state: 'WA',
    city: 'Seattle',
    description: 'Example record for Washington pending confirmed parish details.',
    isPlaceholder: true,
  },
];

/** True while the directory contains only sample records. Drives the UI notice. */
export const parishDirectoryIsSample: boolean =
  parishes.length > 0 && parishes.every((parish) => parish.isPlaceholder);

/** Parishes sorted by state name, then city, then parish name. */
export const orderedParishes: Parish[] = [...parishes].sort((a, b) => {
  const stateCompare = stateSortKey(a.state).localeCompare(stateSortKey(b.state));
  if (stateCompare !== 0) return stateCompare;
  const cityCompare = a.city.localeCompare(b.city);
  if (cityCompare !== 0) return cityCompare;
  return a.name.localeCompare(b.name);
});

function stateSortKey(code: string): string {
  return orderedStates.find((state) => state.code === code)?.name ?? code;
}

export function getParishBySlug(slug: string): Parish | undefined {
  return parishes.find((parish) => parish.slug === slug);
}

export function getParishesByState(code: string): Parish[] {
  return orderedParishes.filter((parish) => parish.state === code.toUpperCase());
}

export function countParishesByState(): Record<string, number> {
  return parishes.reduce<Record<string, number>>((counts, parish) => {
    counts[parish.state] = (counts[parish.state] ?? 0) + 1;
    return counts;
  }, {});
}

/** Distinct cities represented in the directory, alphabetically. */
export function parishCities(): string[] {
  return [...new Set(parishes.map((parish) => parish.city))].sort((a, b) => a.localeCompare(b));
}
