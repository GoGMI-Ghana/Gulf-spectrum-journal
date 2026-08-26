import type { DailySeriesPoint } from '@/lib/analyticsData'

const WIDTH = 1200
const HEIGHT = 320
const PAD_LEFT = 40
const PAD_RIGHT = 20
const PAD_TOP = 20
const PAD_BOTTOM = 40

function buildPath(values: number[], max: number): string {
  const innerW = WIDTH - PAD_LEFT - PAD_RIGHT
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM
  const step = values.length > 1 ? innerW / (values.length - 1) : 0

  return values
    .map((v, i) => {
      const x = PAD_LEFT + i * step
      const y = PAD_TOP + innerH - (max > 0 ? (v / max) * innerH : 0)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

function points(values: number[], max: number): { x: number; y: number }[] {
  const innerW = WIDTH - PAD_LEFT - PAD_RIGHT
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM
  const step = values.length > 1 ? innerW / (values.length - 1) : 0
  return values.map((v, i) => ({
    x: PAD_LEFT + i * step,
    y: PAD_TOP + innerH - (max > 0 ? (v / max) * innerH : 0),
  }))
}

export default function EngagementChart({ data }: { data: DailySeriesPoint[] }) {
  const views = data.map((d) => d.views)
  const downloads = data.map((d) => d.downloads)
  const max = Math.max(1, ...views, ...downloads)

  const viewsPath = buildPath(views, max)
  const downloadsPath = buildPath(downloads, max)
  const viewsPoints = points(views, max)
  const downloadsPoints = points(downloads, max)

  const baselineY = PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM)
  const labelEvery = Math.max(1, Math.ceil(data.length / 8))

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label="Article views and downloads over time">
      {/* baseline */}
      <line x1={PAD_LEFT} y1={baselineY} x2={WIDTH - PAD_RIGHT} y2={baselineY} stroke="#e2e8f0" strokeWidth="1" />
      <text x={PAD_LEFT - 8} y={baselineY + 4} textAnchor="end" fontSize="12" fill="#94a3b8">0</text>

      {/* series */}
      <path d={downloadsPath} fill="none" stroke="#003366" strokeWidth="2" />
      <path d={viewsPath} fill="none" stroke="#DAA520" strokeWidth="2" />

      {downloadsPoints.map((p, i) => (
        <circle key={`d-${i}`} cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#003366" strokeWidth="1.5" />
      ))}
      {viewsPoints.map((p, i) => (
        <circle key={`v-${i}`} cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#DAA520" strokeWidth="1.5" />
      ))}

      {/* x-axis labels */}
      {data.map((d, i) =>
        i % labelEvery === 0 ? (
          <text
            key={d.label + i}
            x={viewsPoints[i].x}
            y={HEIGHT - 12}
            textAnchor="middle"
            fontSize="11"
            fill="#94a3b8"
          >
            {d.label}
          </text>
        ) : null
      )}
    </svg>
  )
}
