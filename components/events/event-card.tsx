import Link from 'next/link';
import type { RegionEvent } from '@/lib/types';
import { stateName } from '@/data/states';
import { dateParts, formatEventDate, isoDate } from '@/lib/format';
import { Badge } from '@/components/ui/primitives';
import { IconArrowRight, IconMapPin } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

export function EventCard({
  event,
  variant = 'standard',
}: {
  event: RegionEvent;
  variant?: 'standard' | 'compact';
}) {
  const { day, month, year } = dateParts(event.startDate);

  return (
    <article
      className={cn(
        'group relative flex gap-4 rounded-lg border border-celestial-100 bg-white shadow-card transition-shadow duration-200 hover:border-celestial-200 hover:shadow-card-hover focus-within:border-celestial-300',
        variant === 'compact' ? 'p-4' : 'p-5',
      )}
    >
      {/* Calendar block. The full date is in the <time> element below for
          assistive technology; this is a visual shorthand. */}
      <div
        aria-hidden="true"
        className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-celestial-800 text-white"
      >
        <span className="text-[0.625rem] font-semibold tracking-[0.1em] text-gold-300 uppercase">
          {month}
        </span>
        <span className="font-serif text-2xl leading-none font-semibold">{day}</span>
        <span className="mt-0.5 text-[0.625rem] text-celestial-300">{year}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {event.category ? <Badge>{event.category}</Badge> : null}
          {event.isPlaceholder ? <Badge tone="gold">Sample</Badge> : null}
        </div>

        <h3
          className={cn(
            'mt-2 text-celestial-900',
            variant === 'compact' ? 'text-base' : 'text-lg',
          )}
        >
          <Link href={`/events/${event.slug}`} className="before:absolute before:inset-0">
            {event.title}
          </Link>
        </h3>

        <time
          dateTime={isoDate(event.startDate)}
          className="mt-1.5 block text-sm font-medium text-celestial-600"
        >
          {formatEventDate(event)}
        </time>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-celestial-600">
          <IconMapPin className="h-4 w-4 shrink-0 text-celestial-400" />
          <span className="truncate">
            {event.location}
            {event.state ? ` · ${stateName(event.state)}` : ''}
          </span>
        </p>

        {variant === 'standard' ? (
          <>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-celestial-700">
              {event.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-celestial-700">
              Event details
              <IconArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
          </>
        ) : null}
      </div>
    </article>
  );
}
