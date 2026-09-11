import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { siteConfig, siteOrigin } from '@/config/site';
import { confirmedStates } from '@/data/states';

/**
 * The card is generated at build time, so the emblem is inlined from disk as a
 * data URI: `next/og` cannot fetch a relative URL, and the site has no absolute
 * origin to fetch from during a static export.
 */
const logoDataUri = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'public/images/ccc-logo.png'),
).toString('base64')}`;

/**
 * Default Open Graph card, generated at build time.
 *
 * Rendered rather than shipped as a static image so it stays in step with the
 * region's name and tagline, and so no binary asset has to be maintained. Uses
 * only system-safe styling — `next/og` supports a restricted CSS subset.
 */
// The card has no dynamic inputs, so it is generated once at build time. This
// also keeps the route compatible with `output: 'export'` (see DEPLOYMENT.md).
export const dynamic = 'force-static';

export const alt = 'Celestial Church of Christ USA Diocese — Region C';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #050b1e 0%, #0f2350 55%, #16336f 100%)',
          color: '#ffffff',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '96px',
              height: '96px',
              borderRadius: '999px',
              border: '3px solid #dcb43c',
              background: '#ffffff',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} width={84} height={84} alt="" style={{ objectFit: 'contain' }} />
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#c4d6f4',
            }}
          >
            Celestial Church of Christ
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: '72px', lineHeight: 1.1 }}>USA Diocese</div>
          <div style={{ display: 'flex', fontSize: '72px', lineHeight: 1.1, color: '#e9cb63' }}>
            Region C
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: '28px',
              fontSize: '30px',
              color: '#c4d6f4',
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: '22px',
            color: '#93b4e9',
          }}
        >
          {/* Eleven names will not fit on one line of the card, so give the count. */}
          <div style={{ display: 'flex' }}>
            Serving {confirmedStates.length} states of the western United States
          </div>
          {/* The region's own host, so the card follows a change of domain. */}
          <div style={{ display: 'flex' }}>{new URL(siteOrigin).host}</div>
        </div>
      </div>
    ),
    size,
  );
}
