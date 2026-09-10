import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Breadcrumbs, PageHeader, PlaceholderNotice } from '@/components/ui/primitives';
import { ParishDirectory } from '@/components/parish/parish-directory';
import { buildMetadata } from '@/lib/metadata';
import { orderedParishes, parishDirectoryIsSample } from '@/data/parishes';
import { confirmedStates, orderedStates } from '@/data/states';

export const metadata = buildMetadata({
  title: 'Parish Directory',
  description: `Find a Celestial Church of Christ parish in Region C. Search the regional directory by parish name, city or state across the ${confirmedStates.length} Region C states.`,
  path: '/parishes',
});

export default function ParishesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Parishes"
        title="Region C Parish Directory"
        description="Every Celestial Church of Christ parish located within a Region C state belongs to Region C. Search by parish name, city or state to find the parish nearest to you."
      />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Parishes', path: '/parishes' },
        ]}
      />

      <section className="bg-white py-10 sm:py-14">
        <Container width="wide">
          {parishDirectoryIsSample ? (
            <PlaceholderNotice className="mb-6">
              The parish directory is being compiled. The records below are examples showing how
              parishes will be presented; they are not real parish listings. Parish administrators
              can submit their details through the{' '}
              <Link href="/resources" className="font-medium underline underline-offset-2">
                resource centre
              </Link>
              .
            </PlaceholderNotice>
          ) : null}

          <ParishDirectory parishes={orderedParishes} states={orderedStates} />
        </Container>
      </section>
    </>
  );
}
