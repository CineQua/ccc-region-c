import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { JsonLd } from '@/components/ui/primitives';
import { organisationJsonLd } from '@/lib/metadata';
import { siteConfig, siteUrl } from '@/config/site';
import { confirmedStates } from '@/data/states';

/*
 * Typography: a transitional serif for headings gives the ecclesiastical,
 * dignified register the region asked for; a neutral grotesque keeps body copy
 * and interface text contemporary and highly legible on small screens.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  // Resolves every relative metadata URL, including beneath a basePath.
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.title,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  keywords: [
    'Celestial Church of Christ',
    'CCC USA Diocese',
    'Region C',
    ...confirmedStates.map((state) => `CCC parishes ${state.name}`),
  ],
};

export const viewport: Viewport = {
  themeColor: '#0a1633',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-celestial-900 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={organisationJsonLd()} />
      </body>
    </html>
  );
}
