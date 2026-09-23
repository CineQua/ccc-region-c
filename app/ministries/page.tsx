import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Breadcrumbs, Card, PageHeader } from '@/components/ui/primitives';
import { IconArrowRight, ministryIcons } from '@/components/ui/icons';
import { buildMetadata } from '@/lib/metadata';
import { orderedMinistries } from '@/data/ministries';
import { getLeaderById, leaderFullName } from '@/data/leadership';

export const metadata = buildMetadata({
  title: 'Ministries',
  description:
    'The ministry departments of Region C: Evangelism, Women, Youth, Welfare, and Choir & Music, each under a member of the Region C Executive.',
  path: '/ministries',
});

export default function MinistriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ministries"
        title="Regional Ministries"
        description="The work of Region C is carried out through its ministry departments, each under a member of the Region C Executive."
      />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Ministries', path: '/ministries' },
        ]}
      />

      <section className="bg-white py-12 sm:py-16">
        <Container width="wide">
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {orderedMinistries.map((ministry) => {
              const Icon = ministryIcons[ministry.icon];
              const lead = ministry.leaderIds
                .map((id) => getLeaderById(id))
                .find((leader) => leader !== undefined);

              return (
                <li key={ministry.id}>
                  <Card interactive className="relative flex h-full flex-col p-6">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-md bg-celestial-800 text-gold-300"
                    >
                      <Icon className="h-5.5 w-5.5" />
                    </span>

                    <h2 className="mt-4 text-lg text-celestial-900">
                      <Link
                        href={`/ministries/${ministry.slug}`}
                        className="before:absolute before:inset-0"
                      >
                        {ministry.name}
                      </Link>
                    </h2>

                    <p className="mt-2 flex-1 text-sm leading-relaxed text-celestial-600">
                      {ministry.summary}
                    </p>

                    {lead ? (
                      <p className="mt-4 border-t border-celestial-100 pt-4 text-sm text-celestial-700">
                        <span className="text-celestial-500">Led by </span>
                        {leaderFullName(lead)}
                      </p>
                    ) : null}

                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-celestial-700">
                      Learn more
                      <IconArrowRight className="h-4 w-4" />
                    </span>
                  </Card>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 rounded-lg border border-celestial-100 bg-celestial-50/60 p-6">
            <h2 className="text-base font-semibold text-celestial-900">Additional ministries</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-celestial-600">
              Further Region C ministry departments can be added to this page as they are
              established. Contact the Region C Secretariat to have a departmental page created.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
