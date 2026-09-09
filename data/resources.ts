import type { Resource, ResourceCategory } from '@/lib/types';
import { siteConfig } from '@/config/site';

export const resourceCategories: ResourceCategory[] = [
  'Forms',
  'Policies',
  'Official Notices',
  'Administration',
  'Training',
  'Technology',
  'Parish Support',
];

/**
 * Region C resource centre.
 *
 * SAMPLE CONTENT: entries flagged `isPlaceholder: true` describe documents that
 * have not yet been supplied. They are rendered as "document pending" and are
 * deliberately not linked to a file, so no broken download is ever presented.
 *
 * To publish a real document: drop the file into `public/documents/`, set `href`
 * to the root-relative path (e.g. `/documents/parish-return-form.pdf`) and
 * remove the `isPlaceholder` flag.
 */
export const resources: Resource[] = [
  {
    id: 'res-parish-information-form',
    title: 'Parish Information Update Form',
    description:
      'Used by parish administrators to submit or update parish details for the Region C directory: address, service times, shepherd and contact information.',
    category: 'Forms',
    href: '',
    date: '2026-09-01',
    fileType: 'Form',
    audience: ['Parish Administrators', 'Shepherds'],
    isPlaceholder: true,
  },
  {
    id: 'res-monthly-parish-return',
    title: 'Monthly Parish Return',
    description:
      'The standard monthly return submitted by parishes to the Region C Secretariat.',
    category: 'Forms',
    href: '',
    date: '2026-09-01',
    fileType: 'PDF',
    audience: ['Parish Administrators'],
    isPlaceholder: true,
  },
  {
    id: 'res-regional-administrative-guidelines',
    title: 'Regional Administrative Guidelines',
    description:
      'Guidance on regional administrative procedure for parish leadership within Region C.',
    category: 'Policies',
    href: '',
    date: '2026-09-01',
    fileType: 'PDF',
    audience: ['Shepherds', 'Parish Administrators'],
    isPlaceholder: true,
  },
  {
    id: 'res-regional-calendar-notice',
    title: 'Region C Calendar of Events',
    description:
      'The ratified calendar of regional programmes for the year, issued by the Secretariat.',
    category: 'Official Notices',
    href: '',
    date: '2026-09-01',
    fileType: 'PDF',
    audience: ['All Members'],
    isPlaceholder: true,
  },
  {
    id: 'res-new-parish-support',
    title: 'Starting and Supporting a Parish',
    description:
      'Practical guidance for parishes being established within Region C, and for parishes seeking regional support.',
    category: 'Parish Support',
    href: '',
    date: '2026-09-01',
    fileType: 'PDF',
    audience: ['Shepherds'],
    isPlaceholder: true,
  },
  {
    id: 'res-workers-training',
    title: 'Departmental Workers Training Pack',
    description:
      'Training material for departmental workers serving in Region C parishes.',
    category: 'Training',
    href: '',
    date: '2026-09-01',
    fileType: 'PDF',
    audience: ['Departmental Workers', 'Youth Leaders'],
    isPlaceholder: true,
  },
  {
    id: 'res-parish-livestream-guide',
    title: 'Parish Livestream and Media Guide',
    description:
      'Recommended practice for parishes streaming services and managing media, prepared by the regional technology effort.',
    category: 'Technology',
    href: '',
    date: '2026-09-01',
    fileType: 'PDF',
    audience: ['Technical Personnel'],
    isPlaceholder: true,
  },
  {
    id: 'res-diocese-website',
    title: 'CCC USA Diocese Website',
    description:
      'The official website of the Celestial Church of Christ USA Diocese, the parent body of Region C.',
    category: 'Administration',
    href: siteConfig.dioceseUrl,
    date: '2026-09-01',
    fileType: 'Link',
    audience: ['All Members'],
  },
];

/** Resources newest first. */
export const orderedResources: Resource[] = [...resources].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

/** Categories that actually contain at least one resource, in canonical order. */
export function activeResourceCategories(): ResourceCategory[] {
  return resourceCategories.filter((category) =>
    resources.some((resource) => resource.category === category),
  );
}

export function getResourcesByCategory(category: ResourceCategory): Resource[] {
  return orderedResources.filter((resource) => resource.category === category);
}

/** A resource is downloadable only once a real file or link has been attached. */
export function isResourceAvailable(resource: Resource): boolean {
  return !resource.isPlaceholder && resource.href.length > 0;
}
