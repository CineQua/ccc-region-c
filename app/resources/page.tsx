import { Container } from '@/components/ui/container';
import { Breadcrumbs, PageHeader, PlaceholderNotice } from '@/components/ui/primitives';
import { ResourceList } from '@/components/resources/resource-list';
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/config/site';
import { activeResourceCategories, orderedResources, resources } from '@/data/resources';

export const metadata = buildMetadata({
  title: 'Resources',
  description:
    'Forms, policies, official notices, training and technology resources for Region C shepherds, parish administrators and departmental workers.',
  path: '/resources',
});

export default function ResourcesPage() {
  const pending = resources.filter((resource) => resource.isPlaceholder).length;

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Resource Centre"
        description="Forms, policies, official notices and training material for the shepherds, parish administrators, departmental workers and technical personnel who serve Region C."
      />
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
        ]}
      />

      <section className="bg-white py-12 sm:py-14">
        <Container width="wide">
          {pending > 0 ? (
            <PlaceholderNotice className="mb-6">
              The resource shelf has been set up, but {pending} of the documents listed below have
              not yet been supplied by the Secretariat. Those entries are marked{' '}
              <span className="font-medium">document pending</span> and are not yet downloadable.
              Send documents for publication to{' '}
              <a
                href={`mailto:${siteConfig.contact.secretariatEmail}`}
                className="font-medium break-all underline underline-offset-2"
              >
                {siteConfig.contact.secretariatEmail}
              </a>
              .
            </PlaceholderNotice>
          ) : null}

          <ResourceList resources={orderedResources} categories={activeResourceCategories()} />
        </Container>
      </section>
    </>
  );
}
