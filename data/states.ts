import type { RegionState } from '@/lib/types';
import { formatList } from '@/lib/format';

/**
 * States served by Region C.
 *
 * The full list of eleven Region C states was confirmed in September 2026. State
 * pages, parish filters, the "Explore Our Region" grid, the homepage counters,
 * page descriptions and the sitemap all derive from this list, so a change here
 * needs no other edit.
 *
 * Set `status: 'pending'` for a state that is under discussion but not yet
 * ratified; pending states are rendered as awaiting confirmation and are
 * excluded from published counts.
 *
 * Summaries describe the state's place in the region only. Add city or parish
 * detail once the Secretariat has supplied it; none has been assumed.
 */
export const states: RegionState[] = [
  {
    code: 'AZ',
    name: 'Arizona',
    slug: 'arizona',
    status: 'confirmed',
    summary: 'Region C serves Celestial Church of Christ parishes and members throughout Arizona.',
  },
  {
    code: 'CA',
    name: 'California',
    slug: 'california',
    status: 'confirmed',
    summary:
      'The most populous state in Region C and home to a long-established Celestial Church of Christ community across both Northern and Southern California.',
  },
  {
    code: 'CO',
    name: 'Colorado',
    slug: 'colorado',
    status: 'confirmed',
    summary:
      'Region C serves Celestial Church of Christ parishes and members throughout Colorado.',
  },
  {
    code: 'ID',
    name: 'Idaho',
    slug: 'idaho',
    status: 'confirmed',
    summary: 'Region C serves Celestial Church of Christ parishes and members throughout Idaho.',
  },
  {
    code: 'MT',
    name: 'Montana',
    slug: 'montana',
    status: 'confirmed',
    summary: 'Region C serves Celestial Church of Christ parishes and members throughout Montana.',
  },
  {
    code: 'NV',
    name: 'Nevada',
    slug: 'nevada',
    status: 'confirmed',
    summary: 'Region C serves Celestial Church of Christ parishes and members throughout Nevada.',
  },
  {
    code: 'NM',
    name: 'New Mexico',
    slug: 'new-mexico',
    status: 'confirmed',
    summary:
      'Region C serves Celestial Church of Christ parishes and members throughout New Mexico.',
  },
  {
    code: 'OR',
    name: 'Oregon',
    slug: 'oregon',
    status: 'confirmed',
    summary:
      'Region C serves Celestial Church of Christ parishes and members throughout Oregon, in the Pacific Northwest.',
  },
  {
    code: 'UT',
    name: 'Utah',
    slug: 'utah',
    status: 'confirmed',
    summary: 'Region C serves Celestial Church of Christ parishes and members throughout Utah.',
  },
  {
    code: 'WA',
    name: 'Washington',
    slug: 'washington',
    status: 'confirmed',
    summary:
      'Region C extends into the Pacific Northwest, serving members throughout Washington State.',
  },
  {
    code: 'WY',
    name: 'Wyoming',
    slug: 'wyoming',
    status: 'confirmed',
    summary: 'Region C serves Celestial Church of Christ parishes and members throughout Wyoming.',
  },
];

export const confirmedStates: RegionState[] = states.filter((s) => s.status === 'confirmed');

/** Alphabetical by state name — the order used everywhere states are listed. */
export const orderedStates: RegionState[] = [...states].sort((a, b) => a.name.localeCompare(b.name));

/** Confirmed state names as prose, alphabetically: "Arizona, California, … and Wyoming". */
export const confirmedStateList: string = formatList(
  orderedStates.filter((s) => s.status === 'confirmed').map((s) => s.name),
);

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
