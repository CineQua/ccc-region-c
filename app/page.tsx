import { Hero } from '@/components/home/hero';
import { AtAGlance } from '@/components/home/at-a-glance';
import { ExploreRegion } from '@/components/home/explore-region';
import {
  DioceseRelationship,
  FindAParish,
  LatestNews,
  LeadershipPreview,
  ResourceQuickLinks,
  UpcomingEventsSection,
} from '@/components/home/home-sections';
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/config/site';

export const metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: '/',
  absoluteTitle: true,
});

/**
 * Homepage.
 *
 * Composed entirely of section components so the running order can be changed
 * without touching markup. Alternating white and tinted section backgrounds give
 * the page rhythm without rules or borders.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <AtAGlance />
      <ExploreRegion />
      <FindAParish />
      <LeadershipPreview />
      <UpcomingEventsSection />
      <LatestNews />
      <ResourceQuickLinks />
      <DioceseRelationship />
    </>
  );
}
