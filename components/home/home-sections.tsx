import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { Card, SectionHeading, EmptyState, PlaceholderNotice } from '@/components/ui/primitives';
import { LeaderCard } from '@/components/leadership/leader-card';
import { ParishCard } from '@/components/parish/parish-card';
import { EventCard } from '@/components/events/event-card';
import { ArticleCard } from '@/components/news/article-card';
import {
  IconArrowRight,
  IconChurch,
  IconDocument,
  IconExternal,
  IconMapPin,
  IconSearch,
  IconUsers,
} from '@/components/ui/icons';
import { siteConfig } from '@/config/site';
import { principalLeaders, orderedLeadership } from '@/data/leadership';
import { orderedParishes, parishDirectoryIsSample } from '@/data/parishes';
import { orderedStates } from '@/data/states';
import { getUpcomingEvents, eventsAreSample } from '@/data/events';
import { getLatestNews, newsIsSample } from '@/data/news';

/* ------------------------------------------------------- Find a Parish ---- */

export function FindAParish() {
  const featured = orderedParishes.slice(0, 3);

  return (
    <section aria-labelledby="find-parish-heading" className="bg-white py-16 sm:py-20">
      <Container width="wide">
        <SectionHeading
          eyebrow="Find a parish"
          title="Locate a Region C parish near you"
          description="Search the regional directory by parish name, city or state. Every Celestial Church of Christ parish within a Region C state belongs to Region C."
          action={
            <ButtonLink href="/parishes">
              <IconSearch className="h-4 w-4" />
              Open the directory
            </ButtonLink>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <Card className="p-6">
            <h3 className="text-lg text-celestial-900">Browse by state</h3>
            <p className="mt-2 text-sm leading-relaxed text-celestial-600">
              Jump straight to the parishes in a Region C state.
            </p>
            {/* Two columns keep eleven states from towering over the parish cards. */}
            <ul className="mt-5 grid grid-cols-2 gap-2">
              {orderedStates.map((state) => (
                <li key={state.code}>
                  <Link
                    href={`/states/${state.slug}`}
                    className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-celestial-100 px-3.5 text-sm font-medium text-celestial-800 transition-colors hover:border-celestial-200 hover:bg-celestial-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <IconMapPin className="h-4 w-4 text-celestial-400" aria-hidden="true" />
                      {state.name}
                    </span>
                    <IconArrowRight className="h-4 w-4 text-celestial-400" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <div>
            {parishDirectoryIsSample ? (
              <PlaceholderNotice className="mb-4">
                The parishes shown below are examples included with the initial build. Verified
                Region C parish records will replace them.
              </PlaceholderNotice>
            ) : null}

            {featured.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featured.map((parish) => (
                  <ParishCard key={parish.id} parish={parish} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="The parish directory is being compiled"
                description="Region C parishes are being collected for publication. Please check back shortly."
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------- Regional Leadership --- */

export function LeadershipPreview() {
  // The two principals, then the next officers by display order.
  const others = orderedLeadership.filter((leader) => leader.tier !== 'principal').slice(0, 4);

  return (
    <section aria-labelledby="leadership-heading" className="bg-celestial-50/50 py-16 sm:py-20">
      <Container width="wide">
        <SectionHeading
          eyebrow="Regional leadership"
          title="The Region C Executive"
          description="Region C is administered by an executive body of shepherds and officers serving the parishes and members of the region."
          action={
            <ButtonLink href="/leadership" variant="secondary">
              Full leadership
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principalLeaders.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} variant="principal" />
          ))}

          <Card className="flex flex-col justify-center p-6 sm:col-span-2 lg:col-span-1">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-md bg-celestial-50 text-celestial-700"
            >
              <IconUsers className="h-5.5 w-5.5" />
            </span>
            <h3 className="mt-4 text-lg text-celestial-900">Executive officers</h3>
            <p className="mt-2 text-sm leading-relaxed text-celestial-600">
              Alongside the Supervisor and Deputy Supervisor, the Region C Executive includes
              officers responsible for administration, evangelism, shepherding, the Women Council,
              youth, welfare and music.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-celestial-700">
              {others.map((leader) => (
                <li key={leader.id} className="truncate">
                  {leader.office}
                </li>
              ))}
            </ul>
            <Link
              href="/leadership"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-celestial-800 underline-offset-4 hover:underline"
            >
              See all {orderedLeadership.length} executive members
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------ Upcoming Events --- */

export function UpcomingEventsSection() {
  const upcoming = getUpcomingEvents(3);

  return (
    <section aria-labelledby="events-heading" className="bg-white py-16 sm:py-20">
      <Container width="wide">
        <SectionHeading
          eyebrow="Regional calendar"
          title="Upcoming events"
          description="Regional programmes, conventions and departmental gatherings across Region C."
          action={
            <ButtonLink href="/events" variant="secondary">
              All events
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />

        {eventsAreSample && upcoming.length > 0 ? (
          <PlaceholderNotice className="mb-5">
            The events below illustrate the regional calendar. Dates and venues are not confirmed.
          </PlaceholderNotice>
        ) : null}

        {upcoming.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No events are currently scheduled"
            description="The Region C calendar for the coming year is being finalised. Regional programmes will be published here once ratified."
          />
        )}
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------- Latest News --- */

export function LatestNews() {
  const articles = getLatestNews(3);

  return (
    <section aria-labelledby="news-heading" className="bg-celestial-50/50 py-16 sm:py-20">
      <Container width="wide">
        <SectionHeading
          eyebrow="News & updates"
          title="Latest from Region C"
          description="Announcements from the Secretariat, regional news and parish highlights."
          action={
            <ButtonLink href="/news" variant="secondary">
              All news
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />

        {newsIsSample && articles.length > 0 ? (
          <PlaceholderNotice className="mb-5">
            These announcements were included with the initial build to demonstrate the news system.
          </PlaceholderNotice>
        ) : null}

        {articles.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No announcements yet"
            description="Regional announcements from the Region C Secretariat will appear here."
          />
        )}
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ Resources --- */

const quickLinks = [
  {
    title: 'For Shepherds',
    description: 'Administrative guidance, regional notices and pastoral resources.',
    href: '/resources',
    icon: IconChurch,
  },
  {
    title: 'For Parish Administrators',
    description: 'Directory submissions, monthly returns and standard forms.',
    href: '/resources',
    icon: IconDocument,
  },
  {
    title: 'For Youth Leaders',
    description: 'Youth programme information and departmental training material.',
    href: '/ministries/youth',
    icon: IconUsers,
  },
  {
    title: 'For Technical Personnel',
    description: 'Livestream, media and parish technology guidance.',
    href: '/resources',
    icon: IconSearch,
  },
];

export function ResourceQuickLinks() {
  return (
    <section aria-labelledby="resources-heading" className="bg-white py-16 sm:py-20">
      <Container width="wide">
        <SectionHeading
          eyebrow="Resources"
          title="Support for those who serve"
          description="Forms, policies, official notices and training material for the people who keep Region C parishes running."
          action={
            <ButtonLink href="/resources" variant="secondary">
              Resource centre
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <li key={link.title}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-lg border border-celestial-100 bg-white p-5 shadow-card transition-shadow duration-200 hover:border-celestial-200 hover:shadow-card-hover"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-50 text-gold-700"
                >
                  <link.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-celestial-900">{link.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-celestial-600">
                  {link.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-celestial-700">
                  Open
                  <IconArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* -------------------------------------------------- Diocese Relationship -- */

export function DioceseRelationship() {
  return (
    <section aria-labelledby="diocese-heading" className="bg-celestial-900 py-14 sm:py-16">
      <Container width="wide">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-300 uppercase">
              Part of the wider church
            </p>
            <h2 id="diocese-heading" className="text-2xl text-white sm:text-3xl">
              Region C operates under the {siteConfig.diocese}
            </h2>
            <p className="mt-4 leading-relaxed text-celestial-100">
              The Celestial Church of Christ USA Diocese divides the United States into geographic
              regions. Region C is one of those regions, and every Celestial Church of Christ parish
              located within a Region C state belongs to it. For diocesan-wide information, visit the
              Diocese website.
            </p>
          </div>

          <div className="shrink-0">
            <ButtonLink href={siteConfig.dioceseUrl} external size="lg" variant="onDark">
              Visit {siteConfig.dioceseName}
              <IconExternal className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
