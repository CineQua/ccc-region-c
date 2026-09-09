import type { Ministry } from '@/lib/types';

/**
 * Region C ministry departments.
 *
 * Ministries are cross-referenced to the Region C Executive by `leaderIds`, so a
 * change of officer in `data/leadership.ts` flows through to every ministry page
 * automatically. Adding a ministry is a single entry here: the index page, the
 * navigation dropdown, the homepage counter and the sitemap all derive from it.
 *
 * Descriptive copy is written to be organisationally accurate and generic; it
 * makes no claims about specific programmes, budgets or history.
 */
export const ministries: Ministry[] = [
  {
    id: 'evangelism',
    name: 'Evangelism',
    slug: 'evangelism',
    icon: 'evangelism',
    displayOrder: 1,
    summary:
      'Coordinating outreach across Region C and supporting parishes in the work of soul-winning.',
    description: [
      'The Evangelism Department carries the central mandate of Region C: to make the gospel known throughout the states the region serves, and to support every parish in that work.',
      'The department coordinates regional outreach, encourages joint parish evangelism, and provides guidance to parish evangelism units so that effort is shared rather than duplicated.',
    ],
    leaderIds: ['richard-anisere', 'yves-goncalves'],
    focusAreas: [
      'Regional outreach programmes',
      'Support for parish evangelism units',
      'Coordination between parishes and states',
      'Follow-up and discipleship of new members',
    ],
  },
  {
    id: 'women',
    name: 'Women',
    slug: 'women',
    icon: 'women',
    displayOrder: 2,
    summary:
      'The Region C Women Council, serving the women of every parish in the region.',
    description: [
      'The Women Council brings together the women of Region C parishes for fellowship, service and mutual support.',
      'The Council convenes regional gatherings, supports parish women groups, and works alongside the Welfare Department in caring for members and families in need.',
    ],
    leaderIds: ['abimbola-samuel'],
    focusAreas: [
      'Regional women conferences and gatherings',
      'Support for parish women groups',
      'Care for families and members in need',
      'Mentoring and fellowship',
    ],
  },
  {
    id: 'youth',
    name: 'Youth',
    slug: 'youth',
    icon: 'youth',
    displayOrder: 3,
    summary:
      'Building up the next generation of Celestial Church of Christ members across Region C.',
    description: [
      'The Youth Department serves young members throughout Region C, creating opportunities for worship, service, leadership and fellowship beyond the individual parish.',
      'It works with parish youth leaders to keep young members connected to the wider region, and to prepare them for service within the church.',
    ],
    leaderIds: ['aanu-oshuntola', 'kehinde-adebayo', 'david-alabi'],
    focusAreas: [
      'Regional youth gatherings and convocations',
      'Leadership development for young members',
      'Support for parish youth leaders',
      'Service and outreach opportunities',
    ],
  },
  {
    id: 'welfare',
    name: 'Welfare',
    slug: 'welfare',
    icon: 'welfare',
    displayOrder: 4,
    summary:
      'Practical care for members, families and parishes across the region.',
    description: [
      'The Welfare Department attends to the practical needs of members and families within Region C, working discreetly and in coordination with parish shepherds.',
      'It also supports parishes facing particular difficulty, ensuring that need in one part of the region can be met by the strength of the whole.',
    ],
    leaderIds: ['yewande-williams'],
    focusAreas: [
      'Support for members and families in need',
      'Coordination with parish shepherds',
      'Bereavement and hospital visitation support',
      'Parish assistance',
    ],
  },
  {
    id: 'choir-and-music',
    name: 'Choir & Music',
    slug: 'choir-and-music',
    icon: 'music',
    displayOrder: 5,
    summary:
      'Upholding the worship and musical tradition of the Celestial Church of Christ throughout Region C.',
    description: [
      'The Choir and Music Department, under the Regional Choirmaster, upholds the distinctive worship tradition of the Celestial Church of Christ across Region C.',
      'It supports parish choirs, encourages consistency in the singing of the church, and convenes regional gatherings that bring parish choirs together.',
    ],
    leaderIds: ['michael-balogun', 'funke-shoaga'],
    focusAreas: [
      'Support and training for parish choirs',
      'Regional choir gatherings and festivals',
      'Consistency in worship and hymnody',
      'Instrumentation and music resources',
    ],
  },
];

/** Ministries in their configured display order. */
export const orderedMinistries: Ministry[] = [...ministries].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);

export function getMinistryBySlug(slug: string): Ministry | undefined {
  return ministries.find((ministry) => ministry.slug === slug);
}
