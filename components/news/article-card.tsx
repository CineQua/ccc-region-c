import Link from 'next/link';
import type { NewsArticle } from '@/lib/types';
import { formatDate, isoDate } from '@/lib/format';
import { Badge } from '@/components/ui/primitives';
import { IconArrowRight } from '@/components/ui/icons';

export function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <article className="group relative flex flex-col rounded-lg border border-celestial-100 bg-white p-5 shadow-card transition-shadow duration-200 hover:border-celestial-200 hover:shadow-card-hover focus-within:border-celestial-300">
      {article.image ? (
        // Plain <img> rather than next/image — the URL comes from a form and
        // may be on any host. See the note on the article page.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="mb-4 aspect-video w-full rounded-md border border-celestial-100 bg-celestial-50 object-cover"
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Badge>{article.category}</Badge>
        {article.isPlaceholder ? <Badge tone="gold">Sample</Badge> : null}
      </div>

      <h3 className="mt-3 text-lg text-celestial-900">
        <Link href={`/news/${article.slug}`} className="before:absolute before:inset-0">
          {article.title}
        </Link>
      </h3>

      <time dateTime={isoDate(article.date)} className="mt-1.5 text-sm text-celestial-500">
        {formatDate(article.date)}
      </time>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-celestial-700">
        {article.excerpt}
      </p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-celestial-700">
        Read more
        <IconArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}
