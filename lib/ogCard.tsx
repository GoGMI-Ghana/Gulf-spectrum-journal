// Renders the 1200x630 link-preview card as a PNG, using the journal's
// colours. One generic card for the site, and one per article showing its
// title and authors — so a shared article is recognisable in a chat or
// feed before anyone clicks it.
//
// ImageResponse (Satori) supports only a subset of CSS: flexbox layout,
// and every element with more than one child needs an explicit
// `display: flex`. It ships with a single default font, which is what
// this uses — no font files to load or keep in sync.
import { ImageResponse } from 'next/og'
import { journal } from './staticContent'

const ROYAL_BLUE = '#003366'
const GOLD = '#daa520'
const SOFT_GOLD = '#f5e6d3'

export const OG_SIZE = { width: 1200, height: 630 }

// Long titles shrink rather than overflow the card.
function titleFontSize(title: string): number {
  if (title.length > 120) return 44
  if (title.length > 80) return 52
  if (title.length > 45) return 60
  return 72
}

export function renderOgCard({
  kicker,
  title,
  subtitle,
}: {
  kicker: string
  title: string
  subtitle?: string
}): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: ROYAL_BLUE,
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 24, letterSpacing: 5, textTransform: 'uppercase', color: GOLD }}>
            {kicker}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: titleFontSize(title),
              lineHeight: 1.15,
              color: '#ffffff',
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ display: 'flex', marginTop: 28, fontSize: 30, color: SOFT_GOLD }}>{subtitle}</div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `3px solid ${GOLD}`,
            paddingTop: 24,
          }}
        >
          <div style={{ display: 'flex', fontSize: 34, color: '#ffffff' }}>{journal.name}</div>
          <div style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.7)' }}>{journal.domain}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      headers: {
        // ImageResponse's default is a one-year immutable cache; shorter
        // here because an article's title or authors can be edited.
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  )
}
