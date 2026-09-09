import type { RegionState } from '@/lib/types';

/**
 * States served by Region C.
 *
 * Only states confirmed by the Region C Secretariat appear here. Additional
 * Region C states are expected; adding one is a single entry in this array and
 * requires no other change — state pages, parish filters, the "Explore Our
 * Region" grid, the homepage counters and the sitemap all derive from this list.
 *
 * Set `status: 'pending'` for a state that is under discussion but not yet
 * ratified; pending states are rendered as awaiting confirmation and are
 * excluded from published counts.
 */
export const states: RegionState[] = [
  {
    code: 'CA',
    name: 'California',
    slug: 'california',
    status: 'confirmed',
    summary:
      'The most populous state in Region C and home to a long-established Celestial Church of Christ community across both Northern and Southern California.',
  },
  {
    code: 'AZ',
    name: 'Arizona',
    slug: 'arizona',
    status: 'confirmed',
    summary:
      'Celestial Church of Christ worshippers across the Phoenix and Tucson corridors are served within Region C.',
  },
  {
    code: 'NV',
    name: 'Nevada',
    slug: 'nevada',
    status: 'confirmed',
    summary:
      'Region C parishes in Nevada serve members in the Las Vegas and Reno metropolitan areas.',
  },
  {
    code: 'WA',
    name: 'Washington',
    slug: 'washington',
    status: 'confirmed',
    summary:
      'Region C extends into the Pacific Northwest, serving members throughout Washington State.',
  },
];

export const confirmedStates: RegionState[] = states.filter((s) => s.status === 'confirmed');

/** Alphabetical by state name — the order used everywhere states are listed. */
export const orderedStates: RegionState[] = [...states].sort((a, b) => a.name.localeCompare(b.name));

export function getStateBySlug(slug: string): RegionState | undefined {
  return states.find((state) => state.slug === slug);
}

export function getStateByCode(code: string): RegionState | undefined {
  return states.find((state) => state.code === code.toUpperCase());
}

/** Resolve a state code to its display name, falling back to the code itself. */
export function stateName(code: string): string {
  return getStateByCode(code)?.name ?? code;
}
