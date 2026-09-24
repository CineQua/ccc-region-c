import type { ExternalArticle } from '@/lib/types';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/primitives';
import { IconExternal } from '@/components/ui/icons';
import { formatDate, isoDate } from '@/lib/format';
import { fetchExternalNews } from '@/lib/external-news';

/**
 * News from other Celestial Church of Christ publications.
 *
 * Presented apart from Region C's own announcements and attributed on every
 * item, so nothing here can be mistaken for a statement of the Region. Each
 * headline links to the publisher's page rather than to anything on this site.
 *
 * Renders nothing at all when no source responds: this is supplementary, and an
 * empty space reads better than an apology.
 */
export async function ExternalNewsSection() {
  const { usa, worldwide } = await fetchExternalNews();
  if (usa.length === 0 && worldwide.length === 0) return null;

  const sources = [...new Map([...usa, ...worldwide].map((a) => [a.sourceUrl, a])).values()];

  return (
    <section
      aria-labelledby="wider-church-heading"
      className="border-t border-celestial-100 bg-celestial-50/50 py-12 sm:py-14"
    >
      <Container width="wide">
        <SectionHeading
          eyebrow="Beyond Region C"
          title="From the wider Church"
          description="Reporting from independent Celestial Church of Christ publications. These are not Region C announcements — each headline opens the publisher's own page."
          as="h2"
        />

        {usa.length > 0 ? (
          <>
            <h3 className="mt-2 mb-3 text-sm font-semibold tracking-[0.08em] text-celestial-500 uppercase">
              Celestial Church of Christ in the USA
            </h3>
            <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {usa.map((article) => (
                <ExternalArticleItem key={article.id} article={article} />
              ))}
            </ul>
          </>
        ) : null}

        {worldwide.length > 0 ? (
          <>
            <h3 className="mt-8 mb-3 text-sm font-semibold tracking-[0.08em] text-celestial-500 uppercase">
              Around the Church
            </h3>
            <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {worldwide.map((article) => (
                <ExternalArticleItem key={article.id} article={article} />
              ))}
            </ul>
          </>
        ) : null}

        <p className="mt-8 text-sm leading-relaxed text-celestial-600">
          Headlines and summaries are those of the publisher, shown here under their own byline.
          {sources.map((source) => (
            <span key={source.sourceUrl}>
              {' '}
              Visit{' '}
              <a
                href={source.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-celestial-800 underline-offset-4 hover:underline"
              >
                {source.source}
              </a>
              .
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}

function ExternalArticleItem({ article }: { article: ExternalArticle }) {
  return (
    <li>
      <article className="group relative h-full rounded-lg border border-celestial-100 bg-white p-4 transition-colors hover:border-celestial-200">
        <div className="flex items-center gap-2 text-xs text-celestial-500">
          <span className="font-medium text-celestial-700">{article.source}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={isoDate(article.date)}>{formatDate(article.date)}</time>
        </div>

        <h4 className="mt-1.5 text-base leading-snug font-medium text-celestial-900">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="before:absolute before:inset-0"
          >
            {article.title}
            <span className="sr-only"> (opens on {article.source})</span>
          </a>
        </h4>

        {article.excerpt ? (
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-celestial-600">
            {article.excerpt}
          </p>
        ) : null}

        <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-celestial-700">
          Read on {article.source}
          <IconExternal className="h-3.5 w-3.5" />
        </span>
      </article>
    </li>
  );
}
