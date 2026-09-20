import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { IconCalendar, IconChurch, IconMap, IconUsers } from '@/components/ui/icons';
import { confirmedStates } from '@/data/states';
import { parishes, parishDirectoryIsSample } from '@/data/parishes';
import { getUpcomingEvents } from '@/data/events';
import { ministries } from '@/data/ministries';

/**
 * Region C at a Glance.
 *
 * Every figure is derived from the data layer rather than typed in, so the
 * counters cannot drift out of step with the directory. Counts that currently
 * reflect sample records are labelled as such instead of being presented as
 * verified regional statistics.
 */
export async function AtAGlance() {
  const upcomingCount = (await getUpcomingEvents()).length;

  const stats = [
    {
      label: 'States served',
      value: confirmedStates.length,
      caption: 'Confirmed Region C states',
      href: '/states',
      icon: IconMap,
      provisional: false,
    },
    {
      label: 'Parishes',
      value: parishes.length,
      caption: parishDirectoryIsSample ? 'Sample records — directory in progress' : 'In the Region C directory',
      href: '/parishes',
      icon: IconChurch,
      provisional: parishDirectoryIsSample,
    },
    {
      label: 'Upcoming events',
      value: upcomingCount,
      caption: 'On the regional calendar',
      href: '/events',
      icon: IconCalendar,
      provisional: false,
    },
    {
      label: 'Ministries',
      value: ministries.length,
      caption: 'Regional departments',
      href: '/ministries',
      icon: IconUsers,
      provisional: false,
    },
  ];

  return (
    <section aria-labelledby="at-a-glance-heading" className="border-b border-celestial-100 bg-white py-12 sm:py-14">
      <Container width="wide">
        <h2 id="at-a-glance-heading" className="sr-only">
          Region C at a glance
        </h2>

        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="relative">
              <Link
                href={stat.href}
                className="group flex h-full flex-col rounded-lg border border-celestial-100 bg-white p-5 shadow-card transition-shadow duration-200 hover:border-celestial-200 hover:shadow-card-hover"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-celestial-50 text-celestial-700"
                >
                  <stat.icon className="h-5 w-5" />
                </span>
                <dd className="mt-4 font-serif text-3xl leading-none font-semibold text-celestial-900 sm:text-4xl">
                  {stat.value}
                  {stat.provisional ? (
                    <span className="align-super text-base text-gold-600" aria-hidden="true">
                      *
                    </span>
                  ) : null}
                </dd>
                <dt className="mt-2 text-sm font-medium text-celestial-800">{stat.label}</dt>
                <p className="mt-1 text-xs leading-snug text-celestial-500">{stat.caption}</p>
              </Link>
            </div>
          ))}
        </dl>

        {parishDirectoryIsSample ? (
          <p className="mt-4 text-xs text-celestial-500">
            <span aria-hidden="true" className="text-gold-600">
              *
            </span>{' '}
            The parish count reflects sample records included with the initial build. It will show
            the true figure once the verified Region C parish list has been supplied.
          </p>
        ) : null}
      </Container>
    </section>
  );
}
