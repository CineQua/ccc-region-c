'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { Brand } from './brand';
import { primaryNav, type NavSection } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { IconChevronDown, IconClose, IconExternal, IconMenu, IconSearch } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

/**
 * Site header.
 *
 * Desktop dropdowns are CSS-only (`group-hover` plus `focus-within`), so no
 * JavaScript runs for pointer or keyboard navigation. The only client state is
 * the mobile drawer and the active-path highlight.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerPath, setDrawerPath] = useState(pathname);
  const drawerId = useId();

  // Close the drawer whenever the route changes, otherwise it survives the
  // navigation. Adjusting state during render (rather than in an effect) lets
  // React discard the open drawer before it is committed, so there is no frame
  // in which the new page renders behind an open menu.
  if (pathname !== drawerPath) {
    setDrawerPath(pathname);
    setMobileOpen(false);
  }

  // Prevent the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50">
      {/* Diocese strip — keeps the parent-body relationship visible on every page. */}
      <div className="bg-celestial-950 text-celestial-200">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-2 text-xs sm:px-6 lg:px-8">
          <p className="truncate">
            <span className="hidden sm:inline">Celestial Church of Christ · </span>
            USA Diocese — Region C
          </p>
          <a
            href={siteConfig.dioceseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 font-medium text-gold-300 underline-offset-4 hover:underline"
          >
            <span className="hidden sm:inline">Visit the </span>CCC USA Diocese
            <IconExternal className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="border-b border-celestial-100 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-6 lg:px-8">
          <Brand />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {primaryNav.map((item) => (
                <DesktopNavItem key={item.href} item={item} active={isActive(item.href)} />
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/parishes"
              className="hidden items-center gap-2 rounded-md bg-celestial-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-celestial-700 lg:inline-flex"
            >
              <IconSearch className="h-4 w-4" />
              Find a Parish
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls={drawerId}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-celestial-200 text-celestial-800 lg:hidden"
            >
              <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer
        id={drawerId}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isActive={isActive}
      />
    </header>
  );
}

function DesktopNavItem({ item, active }: { item: NavSection; active: boolean }) {
  const hasChildren = Boolean(item.children?.length);

  return (
    <li className={cn('relative', hasChildren && 'group')}>
      <Link
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          active
            ? 'text-celestial-900'
            : 'text-celestial-700 hover:bg-celestial-50 hover:text-celestial-900',
        )}
      >
        {item.label}
        {hasChildren ? (
          <IconChevronDown className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-180" />
        ) : null}
        {active ? (
          <span
            aria-hidden="true"
            className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold-500"
          />
        ) : null}
      </Link>

      {hasChildren ? (
        <div
          className={cn(
            'invisible absolute top-full left-0 z-10 w-72 pt-2 opacity-0 transition-[opacity,visibility] duration-150',
            'group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
          )}
        >
          <ul className="overflow-hidden rounded-lg border border-celestial-100 bg-white p-1.5 shadow-card-hover">
            {item.children?.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="block rounded-md px-3 py-2.5 transition-colors hover:bg-celestial-50"
                >
                  <span className="block text-sm font-medium text-celestial-900">{child.label}</span>
                  {child.description ? (
                    <span className="mt-0.5 block text-xs leading-snug text-celestial-600">
                      {child.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function MobileDrawer({
  id,
  open,
  onClose,
  isActive,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  return (
    <div
      id={id}
      className={cn(
        'fixed inset-0 top-0 z-50 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          'absolute inset-0 bg-celestial-950/50 transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal={open}
        aria-label="Site menu"
      >
        <div className="flex items-center justify-between border-b border-celestial-100 px-5 py-3">
          <Brand />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-celestial-200 text-celestial-800"
          >
            <span className="sr-only">Close menu</span>
            <IconClose className="h-6 w-6" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <ul className="space-y-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'block rounded-md px-3 py-3 text-base font-medium',
                    isActive(item.href)
                      ? 'bg-celestial-50 text-celestial-900'
                      : 'text-celestial-800 hover:bg-celestial-50',
                  )}
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="mt-0.5 mb-2 ml-3 space-y-0.5 border-l border-celestial-100 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-md px-3 py-2.5 text-sm text-celestial-600 hover:bg-celestial-50 hover:text-celestial-900"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-celestial-100 px-5 py-4">
          <Link
            href="/parishes"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-celestial-800 px-5 text-base font-medium text-white"
          >
            <IconSearch className="h-4.5 w-4.5" />
            Find a Parish
          </Link>
          <a
            href={siteConfig.dioceseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-1.5 text-sm text-celestial-600"
          >
            CCC USA Diocese
            <IconExternal className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
