import type { NextConfig } from 'next';

/**
 * Deployment configuration.
 *
 * `basePath` is read from the environment so the same build output can be served
 * from the root of a subdomain (`region-c.cccusadiocese.org`) or from beneath a
 * path on the Diocese domain (`cccusadiocese.org/region-c`) without a code
 * change. See DEPLOYMENT.md for what each arrangement requires.
 *
 * Setting `basePath` makes Next.js prefix every `next/link` href, `next/image`
 * source and `public/` asset automatically. Application code therefore keeps
 * writing root-relative paths such as `/parishes` — do not prefix them by hand.
 *
 * `assetPrefix` is tied to the same value so static chunks resolve correctly; it
 * can be pointed at a CDN later without touching anything else.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,

  // Emits a trailing-slash-free canonical form, matching the metadata helper.
  trailingSlash: false,

  images: {
    // Parish and leadership photographs will be served from `public/` initially.
    // Add remote patterns here if images later come from a CMS or object store.
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
