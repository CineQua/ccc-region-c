import type { NewsArticle, NewsCategory } from '@/lib/types';

export const newsCategories: NewsCategory[] = [
  'Region News',
  'Parish News',
  'Diocese',
  'Evangelism',
  'Youth',
  'Events',
];

/**
 * Region C news and announcements.
 *
 * SAMPLE CONTENT: the articles below demonstrate the news system and are flagged
 * with `isPlaceholder: true`. They deliberately make no factual claims about
 * events that have taken place. Replace with announcements issued by the
 * Region C Secretariat.
 */
export const news: NewsArticle[] = [
  {
    id: 'news-welcome',
    title: 'Welcome to the new Region C website',
    slug: 'welcome-to-the-new-region-c-website',
    date: '2026-09-01',
    author: 'Region C Secretariat',
    category: 'Region News',
    excerpt:
      'Region C now has a dedicated digital home for parish information, regional announcements, events and administrative resources.',
    content: [
      'Region C of the Celestial Church of Christ USA Diocese now has a dedicated website serving parishes, shepherds, departmental workers and members across the region.',
      'The site brings the parish directory, regional leadership, ministry departments, the events calendar and administrative resources together in one place, accessible from any phone, tablet or computer.',
      'Parishes are invited to submit their details — location, service times, shepherd and contact information — so that the directory can be completed and published.',
      'This announcement is placeholder content included with the initial build of the site and should be replaced by the Secretariat before launch.',
    ],
    isPlaceholder: true,
  },
  {
    id: 'news-parish-directory-call',
    title: 'Parishes invited to submit directory information',
    slug: 'parishes-invited-to-submit-directory-information',
    date: '2026-08-20',
    author: 'Region C Secretariat',
    category: 'Parish News',
    excerpt:
      'Every Region C parish is asked to provide its address, service times and contact details for inclusion in the regional directory.',
    content: [
      'The parish directory is the foundation of the Region C website. Once complete, it will power parish search, state-level browsing, an interactive regional map and regional statistics.',
      'Parish administrators are asked to supply the parish name, full address, city and state, the name of the shepherd, a contact telephone number and e-mail address, service times, and a photograph of the parish where one is available.',
      'This announcement is placeholder content included with the initial build of the site and should be replaced by the Secretariat before launch.',
    ],
    isPlaceholder: true,
  },
  {
    id: 'news-leadership-published',
    title: 'Region C Executive listing now published online',
    slug: 'region-c-executive-listing-now-published-online',
    date: '2026-08-05',
    author: 'Region C Secretariat',
    category: 'Region News',
    excerpt:
      'The Region C Executive Members and their offices are now listed on the regional leadership page.',
    content: [
      'The offices of the Region C Executive are now published on the regional leadership page, giving parishes and members a clear reference for regional administration.',
      'Individual photographs and biographies will be added as they are supplied to the Secretariat.',
      'This announcement is placeholder content included with the initial build of the site and should be replaced by the Secretariat before launch.',
    ],
    isPlaceholder: true,
  },
];

/** True while the newsroom contains only sample records. Drives the UI notice. */
export const newsIsSample: boolean =
  news.length > 0 && news.every((article) => article.isPlaceholder);

/** Articles newest first. */
export const orderedNews: NewsArticle[] = [...news].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function getLatestNews(limit?: number): NewsArticle[] {
  return typeof limit === 'number' ? orderedNews.slice(0, limit) : orderedNews;
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return news.find((article) => article.slug === slug);
}

export function getNewsByCategory(category: NewsCategory): NewsArticle[] {
  return orderedNews.filter((article) => article.category === category);
}

/** Categories that actually have at least one article, in canonical order. */
export function activeNewsCategories(): NewsCategory[] {
  return newsCategories.filter((category) => news.some((article) => article.category === category));
}
