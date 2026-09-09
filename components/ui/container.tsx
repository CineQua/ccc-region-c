import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** `wide` for full-bleed grids, `narrow` for long-form reading measure. */
  width?: 'default' | 'wide' | 'narrow';
  as?: ElementType;
}

const widths = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
} as const;

/**
 * The single horizontal gutter used site-wide. Every page section wraps its
 * content in one of these so that column edges align down the whole page.
 */
export function Container({ children, className, width = 'default', as: Tag = 'div' }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', widths[width], className)}>{children}</Tag>;
}
