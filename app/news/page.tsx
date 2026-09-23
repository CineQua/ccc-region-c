import { Container } from '@/components/ui/container';
import {
  Breadcrumbs,
  EmptyState,
  PageHeader,
  PlaceholderNotice,
} from '@/components/ui/primitives';
import { ArticleCard } from '@/components/news/article-card';
import { buildMetadata } from '@/lib/metadata';
import { getLatestNews, newsIsSample } from '@/data/news';

export const metadata = buildMetadata({
  title: 'News & Updates',
  description:
    'Announcements from the Region C Secretariat, regional news and parish highlights from the Celestial Church of Christ USA Diocese — Region C.',
  path: '/news',
});

export default function NewsPage() {
  const articles = getLatestNews();

  return (
    <>
      <PageHeader
        eyebrow="News & Updates"
        title="Region C News"
        description="Announcements from the Secretariat, regional news, and highlights from parishes across the region."
      />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'News', path: '/news' },
        ]}
      />

      <section className="bg-white py-12 sm:py-14">
        <Container width="wide">
          {newsIsSample && articles.length > 0 ? (
            <PlaceholderNotice className="mb-6">
              The announcements below were included with the initial build to demonstrate the news
              system. They will be replaced by announcements issued by the Region C Secretariat.
            </PlaceholderNotice>
          ) : null}

          {articles.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <li key={article.id}>
                  <ArticleCard article={article} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No announcements yet"
              description="Regional announcements from the Region C Secretariat will be published here."
            />
          )}
        </Container>
      </section>
    </>
  );
}
