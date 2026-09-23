import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import {
  Badge,
  Breadcrumbs,
  JsonLd,
  PageHeader,
  PlaceholderNotice,
  SectionHeading,
} from '@/components/ui/primitives';
import { ArticleCard } from '@/components/news/article-card';
import { IconArrowRight } from '@/components/ui/icons';
import { buildMetadata } from '@/lib/metadata';
import { absoluteUrl, siteConfig } from '@/config/site';
import { getAllNews, getArticleBySlug, getOrderedNews } from '@/data/news';
import { formatDate, isoDate } from '@/lib/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getAllNews()).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return buildMetadata({
      title: 'Article not found',
      description: 'This announcement could not be found.',
      path: `/news/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${article.slug}`,
    type: 'article',
    publishedTime: isoDate(article.date),
    noIndex: article.isPlaceholder,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const related = (await getOrderedNews())
    .filter((item) => item.id !== article.id)
    .slice(0, 3);

  return (
    <>
      <PageHeader eyebrow={article.category} title={article.title}>
        <p className="text-celestial-100">
          <time dateTime={isoDate(article.date)}>{formatDate(article.date)}</time>
          <span aria-hidden="true" className="mx-2 text-celestial-400">
            ·
          </span>
          {article.author}
        </p>
      </PageHeader>

      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'News', path: '/news' },
          { name: article.title, path: `/news/${article.slug}` },
        ]}
      />

      <article className="bg-white py-12 sm:py-14">
        <Container width="narrow">
          {article.isPlaceholder ? (
            <PlaceholderNotice className="mb-8">
              This announcement was included with the initial build of the site to demonstrate the
              news system. It is not an official communication of Region C.
            </PlaceholderNotice>
          ) : null}

          <div className="mb-6 flex flex-wrap gap-2">
            <Badge>{article.category}</Badge>
          </div>

          {article.image ? (
            // A plain <img>, not next/image: the URL is pasted into a Google
            // Form and may point at any host, and next/image rejects hosts that
            // are not listed in `images.remotePatterns` — which would break the
            // page rather than merely skip the picture. See DEPLOYMENT.md.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="mb-8 aspect-video w-full rounded-lg border border-celestial-100 bg-celestial-50 object-cover"
            />
          ) : null}

          <div className="prose-region">
            <p className="font-serif text-xl leading-snug text-celestial-800">{article.excerpt}</p>
            {article.content.map((paragraph, index) => (
              // Paragraph order is fixed by the content author; index is a stable key here.
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 border-t border-celestial-100 pt-6">
            <ButtonLink href="/news" variant="secondary">
              <IconArrowRight className="h-4 w-4 rotate-180" />
              All news &amp; updates
            </ButtonLink>
          </div>
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-celestial-100 bg-celestial-50/50 py-12 sm:py-14">
          <Container width="wide">
            <SectionHeading eyebrow="More from Region C" title="Related announcements" as="h2" />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <ArticleCard article={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {!article.isPlaceholder ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            description: article.excerpt,
            datePublished: isoDate(article.date),
            author: { '@type': 'Organization', name: article.author },
            publisher: {
              '@type': 'Organization',
              name: `${siteConfig.organisation} USA Diocese — ${siteConfig.region}`,
            },
            mainEntityOfPage: absoluteUrl(`/news/${article.slug}`),
          }}
        />
      ) : null}
    </>
  );
}
