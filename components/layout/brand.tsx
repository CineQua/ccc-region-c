import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * The Region C wordmark: the Celestial Church of Christ emblem beside the
 * regional name.
 *
 * The supplied artwork is drawn on an opaque white disc, so it is set in a
 * white circle with the gold ring the region uses elsewhere. That reads as a
 * deliberate badge on the dark footer as well as on the white header, and
 * avoids altering the official emblem to fake transparency.
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
          'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-white',
          onDark ? 'border-gold-400' : 'border-gold-500',
        )}
      >
        <Image
          src="/images/ccc-logo.png"
          alt=""
          width={44}
          height={44}
          className="h-full w-full object-contain"
        />
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
