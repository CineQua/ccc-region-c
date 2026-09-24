import type { NextConfig } from 'next';

/**
 * Deployment configuration.
 *
 * `basePath` is read from the environment so the same source can be served from
 * the root of a subdomain (`regionc.cccusadiocese.org`) or from beneath a path on
 * the Diocese domain (`cccusadiocese.org/region-c`) without a code change. See
 * DEPLOYMENT.md for what each arrangement requires.
 *
 * Setting `basePath` makes Next.js prefix every `next/link` href, `next/image`
 * source and `public/` asset automatically. Application code therefore keeps
 * writing root-relative paths such as `/parishes` — do not prefix them by hand.
 *
 * `assetPrefix` is tied to the same value so static chunks resolve correctly; it
 * can be pointed at a CDN later without touching anything else.
 */
// Trimmed so a value saved as blank or with stray whitespace in a hosting
// dashboard means "no sub-path". Mirrors `basePath` in config/site.ts.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').trim().replace(/\/$/, '');

/**
 * Static-export mode, for hosts that cannot run Node (GitHub Pages and similar).
 * Enable with `NEXT_OUTPUT=export npm run build`, or `npm run build:static`.
 *
 * Every route in this site is statically prerenderable, so the export is
 * complete — but it disables the `next/image` optimiser, which matters once real
 * parish and leadership photographs are added. A Node-capable host (Vercel,
 * Netlify) is preferred for that reason; see DEPLOYMENT.md.
 */
const isStaticExport = process.env.NEXT_OUTPUT === 'export';

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: 'export' as const } : {}),

  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,

  // Emits a trailing-slash-free canonical form, matching the metadata helper.
  trailingSlash: false,

  images: {
    // The optimiser requires a server; a static export must ship images as-is.
    unoptimized: isStaticExport,
    // Parish and leadership photographs will be served from `public/` initially.
    // Add remote patterns here if images later come from a CMS or object store.
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },

  /**
   * Short, permanent entry points for the admin tools.
   *
   * `/approve` forwards to the news approval web app, so the thing to bookmark
   * on a phone is a memorable address on this site rather than a 120-character
   * Apps Script URL. It also means the target can change — creating a new Apps
   * Script deployment issues a new URL — without anyone re-bookmarking.
   *
   * The target is read from the environment rather than written here, so the
   * address is not published in this repository. Unset, the route simply does
   * not exist. It is a redirect to a page behind Google sign-in, not a secret.
   *
   * Redirects are not supported by `output: 'export'`, so this is inert in a
   * static export — as with the refresh endpoint. See DEPLOYMENT.md.
   */
  // Omitted entirely under `output: 'export'`: Next warns on the presence of
  // the key, not on what it returns, so returning [] there still complains.
  ...(isStaticExport
    ? {}
    : {
        async redirects() {
          const approveUrl = process.env.APPROVE_URL?.trim();
          if (!approveUrl) return [];

          return [
            {
              source: '/approve',
              destination: approveUrl,
              // The Apps Script URL can change; do not let browsers cache it.
              permanent: false,
            },
          ];
        },
      }),
};

export default nextConfig;
