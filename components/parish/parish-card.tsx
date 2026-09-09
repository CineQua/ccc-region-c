import Link from 'next/link';
import { stateName } from '@/data/states';
import type { Parish } from '@/lib/types';
import { Badge } from '@/components/ui/primitives';
import { IconArrowRight, IconChurch, IconMapPin } from '@/components/ui/icons';

/**
 * Parish summary card. The whole card is a link via a stretched overlay, so the
 * hit area is the full card on touch devices while the accessible name remains
 * the parish name alone.
 */
export function ParishCard({ parish }: { parish: Parish }) {
  return (
    <article className="group relative flex flex-col rounded-lg border border-celestial-100 bg-white p-5 shadow-card transition-shadow duration-200 hover:border-celestial-200 hover:shadow-card-hover focus-within:border-celestial-300">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-celestial-50 text-celestial-700"
        >
          <IconChurch className="h-5 w-5" />
        </span>
        {parish.isPlaceholder ? <Badge tone="gold">Sample</Badge> : null}
      </div>

      <h3 className="mt-4 text-lg text-celestial-900">
        <Link href={`/parishes/${parish.slug}`} className="before:absolute before:inset-0">
          {parish.name}
        </Link>
      </h3>

      <p className="mt-2 flex items-center gap-1.5 text-sm text-celestial-600">
        <IconMapPin className="h-4 w-4 shrink-0 text-celestial-400" />
        {parish.city}, {stateName(parish.state)}
      </p>

      {parish.shepherd ? (
        <p className="mt-1 text-sm text-celestial-600">Shepherd: {parish.shepherd}</p>
      ) : null}

      {parish.description ? (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-celestial-700">
          {parish.description}
        </p>
      ) : null}

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-celestial-700">
        View parish
        <IconArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}
