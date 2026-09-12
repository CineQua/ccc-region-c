import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'light';
type Size = 'sm' | 'md' | 'lg';

/*
 * Touch targets: `md` and `lg` clear the 44px minimum recommended for mobile.
 * `sm` is reserved for inline controls that sit beside larger targets.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-celestial-800 text-white hover:bg-celestial-700 active:bg-celestial-900',
  secondary:
    'border border-celestial-200 bg-white text-celestial-800 hover:border-celestial-300 hover:bg-celestial-50',
  ghost: 'text-celestial-800 hover:bg-celestial-50',
  // For placement on navy surfaces; gold border, white text.
  onDark: 'border border-gold-400/70 text-white hover:bg-white/10 active:bg-white/15',
  // The solid counterpart to `onDark`: a white button on a navy surface. It is a
  // variant rather than a className override because `cn` does not resolve
  // conflicts — overriding `primary` leaves both `text-white` and the darker
  // text class on the element, and stylesheet order, not call order, picks the
  // winner.
  light: 'bg-white text-celestial-900 hover:bg-celestial-50 active:bg-celestial-100',
};

const sizes: Record<Size, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-5 text-sm sm:text-base',
  lg: 'min-h-12 px-6 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonLinkProps = CommonProps & {
  href: string;
  /** Renders an anchor with the correct rel/target for off-site destinations. */
  external?: boolean;
};

export function ButtonLink({
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  // next/link applies basePath automatically — hrefs stay root-relative.
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

type ButtonProps = CommonProps & ComponentPropsWithoutRef<'button'>;

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
