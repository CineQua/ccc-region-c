/**
 * Single source of truth for primary, footer and utility navigation.
 * Header, mobile drawer, footer and sitemap all read from here so a new section
 * only has to be declared once.
 */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  /** Hide from the sitemap when the destination is off-site. */
  external?: boolean;
}

export interface NavSection extends NavLink {
  children?: NavLink[];
}

export const primaryNav: NavSection[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'About Region C', href: '/about', description: 'Who we are and how the region is organised' },
      { label: 'Mission & Purpose', href: '/about/mission', description: 'What Region C exists to do' },
      { label: 'Region C States', href: '/states', description: 'The states served by the region' },
      { label: 'Leadership', href: '/leadership', description: 'The Region C Executive' },
    ],
  },
  {
    label: 'Parishes',
    href: '/parishes',
    children: [
      { label: 'All Parishes', href: '/parishes', description: 'Search the full Region C directory' },
      { label: 'Browse by State', href: '/states', description: 'Find a parish near you' },
    ],
  },
  {
    label: 'Ministries',
    href: '/ministries',
    children: [
      { label: 'All Ministries', href: '/ministries', description: 'Regional ministry departments' },
      { label: 'Evangelism', href: '/ministries/evangelism' },
      { label: 'Women', href: '/ministries/women' },
      { label: 'Youth', href: '/ministries/youth' },
      { label: 'Welfare', href: '/ministries/welfare' },
      { label: 'Choir & Music', href: '/ministries/choir-and-music' },
    ],
  },
  {
    label: 'Events',
    href: '/events',
    children: [
      { label: 'Upcoming Events', href: '/events', description: 'The regional programme' },
      { label: 'Regional Calendar', href: '/events/calendar', description: 'Year-at-a-glance view' },
    ],
  },
  { label: 'News', href: '/news' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Region C',
    links: [
      { label: 'About Region C', href: '/about' },
      { label: 'Mission & Purpose', href: '/about/mission' },
      { label: 'Regional Leadership', href: '/leadership' },
      { label: 'Region C States', href: '/states' },
    ],
  },
  {
    title: 'Find & Connect',
    links: [
      { label: 'Parish Directory', href: '/parishes' },
      { label: 'Ministries', href: '/ministries' },
      { label: 'Upcoming Events', href: '/events' },
      { label: 'News & Updates', href: '/news' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Resources & Forms', href: '/resources' },
      { label: 'Contact the Region', href: '/contact' },
      { label: 'CCC USA Diocese', href: 'https://cccusadiocese.org', external: true },
    ],
  },
];
