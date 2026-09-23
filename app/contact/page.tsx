import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { Breadcrumbs, Card, PageHeader, PlaceholderNotice } from '@/components/ui/primitives';
import {
  IconArrowRight,
  IconChurch,
  IconDocument,
  IconExternal,
  IconMail,
  IconUsers,
} from '@/components/ui/icons';
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/config/site';
import { orderedStates } from '@/data/states';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Contact Region C of the Celestial Church of Christ USA Diocese — the Regional Secretariat, parish enquiries and departmental contacts.',
  path: '/contact',
});

/** Where common enquiries should be directed. */
const routes = [
  {
    title: 'Parish enquiries',
    description:
      'Questions about a specific parish, its services or its shepherd are best directed to the parish itself. Use the directory to find it.',
    href: '/parishes',
    linkLabel: 'Parish directory',
    icon: IconChurch,
  },
  {
    title: 'Directory submissions',
    description:
      'Parish administrators submitting or correcting parish details for the Region C directory should use the parish information form.',
    href: '/resources',
    linkLabel: 'Resource centre',
    icon: IconDocument,
  },
  {
    title: 'Departmental enquiries',
    description:
      'Enquiries for Evangelism, the Women Council, Youth, Welfare or Choir and Music are directed through the Secretariat to the officer concerned.',
    href: '/ministries',
    linkLabel: 'Regional ministries',
    icon: IconUsers,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact Region C"
        description="The Region C Secretariat is the point of contact for regional administration, parish records, departmental enquiries and announcements."
      />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      <section className="bg-white py-12 sm:py-14">
        <Container width="wide">
          {siteConfig.contact.isPlaceholder ? (
            <PlaceholderNotice className="mb-8">
              The e-mail addresses shown on this page are proposed addresses for the region and have
              not yet been confirmed. The Secretariat should replace them, and add a telephone number
              and postal address, in{' '}
              <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-[0.8125rem]">
                config/site.ts
              </code>{' '}
              before launch.
            </PlaceholderNotice>
          ) : null}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="rule-gold text-xl text-celestial-900">Region C Secretariat</h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-celestial-700">
                The Regional Secretary maintains the records of the region: parish listings,
                executive appointments, the calendar of regional programmes and official notices. For
                anything concerning Region C as a whole, the Secretariat is the right first contact.
              </p>

              <dl className="mt-8 space-y-5">
                <div>
                  <dt className="text-sm text-celestial-500">General enquiries</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="inline-flex items-center gap-2 font-medium break-all text-celestial-900 underline-offset-4 hover:underline"
                    >
                      <IconMail className="h-4.5 w-4.5 shrink-0 text-celestial-400" aria-hidden="true" />
                      {siteConfig.contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-celestial-500">Secretariat</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${siteConfig.contact.secretariatEmail}`}
                      className="inline-flex items-center gap-2 font-medium break-all text-celestial-900 underline-offset-4 hover:underline"
                    >
                      <IconMail className="h-4.5 w-4.5 shrink-0 text-celestial-400" aria-hidden="true" />
                      {siteConfig.contact.secretariatEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-celestial-500">Telephone</dt>
                  <dd className="mt-1 text-celestial-700">
                    {siteConfig.contact.phone || 'To be confirmed'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-celestial-500">States served</dt>
                  <dd className="mt-1 text-celestial-700">
                    {orderedStates.map((state) => state.name).join(', ')}
                  </dd>
                </div>
              </dl>

              <div className="mt-10 rounded-lg border border-celestial-100 bg-celestial-50/60 p-6">
                <h3 className="text-base font-semibold text-celestial-900">
                  A contact form is planned
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-celestial-600">
                  A form that routes enquiries to the correct regional officer will be added once the
                  Secretariat has confirmed its addresses and a mail service has been chosen. Until
                  then, e-mail reaches the region directly.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {routes.map((route) => (
                <Card key={route.title} className="p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-celestial-50 text-celestial-700"
                  >
                    <route.icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-base font-semibold text-celestial-900">{route.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-celestial-600">
                    {route.description}
                  </p>
                  <Link
                    href={route.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-celestial-800 underline-offset-4 hover:underline"
                  >
                    {route.linkLabel}
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-celestial-900 py-12 sm:py-14">
        <Container width="wide">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-xl text-white sm:text-2xl">Looking for the Diocese?</h2>
              <p className="mt-3 leading-relaxed text-celestial-100">
                For matters concerning the Celestial Church of Christ USA Diocese as a whole rather
                than Region C specifically, contact the Diocese directly.
              </p>
            </div>
            <ButtonLink href={siteConfig.dioceseUrl} external variant="onDark" size="lg">
              {siteConfig.dioceseName}
              <IconExternal className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
