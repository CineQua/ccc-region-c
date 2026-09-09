import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';

// Generated once at build time; also keeps the route compatible with
// `output: 'export'` (see DEPLOYMENT.md).
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
