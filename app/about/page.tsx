import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { Breadcrumbs, Card, PageHeader, SectionHeading } from '@/components/ui/primitives';
import { StateCard } from '@/components/home/explore-region';
import { IconArrowRight, IconExternal } from '@/components/ui/icons';
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/config/site';
import { confirmedStateList, confirmedStates, orderedStates } from '@/data/states';
import { countParishesByState } from '@/data/parishes';
import { orderedLeadership, principalLeaders } from '@/data/leadership';
import { ministries } from '@/data/ministries';

export const metadata = buildMetadata({
  title: 'About Region C',
  description: `Region C is the regional body of the Celestial Church of Christ USA Diocese serving parishes across ${confirmedStateList}.`,
  path: '/about',
});

export default function AboutPage() {
  const counts = countParishesByState();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About Region C"
        description="Region C is one of the geographic regions into which the Celestial Church of Christ USA Diocese divides the United States. Every Celestial Church of Christ parish located within a Region C state belongs to Region C."
      />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'About Region C', path: '/about' },
        ]}
      />

      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="prose-region">
            <h2 className="rule-gold mb-5 text-2xl text-celestial-900">How the region is organised</h2>
            <p>
              The {siteConfig.diocese} divides the United States into geographic regions, each
              serving the parishes within its states. Region C serves the western United States and
              is administered by a regional executive body under the Region C Supervisor.
            </p>
            <p>
              Region C exists to connect its parishes to one another and to the wider Diocese: to
              coordinate evangelism and regional programmes, to support shepherds and parish
              administrators, to give the departments of the church — women, youth, welfare, choir
              and music — a regional structure, and to carry announcements and administrative
              guidance from the Diocese to every parish.
            </p>
            <p>
              This website is the region&rsquo;s central point of reference. It holds the parish
              directory, the executive listing, the regional calendar, ministry information,
              announcements and downloadable resources.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-y border-celestial-100 bg-celestial-50/50 py-14 sm:py-16">
        <Container width="wide">
          <SectionHeading
            eyebrow="At a glance"
            title="What Region C comprises"
            description="The region is structured hierarchically: Region C, then state, then parish, then the shepherd and congregation of that parish."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-6">
              <p className="font-serif text-4xl font-semibold text-celestial-900">
                {confirmedStates.length}
              </p>
              <h3 className="mt-2 text-base font-semibold text-celestial-800">Confirmed states</h3>
              <p className="mt-2 text-sm leading-relaxed text-celestial-600">
                {confirmedStateList}.
              </p>
            </Card>
            <Card className="p-6">
              <p className="font-serif text-4xl font-semibold text-celestial-900">
                {orderedLeadership.length}
              </p>
              <h3 className="mt-2 text-base font-semibold text-celestial-800">Executive members</h3>
              <p className="mt-2 text-sm leading-relaxed text-celestial-600">
                Led by the Region C Supervisor and Deputy Regional Supervisor, with officers holding
                specific regional portfolios.
              </p>
            </Card>
            <Card className="p-6">
              <p className="font-serif text-4xl font-semibold text-celestial-900">
                {ministries.length}
              </p>
              <h3 className="mt-2 text-base font-semibold text-celestial-800">Ministries</h3>
              <p className="mt-2 text-sm leading-relaxed text-celestial-600">
                Evangelism, Women, Youth, Welfare, and Choir &amp; Music, each with regional
                oversight.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <Container width="wide">
          <SectionHeading
            eyebrow="Region C states"
            title="The states we serve"
            action={
              <ButtonLink href="/states" variant="secondary">
                State pages
                <IconArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orderedStates.map((state) => (
              <li key={state.code}>
                <StateCard state={state} parishCount={counts[state.code] ?? 0} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-celestial-100 bg-celestial-50/50 py-14 sm:py-16">
        <Container width="wide">
          <SectionHeading
            eyebrow="Leadership"
            title="Who leads Region C"
            description="The regional executive is led by the Supervisor and Deputy Regional Supervisor."
            action={
              <ButtonLink href="/leadership" variant="secondary">
                Full leadership
                <IconArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {principalLeaders.map((leader) => (
              <li key={leader.id}>
                <Card className="p-6">
                  <p className="text-xs font-semibold tracking-[0.12em] text-gold-600 uppercase">
                    {leader.office}
                  </p>
                  <h3 className="mt-2 text-xl text-celestial-900">
                    {leader.ecclesiasticalTitle} {leader.name}
                  </h3>
                  <Link
                    href="/leadership"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-celestial-700 underline-offset-4 hover:underline"
                  >
                    View the Region C Executive
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-celestial-900 py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl text-white sm:text-3xl">Our place in the Diocese</h2>
          <p className="mt-4 leading-relaxed text-celestial-100">
            Region C operates under the {siteConfig.diocese}. Diocesan-wide announcements, doctrine
            and national programmes are published by the Diocese; this site carries what is specific
            to Region C.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href={siteConfig.dioceseUrl} external variant="onDark">
              Visit {siteConfig.dioceseName}
              <IconExternal className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/about/mission" variant="onDark">
              Mission &amp; Purpose
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
