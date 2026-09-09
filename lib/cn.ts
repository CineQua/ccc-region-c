/**
 * Join class names, dropping falsy values.
 *
 * Deliberately dependency-free: the component set is small enough that the
 * conflict-resolution behaviour of `tailwind-merge` is not worth the bytes.
 * Callers should not pass competing utilities for the same property.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
