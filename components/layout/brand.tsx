import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * The Region C wordmark.
 *
 * A typographic mark rather than an image: it stays crisp at any size, needs no
 * network request, and does not pre-empt any official Diocese artwork that may
 * later be supplied. The "C" roundel carries the gold accent.
 */
export function Brand({
  tone = 'light',
  className,
  href = '/',
}: {
  tone?: 'light' | 'dark';
  className?: string;
  href?: string;
}) {
  const onDark = tone === 'dark';

  return (
    <Link
      href={href}
      className={cn('group flex items-center gap-3 rounded-sm', className)}
      aria-label="Celestial Church of Christ USA Diocese, Region C — home"
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-serif text-lg font-semibold transition-colors',
          onDark
            ? 'border-gold-400 bg-celestial-800 text-gold-300'
            : 'border-gold-500 bg-celestial-800 text-gold-300',
        )}
      >
        C
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={cn(
            'font-serif text-base font-semibold tracking-tight sm:text-lg',
            onDark ? 'text-white' : 'text-celestial-900',
          )}
        >
          CCC Region C
        </span>
        <span
          className={cn(
            'truncate text-[0.6875rem] tracking-[0.08em] uppercase sm:text-xs',
            onDark ? 'text-celestial-200' : 'text-celestial-600',
          )}
        >
          USA Diocese
        </span>
      </span>
    </Link>
  );
}
