import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { CelestialField } from '@/components/ui/primitives';
import { IconCalendar, IconMap, IconSearch } from '@/components/ui/icons';
import { siteConfig } from '@/config/site';
import { confirmedStates } from '@/data/states';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-celestial-900">
      {/*
       * Worship photograph behind the hero. The image is composited against the
       * hero's own navy (#0a1633) with the singer to the right and his left edge
       * faded out, so the headline column stays clean at wide sizes. The gradient
       * below carries that protection down to narrow screens, where `object-right`
       * keeps him in frame as the sides crop.
       */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/images/home-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-celestial-900 via-celestial-900/85 to-celestial-900/40 lg:via-celestial-900/70 lg:to-transparent" />
      </div>

      <CelestialField />

      <Container width="wide" className="relative py-16 sm:py-20 lg:py-28">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-[0.1em] text-gold-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
            {siteConfig.diocese}
          </p>

          <h1 className="text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Celestial Church of Christ
            <span className="mt-2 block text-gold-300">USA Diocese — Region C</span>
          </h1>

          <p className="mt-6 max-w-2xl font-serif text-xl leading-snug text-celestial-100 sm:text-2xl">
            {siteConfig.tagline}
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-celestial-200">
            Region C is the regional body serving Celestial Church of Christ parishes across{' '}
            {confirmedStates.length} states of the western United States. This is the hub for our
            parishes, ministries, regional programmes and administration.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/parishes" size="lg" className="bg-white text-celestial-900 hover:bg-celestial-50">
              <IconSearch className="h-4.5 w-4.5" />
              Find a Parish
            </ButtonLink>
            <ButtonLink href="/about" size="lg" variant="onDark">
              <IconMap className="h-4.5 w-4.5" />
              Explore Region C
            </ButtonLink>
            <ButtonLink href="/events" size="lg" variant="onDark">
              <IconCalendar className="h-4.5 w-4.5" />
              Upcoming Events
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/* Gold hairline separating the hero from the page body. */}
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
    </section>
  );
}
