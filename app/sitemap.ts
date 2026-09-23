import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';
import { parishes } from '@/data/parishes';
import { states } from '@/data/states';
import { getAllEvents } from '@/data/events';
import { getAllNews } from '@/data/news';
import { ministries } from '@/data/ministries';

/**
 * Sitemap.
 *
 * Built from the data layer, so new parishes, states, events, articles and
 * ministries are included automatically. Sample records are excluded: they must
 * not be submitted to search engines as though they were real listings.
 */
// Generated once at build time; also keeps the route compatible with
// `output: 'export'` (see DEPLOYMENT.md).
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const events = await getAllEvents();
  const news = await getAllNews();

  const staticRoutes: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about/mission', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/leadership', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/parishes', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/states', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/ministries', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/events', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/events/calendar', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/news', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/resources', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...states.map((state) => ({
      url: absoluteUrl(`/states/${state.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...ministries.map((ministry) => ({
      url: absoluteUrl(`/ministries/${ministry.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...parishes
      .filter((parish) => !parish.isPlaceholder)
      .map((parish) => ({
        url: absoluteUrl(`/parishes/${parish.slug}`),
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ...events
      .filter((event) => !event.isPlaceholder)
      .map((event) => ({
        url: absoluteUrl(`/events/${event.slug}`),
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      })),
    ...news
      .filter((article) => !article.isPlaceholder)
      .map((article) => ({
        url: absoluteUrl(`/news/${article.slug}`),
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
  ];
}
