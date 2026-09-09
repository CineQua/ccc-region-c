/**
 * Central site configuration.
 *
 * Every absolute URL, deployment path and organisation-level string used by the
 * application resolves through this module. Nothing else in the codebase should
 * hardcode a domain or a leading path segment, so the site can be re-pointed at
 * `cccusadiocese.org/region-c`, `region-c.cccusadiocese.org` or a preview host
 * by changing environment variables alone. See DEPLOYMENT.md.
 */

/**
 * Deployment sub-path, e.g. `/region-c`. Empty string when the site is served
 * from the root of its host. Mirrors `basePath` in next.config.ts.
 *
 * Next.js rewrites `next/link` hrefs, `next/image` sources and files served from
 * `public/` automatically once `basePath` is set, so application code should keep
 * writing root-relative paths such as `/parishes`.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Absolute origin the site is served from, without a trailing slash. */
export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://region-c.cccusadiocese.org'
).replace(/\/$/, '');

/** Absolute canonical root of this site, including any deployment sub-path. */
export const siteUrl = `${siteOrigin}${basePath}`;

export const siteConfig = {
  name: 'CCC USA Diocese — Region C',
  shortName: 'CCC Region C',
  organisation: 'Celestial Church of Christ',
  diocese: 'Celestial Church of Christ USA Diocese',
  region: 'Region C',
  title: 'CCC Region C | Celestial Church of Christ USA Diocese',
  tagline: 'Connecting Parishes. Strengthening Fellowship. Advancing the Mission.',
  description:
    'The regional hub for Celestial Church of Christ USA Diocese — Region C: parish directory, regional leadership, ministries, events, announcements and administrative resources.',
  url: siteUrl,
  basePath,
  locale: 'en_US',
  dioceseUrl: 'https://cccusadiocese.org',
  dioceseName: 'CCC USA Diocese',
  /**
   * Placeholder regional contact details. Replace with the addresses and numbers
   * confirmed by the Region C Secretariat before launch.
   */
  contact: {
    email: 'info@region-c.cccusadiocese.org',
    secretariatEmail: 'secretariat@region-c.cccusadiocese.org',
    phone: '',
    isPlaceholder: true,
  },
  social: {
    facebook: '',
    youtube: '',
    instagram: '',
  },
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Build an absolute URL for metadata (canonical links, Open Graph, sitemap).
 * `next/link` and `next/image` must NOT use this — they apply `basePath` already.
 */
export function absoluteUrl(path = '/'): string {
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalised === '/' ? '' : normalised}`;
}
