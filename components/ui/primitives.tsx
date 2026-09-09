import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ Card -- */

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds the lift/border treatment used when the whole card is a link. */
  interactive?: boolean;
}

export function Card({ children, className, interactive = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-celestial-100 bg-white shadow-card',
        interactive &&
          'transition-shadow duration-200 hover:border-celestial-200 hover:shadow-card-hover focus-within:border-celestial-300',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- Badge ---- */

type BadgeTone = 'navy' | 'gold' | 'neutral' | 'onDark';

const badgeTones: Record<BadgeTone, string> = {
  navy: 'bg-celestial-50 text-celestial-700 ring-celestial-100',
  gold: 'bg-gold-50 text-gold-700 ring-gold-200',
  neutral: 'bg-slate-50 text-slate-600 ring-slate-200',
  onDark: 'bg-white/10 text-celestial-100 ring-white/15',
};

export function Badge({
  children,
  tone = 'navy',
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------- SectionHeading --- */

interface SectionHeadingProps {
  /** Small gold-lettered kicker above the heading. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Rendered on the opposite side on wide screens — usually a "view all" link. */
  action?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  /** Heading level, so pages keep a correct h1 → h2 → h3 hierarchy. */
  as?: 'h2' | 'h3';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  tone = 'light',
  as: Heading = 'h2',
  className,
}: SectionHeadingProps) {
  const centred = align === 'center';
  return (
    <div
      className={cn(
        'mb-8 gap-4 sm:mb-10',
        centred ? 'flex flex-col items-center text-center' : 'sm:flex sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn(centred ? 'max-w-2xl' : 'max-w-2xl')}>
        {eyebrow ? (
          <p
            className={cn(
              'mb-2 text-xs font-semibold tracking-[0.14em] uppercase',
              tone === 'dark' ? 'text-gold-300' : 'text-gold-600',
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <Heading
          className={cn(
            'text-2xl sm:text-3xl',
            tone === 'dark' ? 'text-white' : 'text-celestial-900',
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p
            className={cn(
              'mt-3 text-base leading-relaxed',
              tone === 'dark' ? 'text-celestial-100' : 'text-celestial-700',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className={cn('mt-4 shrink-0 sm:mt-0')}>{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------ PageHeader -- */

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

/**
 * The navy masthead that opens every interior page. Carries the page h1.
 */
export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-celestial-900">
      <CelestialField />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-gold-300 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-celestial-100 sm:text-lg">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </div>
  );
}

/**
 * Decorative celestial wash: a soft radial glow and a sparse star field.
 * Purely ornamental, so it is hidden from assistive technology.
 */
export function CelestialField({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(44,101,196,0.35),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.14),transparent_55%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.5]" aria-hidden="true">
        <defs>
          <pattern id="region-c-stars" width="140" height="140" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="28" r="1" fill="white" opacity="0.55" />
            <circle cx="96" cy="14" r="0.7" fill="white" opacity="0.4" />
            <circle cx="62" cy="76" r="0.9" fill="#E9CB63" opacity="0.5" />
            <circle cx="122" cy="104" r="0.7" fill="white" opacity="0.35" />
            <circle cx="34" cy="118" r="0.6" fill="white" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#region-c-stars)" />
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------- Breadcrumbs -- */

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-celestial-100 bg-celestial-50/60">
      <ol className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-5 py-3 text-sm sm:px-6 lg:px-8">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-medium text-celestial-800" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.path}
                    className="text-celestial-600 underline-offset-4 hover:text-celestial-800 hover:underline"
                  >
                    {crumb.name}
                  </Link>
                  <span aria-hidden="true" className="text-celestial-300">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------------------------------------------------------------- Notice -- */

/**
 * Flags content that is sample data awaiting real information from the
 * Secretariat. Used wherever placeholder records are displayed, so no visitor
 * mistakes example content for verified organisational fact.
 */
export function PlaceholderNotice({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-gold-200 bg-gold-50 px-4 py-3.5 text-sm text-gold-700',
        className,
      )}
    >
      <svg
        className="mt-0.5 h-4.5 w-4.5 shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a.9.9 0 00-.9.95l.2 3.8a.7.7 0 001.4 0l.2-3.8A.9.9 0 0010 6zm0 7a1 1 0 100 2 1 1 0 000-2z"
          clipRule="evenodd"
        />
      </svg>
      <p className="leading-relaxed">
        <span className="font-semibold">Sample content. </span>
        {children}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ EmptyState -- */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-celestial-200 bg-celestial-50/50 px-6 py-14 text-center">
      <h3 className="text-lg text-celestial-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-celestial-600">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

/* --------------------------------------------------------------- JsonLd ---- */

/** Emits a structured-data script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is authored in this repository, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
