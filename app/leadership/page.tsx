import { Container } from '@/components/ui/container';
import { Breadcrumbs, PageHeader, SectionHeading } from '@/components/ui/primitives';
import { LeaderCard } from '@/components/leadership/leader-card';
import { buildMetadata } from '@/lib/metadata';
import {
  executiveLeaders,
  orderedLeadership,
  principalLeaders,
} from '@/data/leadership';
import type { LeadershipPortfolio } from '@/lib/types';

export const metadata = buildMetadata({
  title: 'Regional Leadership',
  description:
    'The Region C Executive of the Celestial Church of Christ USA Diocese: the Regional Supervisor, Deputy Regional Supervisor and executive officers serving the region.',
  path: '/leadership',
});

/**
 * Portfolio groupings, in the order they are presented. `Regional Office` is
 * handled separately above as the principals, so the remaining officers are
 * grouped by the area of regional work they carry.
 */
const portfolioOrder: { portfolio: LeadershipPortfolio; title: string; description: string }[] = [
  {
    portfolio: 'Regional Office',
    title: 'Regional Office',
    description: 'Officers carrying region-wide oversight alongside the Supervisor.',
  },
  {
    portfolio: 'Administration',
    title: 'Administration & Finance',
    description: 'The secretariat, finance and compliance of the region.',
  },
  {
    portfolio: 'Evangelism',
    title: 'Evangelism',
    description: 'Direction of outreach across Region C.',
  },
  {
    portfolio: 'Shepherding',
    title: 'Shepherding & Discipline',
    description: 'Shepherds serving on the regional executive.',
  },
  { portfolio: 'Women', title: 'Women Council', description: 'The women of Region C parishes.' },
  { portfolio: 'Youth', title: 'Youth', description: 'The youth of Region C parishes.' },
  { portfolio: 'Welfare', title: 'Welfare', description: 'Care for members and families.' },
  { portfolio: 'Music', title: 'Choir & Music', description: 'Worship and music across the region.' },
];

export default function LeadershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Region C"
        title="Regional Leadership"
        description={`The Region C Executive comprises ${orderedLeadership.length} members serving the parishes of the region under the Celestial Church of Christ USA Diocese.`}
      />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Leadership', path: '/leadership' },
        ]}
      />

      {/* Principals — given prominence, as the region's two most senior offices. */}
      <section aria-labelledby="principals-heading" className="bg-white py-14 sm:py-16">
        <Container width="wide">
          <SectionHeading
            eyebrow="Regional Office"
            title="Supervisor & Deputy Supervisor"
            description="Region C is led by the Regional Supervisor, assisted by the Deputy Regional Supervisor."
            className="mb-8"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
            {principalLeaders.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} variant="principal" />
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="executive-heading"
        className="border-t border-celestial-100 bg-celestial-50/50 py-14 sm:py-16"
      >
        <Container width="wide">
          <SectionHeading
            eyebrow="The Executive"
            title="Region C Executive Members"
            description="Executive officers are grouped by the area of regional work they carry."
            as="h2"
          />

          <div className="space-y-12">
            {portfolioOrder.map((group) => {
              const members = executiveLeaders.filter(
                (leader) => leader.portfolio === group.portfolio,
              );
              if (members.length === 0) return null;

              return (
                <div key={group.portfolio}>
                  <div className="mb-5 border-b border-celestial-200/70 pb-3">
                    <h3 className="text-xl text-celestial-900">{group.title}</h3>
                    <p className="mt-1 text-sm text-celestial-600">{group.description}</p>
                  </div>
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {members.map((leader) => (
                      <li key={leader.id}>
                        <LeaderCard leader={leader} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-lg border border-celestial-100 bg-white p-6">
            <h3 className="text-base font-semibold text-celestial-900">About this listing</h3>
            <p className="mt-2 text-sm leading-relaxed text-celestial-600">
              Names, ecclesiastical titles and offices are transcribed from the official Region C
              Executive Members listing supplied by the Secretariat. Individual photographs,
              biographies and parish affiliations have not yet been supplied and will be added as
              they are received. To correct or update an entry, contact the Region C Secretariat.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
