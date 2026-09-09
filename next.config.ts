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
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

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
};

export default nextConfig;
