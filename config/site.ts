/**
 * Central site configuration.
 *
 * Every absolute URL, deployment path and organisation-level string used by the
 * application resolves through this module. Nothing else in the codebase should
 * hardcode a domain or a leading path segment, so the site can be re-pointed at
 * `cccusadiocese.org/region-c`, `regionc.cccusadiocese.org` or a preview host
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
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').trim().replace(/\/$/, '');

/**
 * Absolute origin the site is served from, without a trailing slash.
 *
 * Hosting dashboards let a variable be saved with an empty value, which is not
 * the same as unset: `??` would pass the empty string through and `new URL('')`
 * then fails the build. A blank value therefore falls back to the default, and
 * a bare hostname (`regionc.cccusadiocese.org`) is given its missing scheme.
 */
export const siteOrigin = normaliseOrigin(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://regionc.cccusadiocese.org',
);

function normaliseOrigin(value: string): string {
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not a valid URL: "${value}". Expected e.g. https://regionc.cccusadiocese.org`,
    );
  }
}

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
   * Regional contact details.
   *
   * All confirmed by the Secretariat (2026-10-02) and all reachable. Both
   * addresses are on hosted mailboxes rather than on regionc.cccusadiocese.org,
   * which resolves to Vercel and has no MX records — mail sent to that
   * subdomain bounces, so nothing here should use it until it has mail records.
   *
   * No postal address has been supplied; the contact page simply omits one
   * rather than showing a placeholder.
   */
  contact: {
    email: 'regionc.cccusa@gmail.com',
    secretariatEmail: 'ccc_usa.regionc@hotmail.com',
    phone: '1-310-422-0694',
    isPlaceholder: false,
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
