import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import {
  Breadcrumbs,
  Card,
  JsonLd,
  PageHeader,
  PlaceholderNotice,
} from '@/components/ui/primitives';
import {
  IconArrowRight,
  IconClock,
  IconExternal,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUsers,
} from '@/components/ui/icons';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/metadata';
import { absoluteUrl } from '@/config/site';
import {
  getParishBySlug,
  getParishesByState,
  parishes,
  parishLocation,
  parishSocialLinks,
} from '@/data/parishes';
import { getStateByCode, stateName } from '@/data/states';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renders every parish page at build time. */
export function generateStaticParams() {
  return parishes.map((parish) => ({ slug: parish.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const parish = getParishBySlug(slug);

  if (!parish) {
    return buildMetadata({
      title: 'Parish not found',
      description: 'This parish could not be found in the Region C directory.',
      path: `/parishes/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: parish.name,
    description:
      parish.description ??
      `${parish.name} is a Celestial Church of Christ parish in ${parishLocation(parish)}, within Region C of the CCC USA Diocese.`,
    path: `/parishes/${parish.slug}`,
    // Sample records must never be indexed as though they were real parishes.
    noIndex: parish.isPlaceholder,
  });
}

export default async function ParishPage({ params }: PageProps) {
  const { slug } = await params;
  const parish = getParishBySlug(slug);

  if (!parish) notFound();

  const state = getStateByCode(parish.state);
  const siblings = getParishesByState(parish.state).filter((p) => p.id !== parish.id);
  const social = parishSocialLinks(parish);

  return (
    <>
      <PageHeader
        eyebrow={state ? `${state.name} · Region C` : 'Region C'}
        title={parish.name}
        description={parish.description}
      >
        <p className="flex items-center gap-2 text-celestial-100">
          <IconMapPin className="h-5 w-5 text-gold-300" aria-hidden="true" />
          {parish.address ?? parishLocation(parish)}
        </p>
      </PageHeader>

      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Parishes', path: '/parishes' },
          { name: parish.name, path: `/parishes/${parish.slug}` },
        ]}
      />

      <section className="bg-white py-12 sm:py-14">
        <Container width="wide">
          {parish.isPlaceholder ? (
            <PlaceholderNotice className="mb-8">
              This is an example parish record included with the initial build of the site. It does
              not describe a real parish. Verified parish details will replace it once supplied to
              the Region C Secretariat.
            </PlaceholderNotice>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="rule-gold text-xl text-celestial-900">Service times</h2>
              {parish.serviceTimes?.length ? (
                <ul className="mt-5 divide-y divide-celestial-100 overflow-hidden rounded-lg border border-celestial-100">
                  {parish.serviceTimes.map((service) => (
                    <li
                      key={`${service.label}-${service.day}`}
                      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-medium text-celestial-900">
                        <IconClock className="h-4 w-4 text-celestial-400" aria-hidden="true" />
                        {service.label}
                      </span>
                      <span className="text-sm text-celestial-600">
                        {service.day} · {service.time}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-lg border border-dashed border-celestial-200 bg-celestial-50/50 px-4 py-5 text-sm text-celestial-600">
                  Service times for this parish have not yet been supplied. Please contact the parish
                  or the Region C Secretariat.
                </p>
              )}

              {siblings.length > 0 ? (
                <div className="mt-12">
                  <h2 className="rule-gold text-xl text-celestial-900">
                    Other parishes in {stateName(parish.state)}
                  </h2>
                  <ul className="mt-5 space-y-2">
                    {siblings.map((sibling) => (
                      <li key={sibling.id}>
                        <Link
                          href={`/parishes/${sibling.slug}`}
                          className="flex min-h-12 items-center justify-between gap-3 rounded-md border border-celestial-100 px-4 text-sm font-medium text-celestial-800 transition-colors hover:border-celestial-200 hover:bg-celestial-50"
                        >
                          <span>
                            {sibling.name}
                            <span className="ml-2 font-normal text-celestial-500">
                              {sibling.city}
                            </span>
                          </span>
                          <IconArrowRight className="h-4 w-4 shrink-0 text-celestial-400" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <aside className="space-y-4">
              <Card className="p-6">
                <h2 className="text-base font-semibold text-celestial-900">Parish details</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-celestial-500">Location</dt>
                    <dd className="mt-1 text-celestial-900">
                      {parish.address ? (
                        <>
                          {parish.address}
                          <br />
                        </>
                      ) : null}
                      {parishLocation(parish)}
                    </dd>
                  </div>

                  {parish.shepherd ? (
                    <div>
                      <dt className="text-celestial-500">Shepherd</dt>
                      <dd className="mt-1 flex items-center gap-2 text-celestial-900">
                        <IconUsers className="h-4 w-4 text-celestial-400" aria-hidden="true" />
                        {parish.shepherd}
                      </dd>
                    </div>
                  ) : null}

                  {parish.phone ? (
                    <div>
                      <dt className="text-celestial-500">Telephone</dt>
                      <dd className="mt-1">
                        <a
                          href={`tel:${parish.phone.replace(/[^\d+]/g, '')}`}
                          className="flex items-center gap-2 text-celestial-800 underline-offset-4 hover:underline"
                        >
                          <IconPhone className="h-4 w-4 text-celestial-400" aria-hidden="true" />
                          {parish.phone}
                        </a>
                      </dd>
                    </div>
                  ) : null}

                  {parish.email ? (
                    <div>
                      <dt className="text-celestial-500">E-mail</dt>
                      <dd className="mt-1">
                        <a
                          href={`mailto:${parish.email}`}
                          className="flex items-center gap-2 break-all text-celestial-800 underline-offset-4 hover:underline"
                        >
                          <IconMail className="h-4 w-4 shrink-0 text-celestial-400" aria-hidden="true" />
                          {parish.email}
                        </a>
                      </dd>
                    </div>
                  ) : null}

                  {parish.website ? (
                    <div>
                      <dt className="text-celestial-500">Website</dt>
                      <dd className="mt-1">
                        <a
                          href={parish.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 break-all text-celestial-800 underline-offset-4 hover:underline"
                        >
                          <IconExternal className="h-4 w-4 shrink-0 text-celestial-400" aria-hidden="true" />
                          Parish website
                        </a>
                      </dd>
                    </div>
                  ) : null}

                  {social.length > 0 ? (
                    <div>
                      <dt className="text-celestial-500">Social media</dt>
                      <dd className="mt-1">
                        <ul className="space-y-1.5">
                          {social.map((link) => (
                            <li key={link.label}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-celestial-800 underline-offset-4 hover:underline"
                              >
                                <IconExternal className="h-4 w-4 shrink-0 text-celestial-400" aria-hidden="true" />
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ) : null}
                </dl>

                {!parish.shepherd &&
                !parish.phone &&
                !parish.email &&
                !parish.website &&
                social.length === 0 ? (
                  <p className="mt-5 border-t border-celestial-100 pt-4 text-sm text-celestial-600">
                    Contact details for this parish have not yet been supplied.
                  </p>
                ) : null}
              </Card>

              <Card className="p-6">
                <h2 className="text-base font-semibold text-celestial-900">
                  {state ? state.name : 'Region C'}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-celestial-600">
                  See every Region C parish in {stateName(parish.state)}, along with regional
                  contacts for the state.
                </p>
                {state ? (
                  <ButtonLink href={`/states/${state.slug}`} variant="secondary" className="mt-4 w-full">
                    {state.name} parishes
                    <IconArrowRight className="h-4 w-4" />
                  </ButtonLink>
                ) : null}
              </Card>
            </aside>
          </div>
        </Container>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Parishes', path: '/parishes' },
          { name: parish.name, path: `/parishes/${parish.slug}` },
        ])}
      />

      {/* Local-discovery structured data, emitted only for verified parishes. */}
      {!parish.isPlaceholder ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Church',
            name: parish.name,
            url: absoluteUrl(`/parishes/${parish.slug}`),
            ...(parish.description ? { description: parish.description } : {}),
            ...(parish.phone ? { telephone: parish.phone } : {}),
            ...(parish.email ? { email: parish.email } : {}),
            ...(parish.website || social.length > 0
              ? {
                  sameAs: [parish.website, ...social.map((link) => link.url)].filter(Boolean),
                }
              : {}),
            address: {
              '@type': 'PostalAddress',
              ...(parish.address ? splitAddress(parish.address) : {}),
              ...(parish.city ? { addressLocality: parish.city } : {}),
              addressRegion: parish.state,
              addressCountry: 'US',
            },
            ...(parish.latitude !== undefined && parish.longitude !== undefined
              ? {
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: parish.latitude,
                    longitude: parish.longitude,
                  },
                }
              : {}),
          }}
        />
      ) : null}
    </>
  );
}

/**
 * Parish addresses are stored whole ("4001 Webster Street, Oakland, CA 94607")
 * because that is how they are displayed. schema.org wants the street alone,
 * with city and state carried separately, so trim the trailing locality and
 * lift out the ZIP code when the address ends in the usual form.
 */
function splitAddress(address: string): { streetAddress: string; postalCode?: string } {
  const match = address.match(/^(.*?),\s*[^,]+,\s*[A-Z]{2}\s+(\d{5}(?:-\d{4})?)$/);
  return match ? { streetAddress: match[1], postalCode: match[2] } : { streetAddress: address };
}
