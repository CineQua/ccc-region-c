import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { CelestialField } from '@/components/ui/primitives';
import { IconArrowRight, IconSearch } from '@/components/ui/icons';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-celestial-900">
      <CelestialField />
      <Container className="relative py-24 text-center sm:py-32">
        <p className="text-xs font-semibold tracking-[0.14em] text-gold-300 uppercase">Error 404</p>
        <h1 className="mt-4 text-3xl text-white sm:text-4xl">This page could not be found</h1>
        <p className="mx-auto mt-4 max-w-lg leading-relaxed text-celestial-100">
          The page you are looking for may have been moved, or the address may be mistyped. Try the
          parish directory, or return to the Region C home page.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg" variant="light">
            Region C home
            <IconArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/parishes" size="lg" variant="onDark">
            <IconSearch className="h-4 w-4" />
            Find a parish
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
