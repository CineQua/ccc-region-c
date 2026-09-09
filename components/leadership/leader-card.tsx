import Image from 'next/image';
import { leaderFullName, leaderInitials } from '@/data/leadership';
import type { Leader } from '@/lib/types';
import { Badge } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';

/**
 * Leadership card.
 *
 * Two presentations from one component: `principal` for the Regional Supervisor
 * and Deputy (larger portrait, office given prominence) and `standard` for the
 * wider executive.
 *
 * Headshots have not been supplied, so the portrait area falls back to a
 * monogram. When `leader.image` is populated the card switches to the photo with
 * no other change — see `data/leadership.ts`.
 */
export function LeaderCard({
  leader,
  variant = 'standard',
}: {
  leader: Leader;
  variant?: 'standard' | 'principal';
}) {
  const isPrincipal = variant === 'principal';

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border bg-white shadow-card transition-shadow duration-200 hover:shadow-card-hover',
        isPrincipal ? 'border-gold-200' : 'border-celestial-100',
      )}
    >
      <Portrait leader={leader} isPrincipal={isPrincipal} />

      <div className={cn('flex flex-1 flex-col p-5', isPrincipal && 'sm:p-6')}>
        {isPrincipal ? (
          <Badge tone="gold" className="mb-3 self-start">
            Regional Office
          </Badge>
        ) : null}

        <h3
          className={cn(
            'text-celestial-900',
            isPrincipal ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg',
          )}
        >
          {leaderFullName(leader)}
        </h3>

        <p
          className={cn(
            'mt-1.5 leading-snug font-medium text-celestial-600',
            isPrincipal ? 'text-base' : 'text-sm',
          )}
        >
          {leader.office}
        </p>

        {leader.parish || leader.state ? (
          <p className="mt-2 text-sm text-celestial-500">
            {[leader.parish, leader.state].filter(Boolean).join(' · ')}
          </p>
        ) : null}

        {leader.bio ? (
          <p className="mt-3 text-sm leading-relaxed text-celestial-700">{leader.bio}</p>
        ) : null}
      </div>
    </article>
  );
}

function Portrait({ leader, isPrincipal }: { leader: Leader; isPrincipal: boolean }) {
  const shared = cn(
    'relative w-full overflow-hidden bg-celestial-800',
    isPrincipal ? 'aspect-4/5 sm:aspect-3/4' : 'aspect-4/5',
  );

  if (leader.image) {
    return (
      <div className={shared}>
        <Image
          src={leader.image}
          alt={`${leaderFullName(leader)}, ${leader.office}`}
          fill
          sizes={isPrincipal ? '(min-width: 640px) 24rem, 100vw' : '(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw'}
          className="object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div className={shared}>
      {/* Monogram fallback: decorative, so the accessible name lives in the heading. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(44,101,196,0.55),transparent_65%)]"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            'flex items-center justify-center rounded-full border border-gold-400/60 font-serif font-semibold text-gold-200',
            isPrincipal ? 'h-24 w-24 text-3xl sm:h-28 sm:w-28 sm:text-4xl' : 'h-18 w-18 text-2xl',
          )}
        >
          {leaderInitials(leader)}
        </span>
        <span className="px-4 text-center text-[0.6875rem] tracking-[0.1em] text-celestial-300 uppercase">
          Photograph pending
        </span>
      </div>
    </div>
  );
}
