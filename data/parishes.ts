import type { Parish, ParishSocial } from '@/lib/types';
import { orderedStates, stateName } from './states';

/**
 * Region C parish directory.
 *
 * Source: the CCC USA Diocese parish directory at
 * https://www.cccusadiocese.org/jobs/account-director (the page the Diocese's
 * /parishes state links open), transcribed 2026-09-10. Only parishes in a Region
 * C state are included; the Diocese lists none yet for Colorado, Idaho, Montana,
 * Nevada, New Mexico, Oregon, Utah, Washington or Wyoming.
 *
 * Transcribed as published, with formatting tidied only (spacing, stray
 * punctuation, "Los-Angeles"). Nothing has been added: the source gives no
 * service times or descriptions, so none appear. Details the Region C
 * Secretariat should confirm are noted beside the record.
 *
 * Region C corrections to the Diocese listing (2026-09-10): every shepherd now
 * holds the rank VSE; Hephzibah-Beulah Parish (Gardena), Oakland Parish and
 * Sanctuary of the Lord Parish are removed from the Region C listing; LA Mother
 * Parish (El Monte), Patmos Sanctuary Parish and San Diego Central Parish,
 * absent from the Diocese listing, are added; Eternal Ark of Covenant Parish's
 * listed address is out of date and is withheld.
 *
 * Further Region C addition (2026-09-19): New Covenant Parish, California, also
 * absent from the Diocese listing.
 */
export const parishes: Parish[] = [
  {
    id: 'az-arizona-central',
    name: 'Arizona Central Parish',
    slug: 'arizona-central-parish',
    state: 'AZ',
    city: 'Phoenix',
    address: '6245 N 35th Avenue, Unit 2, Phoenix, AZ 85017',
    // 818 is a Los Angeles-area code; confirm this is the parish's number.
    phone: '818-439-6043',
    email: 'oduac@yahoo.com',
    shepherd: 'VSE Christopher Isibor',
  },
  {
    id: 'ca-comforter',
    name: 'Comforter Parish',
    slug: 'comforter-parish',
    state: 'CA',
    city: 'Los Angeles',
    address: '7623-25 South Vermont Avenue, Los Angeles, CA 90044',
    phone: '310-350-3328',
    email: 'adeayinde@aol.com',
    shepherd: 'VSE Amos Adeoye',
  },
  {
    id: 'ca-sanctum',
    name: 'Sanctum Parish',
    slug: 'sanctum-parish',
    state: 'CA',
    city: 'Bloomington',
    address: '11750 Cedar Avenue, Bloomington, CA 92316',
    phone: '909-996-2397',
    email: 'celestialsanctumparish@gmail.com',
    website: 'https://www.celestialsanctumparish.org',
    // The parish website names no shepherd; this is from the Diocese listing.
    shepherd: 'VSE Yomi Dodo-Williams',
    // Description, service times and social links are from the parish's own
    // website (visit, about and contact pages), read 2026-09-11.
    description:
      'Celestial Sanctum Parish, meaning "heavenly sanctuary", began in 1999 in a small home room in Rancho Cucamonga and is now established in Bloomington. Its mission is to win and nurture souls for the kingdom of God.',
    serviceTimes: [
      { label: 'Worship', day: 'Sunday', time: '10 AM – 2 PM' },
      { label: 'Bible Study', day: 'Monday', time: '8 PM' },
      { label: 'Prophesying Into Your Situation', day: 'Tuesday', time: '8 PM' },
      { label: 'Seeker Service', day: 'Wednesday', time: '9 AM' },
      { label: 'Midnight Vigil', day: 'Thursday', time: '12 AM' },
      { label: 'Power Day Service', day: 'Friday', time: '9:30 PM' },
      { label: "Women's Fellowship", day: 'Saturday', time: '5 PM' },
    ],
    social: {
      facebook: 'https://www.facebook.com/celestialsanctumparish',
      instagram: 'https://instagram.com/sanctumparish',
      youtube: 'https://youtube.com/user/cccSanctumParish',
      x: 'https://twitter.com/SanctumParish',
      vimeo: 'https://vimeo.com/celestialsanctumparish',
      spotify: 'https://open.spotify.com/show/0lQ2H8kaRG8nl6InuGUcC6',
    },
  },
  {
    id: 'ca-la-mother',
    name: 'LA Mother Parish',
    slug: 'la-mother-parish',
    state: 'CA',
    city: 'El Monte',
    address: '2600 Tyler Avenue, El Monte, CA 91733',
    // Supplied by Region C; phone and e-mail still to be provided.
    shepherd: 'VSE Raphael Akinmoladun',
  },
  {
    id: 'ca-oshoffa',
    name: 'Oshoffa Parish',
    slug: 'oshoffa-parish',
    state: 'CA',
    city: 'Los Angeles',
    // Relocated from 13425 South Normandie Avenue, Gardena; new address
    // supplied by Region C, 2026-09-19.
    address: '7834 South Main Street, Los Angeles, CA 90003',
    phone: '310-946-5383',
    email: 'josephawosika@att.net',
    shepherd: 'VSE Joseph Awosika',
  },
  {
    id: 'ca-eternal-ark-of-covenant',
    name: 'Eternal Ark of Covenant Parish',
    slug: 'eternal-ark-of-covenant-parish',
    state: 'CA',
    city: 'Los Angeles',
    // The Diocese listing's address (8803 S Broadway Street) is out of date, so
    // none is shown until the current one is supplied. Phone and e-mail are from
    // that same listing; confirm them.
    phone: '323-833-2746',
    email: 'e.arkofcovenantparish@yahoo.com',
    // The source lists www.cccebenezeryparish.com, which does not respond and
    // appears to belong to a different parish, so it is omitted.
    shepherd: 'VSE Tunde Clement',
  },
  {
    id: 'ca-san-diego-central',
    name: 'San Diego Central Parish',
    slug: 'san-diego-central-parish',
    state: 'CA',
    city: 'San Diego',
    address: '5795 El Cajon Blvd, San Diego, CA 92115',
    // Address and shepherd supplied by Region C; phone and e-mail still to be
    // provided.
    shepherd: 'VSE Francis Alaba',
    social: { facebook: 'https://www.facebook.com/cccsandiegoparish/' },
  },
  {
    id: 'ca-patmos-sanctuary',
    name: 'Patmos Sanctuary Parish',
    slug: 'patmos-sanctuary-parish',
    state: 'CA',
    // Supplied by Region C with no address yet; listed by state alone.
  },
  {
    id: 'ca-new-covenant',
    name: 'New Covenant Parish',
    slug: 'new-covenant-parish',
    state: 'CA',
    // Supplied by Region C (2026-09-19) alongside its Harvest date, with no city
    // or address yet; listed by state alone. Address, city, shepherd, phone and
    // e-mail still to be provided.
  },
];

/** True while the directory contains only sample records. Drives the UI notice. */
export const parishDirectoryIsSample: boolean =
  parishes.length > 0 && parishes.every((parish) => parish.isPlaceholder);

/** Parishes sorted by state name, then city, then parish name. */
export const orderedParishes: Parish[] = [...parishes].sort((a, b) => {
  const stateCompare = stateSortKey(a.state).localeCompare(stateSortKey(b.state));
  if (stateCompare !== 0) return stateCompare;
  // A parish listed by state alone sorts ahead of the cities in that state.
  const cityCompare = (a.city ?? '').localeCompare(b.city ?? '');
  if (cityCompare !== 0) return cityCompare;
  return a.name.localeCompare(b.name);
});

function stateSortKey(code: string): string {
  return orderedStates.find((state) => state.code === code)?.name ?? code;
}

export function getParishBySlug(slug: string): Parish | undefined {
  return parishes.find((parish) => parish.slug === slug);
}

/**
 * Finds a parish by name, for content that names one as free text.
 *
 * An event's host parish comes from a line an administrator types into a Google
 * Calendar description, so it will not always match the directory character for
 * character. Case and spacing are normalised, and a trailing "Parish" is
 * optional on either side, so both "Comforter Parish" and "comforter" resolve.
 * Returns undefined when nothing matches, which callers render as plain text
 * rather than a link to a page that does not exist.
 */
export function getParishByName(name: string): Parish | undefined {
  const normalise = (value: string) =>
    value.toLowerCase().replace(/\s+/g, ' ').trim().replace(/\s+parish$/, '');

  const target = normalise(name);
  if (!target) return undefined;

  return parishes.find((parish) => normalise(parish.name) === target);
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
  return [...new Set(parishes.flatMap((parish) => (parish.city ? [parish.city] : [])))].sort(
    (a, b) => a.localeCompare(b),
  );
}

/** Display labels, in the order social links are listed. */
const SOCIAL_LABELS: Record<keyof ParishSocial, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  x: 'X (Twitter)',
  vimeo: 'Vimeo',
  spotify: 'Spotify',
};

/** A parish's social media accounts as labelled links, in a fixed order. */
export function parishSocialLinks(parish: Parish): { label: string; url: string }[] {
  return (Object.keys(SOCIAL_LABELS) as (keyof ParishSocial)[]).flatMap((key) => {
    const url = parish.social?.[key];
    return url ? [{ label: SOCIAL_LABELS[key], url }] : [];
  });
}

/** "Oakland, California", or "California" when only the state is known. */
export function parishLocation(parish: Parish): string {
  const state = stateName(parish.state);
  return parish.city ? `${parish.city}, ${state}` : state;
}
