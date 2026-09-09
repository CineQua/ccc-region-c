import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/config/site';

interface PageMetadataInput {
  title: string;
  description: string;
  /** Root-relative path, e.g. `/leadership`. Used for the canonical URL. */
  path: string;
  /** Root-relative image path within `public/`, if the page has a specific one. */
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  noIndex?: boolean;
  /** Bypass the layout's `%s | CCC Region C` template (used by the homepage). */
  absoluteTitle?: boolean;
}

/**
 * Build page metadata with a canonical URL, Open Graph and Twitter cards.
 *
 * Every URL here is absolute and derives from `config/site.ts`, so canonical
 * links and social previews stay correct whether the site is served from a
 * subdomain or from beneath `/region-c`. Pages must use this rather than
 * hand-writing metadata objects.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  noIndex = false,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image ?? '/opengraph-image');

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${title} | ${siteConfig.shortName}`,
      description,
      url,
      siteName: siteConfig.title,
      locale: siteConfig.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.shortName}`,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Organisation structured data for the site root, expressing Region C as a
 * sub-organisation of the CCC USA Diocese.
 */
export function organisationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}#organization`,
    name: `${siteConfig.organisation} USA Diocese — ${siteConfig.region}`,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    description: siteConfig.description,
    parentOrganization: {
      '@type': 'Organization',
      name: siteConfig.diocese,
      url: siteConfig.dioceseUrl,
    },
  };
}

/** Breadcrumb structured data. `trail` is ordered root-first. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
