import Link from 'next/link';
import { Brand } from './brand';
import { footerNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { IconExternal, IconMail } from '@/components/ui/icons';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-celestial-950 text-celestial-200">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Brand tone="dark" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-celestial-300">
              {siteConfig.tagline}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-celestial-400">
              Region C serves Celestial Church of Christ parishes across the western United States
              under the {siteConfig.diocese}.
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="mt-5 inline-flex items-center gap-2 text-sm text-gold-300 underline-offset-4 hover:underline"
            >
              <IconMail className="h-4 w-4" />
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-gold-300 uppercase">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-celestial-200 underline-offset-4 hover:text-white hover:underline"
                        >
                          {link.label}
                          <IconExternal className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-celestial-200 underline-offset-4 hover:text-white hover:underline"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-celestial-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.organisation} USA Diocese — {siteConfig.region}. All rights
            reserved.
          </p>
          <p>
            A region of the{' '}
            <a
              href={siteConfig.dioceseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-celestial-200 underline-offset-4 hover:text-white hover:underline"
            >
              {siteConfig.diocese}
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
