import type { Leader } from '@/lib/types';

/**
 * Region C Executive Members.
 *
 * Source: the official "Region C Executive Members — CCC U.S.A. Dioceses"
 * graphic supplied by the Region C Secretariat. Names, ecclesiastical titles and
 * offices are transcribed from that graphic and have not been embellished.
 *
 * One deliberate deviation from the graphic: it prints "RISHARD ANISERE", which
 * the Secretariat has confirmed is a typographical error in the graphic itself.
 * The correct spelling is "Richard Anisere". Do not "correct" this back to match
 * the artwork.
 *
 * Not yet supplied, and therefore intentionally absent rather than invented:
 * biographies, parish/state affiliations and e-mail addresses, and headshots for
 * everyone but the Supervisor and the Deputy Regional Supervisor. Cards degrade
 * gracefully to initials until `image` is populated.
 *
 * Headshots live in `public/images/`, web-sized; the full-resolution originals
 * are kept in `assets/leadership/`, which is outside the served directory.
 *
 * To update leadership, edit this file only — no page or component changes are
 * required.
 */
export const leadership: Leader[] = [
  {
    id: 'joseph-awosika',
    name: 'Joseph Awosika',
    ecclesiasticalTitle: 'VSE',
    image: '/images/vse-joseph-awosika.jpg',
    office: 'Region C Supervisor',
    tier: 'principal',
    portfolio: 'Regional Office',
    displayOrder: 1,
  },
  {
    id: 'yomi-dodo-williams',
    name: 'Yomi Dodo-Williams',
    ecclesiasticalTitle: 'VSE',
    image: '/images/vse-yomi-dodo-williams-v2.jpg',
    office: 'Region C Deputy Regional Supervisor',
    tier: 'principal',
    portfolio: 'Regional Office',
    displayOrder: 2,
  },
  {
    id: 'amos-adeoye',
    name: 'Amos Adeoye',
    ecclesiasticalTitle: 'VSE',
    office: 'Shepherd & Region C States Supervisor',
    tier: 'executive',
    portfolio: 'Regional Office',
    displayOrder: 10,
  },
  {
    id: 'gabriel-shoaga',
    name: 'Gabriel Shoaga',
    ecclesiasticalTitle: 'Snr. Evang.',
    office: 'Regional Secretary',
    tier: 'executive',
    portfolio: 'Administration',
    displayOrder: 11,
  },
  {
    id: 'funke-shoaga',
    name: 'Funke Shoaga',
    ecclesiasticalTitle: 'MC',
    office: 'Regional Treasurer & Choir Matron',
    tier: 'executive',
    portfolio: 'Administration',
    displayOrder: 12,
  },
  {
    id: 'abiodun-awosika',
    name: 'Abiodun Awosika',
    ecclesiasticalTitle: 'HMSE',
    office: 'Financial Secretary',
    tier: 'executive',
    portfolio: 'Administration',
    displayOrder: 13,
  },
  {
    id: 'ade-alaba',
    name: 'Ade Alaba',
    ecclesiasticalTitle: 'Sup. Ev.',
    office: 'Shepherd & Compliance Officer',
    tier: 'executive',
    portfolio: 'Administration',
    displayOrder: 14,
  },
  {
    id: 'james-adubi',
    name: 'James Adubi',
    ecclesiasticalTitle: 'AVSE',
    office: 'Shepherd & Special Duties Officer',
    tier: 'executive',
    portfolio: 'Administration',
    displayOrder: 15,
  },
  {
    id: 'richard-anisere',
    name: 'Richard Anisere',
    ecclesiasticalTitle: 'VSE',
    office: 'Evangelism Director',
    tier: 'executive',
    portfolio: 'Evangelism',
    displayOrder: 20,
  },
  {
    id: 'yves-goncalves',
    name: 'Yves Goncalves',
    ecclesiasticalTitle: 'AVSE',
    office: 'Evangelism Deputy Director',
    tier: 'executive',
    portfolio: 'Evangelism',
    displayOrder: 21,
  },
  {
    id: 'issac-awolope',
    name: 'Issac Awolope',
    ecclesiasticalTitle: 'AVSE',
    office: 'Shepherd & Grand Patron',
    tier: 'executive',
    portfolio: 'Shepherding',
    displayOrder: 30,
  },
  {
    id: 'tunde-clement',
    name: 'Tunde Clement',
    ecclesiasticalTitle: 'AVSE',
    office: 'Shepherd, Discipline & Reconciliation Chairman',
    tier: 'executive',
    portfolio: 'Shepherding',
    displayOrder: 31,
  },
  {
    id: 'chris-isibor',
    name: 'Chris Isibor',
    ecclesiasticalTitle: 'AVSE',
    office: 'Shepherd & Protocol',
    tier: 'executive',
    portfolio: 'Shepherding',
    displayOrder: 32,
  },
  {
    id: 'raphael-akinmoladun',
    name: 'Raphael Akinmoladun',
    ecclesiasticalTitle: 'VSE',
    office: 'Shepherd & Member',
    tier: 'executive',
    portfolio: 'Shepherding',
    displayOrder: 33,
  },
  {
    id: 'abimbola-samuel',
    name: 'Abimbola Samuel',
    ecclesiasticalTitle: 'MC',
    office: 'Women Council President',
    tier: 'executive',
    portfolio: 'Women',
    displayOrder: 40,
  },
  {
    id: 'aanu-oshuntola',
    name: 'Aanu Oshuntola',
    ecclesiasticalTitle: 'MC',
    office: 'Youth Director',
    tier: 'executive',
    portfolio: 'Youth',
    displayOrder: 50,
  },
  {
    id: 'kehinde-adebayo',
    name: 'Kehinde Adebayo',
    ecclesiasticalTitle: 'Prophetess',
    office: 'Youth Coordinator',
    tier: 'executive',
    portfolio: 'Youth',
    displayOrder: 51,
  },
  {
    id: 'david-alabi',
    name: 'David Alabi',
    ecclesiasticalTitle: 'Prophet',
    office: 'Youth Representative',
    tier: 'executive',
    portfolio: 'Youth',
    displayOrder: 52,
  },
  {
    id: 'yewande-williams',
    name: 'Yewande Williams',
    ecclesiasticalTitle: 'MC',
    office: 'Welfare Director',
    tier: 'executive',
    portfolio: 'Welfare',
    displayOrder: 60,
  },
  {
    id: 'michael-balogun',
    name: 'Michael Balogun',
    ecclesiasticalTitle: 'Senior Leader',
    office: 'Region C Regional Choirmaster',
    tier: 'executive',
    portfolio: 'Music',
    displayOrder: 70,
  },
];

/** Leadership sorted for display: principals first, then by `displayOrder`. */
export const orderedLeadership: Leader[] = [...leadership].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);

export const principalLeaders: Leader[] = orderedLeadership.filter((l) => l.tier === 'principal');
export const executiveLeaders: Leader[] = orderedLeadership.filter((l) => l.tier === 'executive');

export function getLeaderById(id: string): Leader | undefined {
  return leadership.find((leader) => leader.id === id);
}

export function getLeadersByPortfolio(portfolio: Leader['portfolio']): Leader[] {
  return orderedLeadership.filter((leader) => leader.portfolio === portfolio);
}

/** Full display name, e.g. "VSE Joseph Awosika". */
export function leaderFullName(leader: Leader): string {
  return `${leader.ecclesiasticalTitle} ${leader.name}`.trim();
}

/** Up to two initials, used by the avatar fallback. */
export function leaderInitials(leader: Leader): string {
  return leader.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
