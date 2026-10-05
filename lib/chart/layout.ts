// Works out where everything in a chart goes, as a flat list of simple
// shapes on a fixed 640-unit-wide canvas. Deliberately knows nothing about
// SVG or PDF: lib/chart/svg.ts and lib/pdf/chartPdf.tsx each turn the same
// shapes into their own output, so the web page, the editor preview and
// the downloadable PDF can't drift apart.
//
// The look follows a fixed set of rules rather than taste:
// - Colours come from one palette, assigned in a fixed order. That order
//   is what keeps neighbouring series distinguishable for colour-blind
//   readers (checked with a validator), so it's never shuffled or extended.
// - Thin marks: columns at most 24 wide with a rounded top and a 2-unit
//   gap between neighbours; 2-unit lines; markers with a white ring.
// - Recessive hairline grid; text always in ink colours, never in a
//   series colour (several palette colours are too light to read as text).
// - Two or more series always get a legend; values are labelled only where
//   that stays readable (single-series columns, line ends, pie slices).

import { formatChartNumber, type ChartSpec } from './spec'

export type Shape =
  | { kind: 'path'; d: string; fill?: string; stroke?: string; strokeWidth?: number; tip?: string }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: string; strokeWidth: number }
  | { kind: 'circle'; cx: number; cy: number; r: number; fill: string; stroke?: string; strokeWidth?: number; tip?: string }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; fill: string; rx?: number }
  | { kind: 'text'; x: number; y: number; text: string; size: number; fill: string; anchor: 'start' | 'middle' | 'end'; bold?: boolean }

export interface ChartLayout {
  width: number
  height: number
  shapes: Shape[]
}

// Fixed categorical order — see the note at the top of this file.
export const SERIES_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948']
const OTHER_COLOR = '#898781'

const INK = { primary: '#0b0b0b', secondary: '#52514e', muted: '#898781', grid: '#e1e0d9', axis: '#c3c2b7', surface: '#ffffff' }

const WIDTH = 640
const FONT = 11

// There's no browser here to measure text with, so widths are estimated
// from the character count — close enough to decide what fits.
const textWidth = (text: string, size = FONT) => text.length * size * 0.56

function truncate(text: string, maxWidth: number, size = FONT): string {
  if (textWidth(text, size) <= maxWidth) return text
  const chars = Math.max(1, Math.floor(maxWidth / (size * 0.56)) - 1)
  return `${text.slice(0, chars).trimEnd()}…`
}

// Axis steps people expect: 1, 2, 2.5 or 5 times a power of ten.
function niceStep(range: number, targetTicks: number): number {
  const rough = range / targetTicks
  const power = Math.pow(10, Math.floor(Math.log10(rough)))
  const fraction = rough / power
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10
  return nice * power
}

function valueTicks(values: number[]): number[] {
  // Always include zero: a value axis that starts elsewhere exaggerates
  // the differences between bars.
  const low = Math.min(0, ...values)
  let high = Math.max(0, ...values)
  if (high === low) high = low + 1
  const step = niceStep(high - low, 5)
  const start = Math.floor(low / step) * step
  const end = Math.ceil(high / step) * step
  const ticks: number[] = []
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Math.abs(v) < step / 1e6 ? 0 : Number(v.toPrecision(12)))
  return ticks
}

// --- Legend --------------------------------------------------------------

interface LegendItem {
  label: string
  color: string
}

// Flows legend entries left to right, wrapping to new rows. The key mirrors
// the chart's own mark: a short stroke for lines, a small square otherwise.
function drawLegend(items: LegendItem[], top: number, asLines: boolean, shapes: Shape[]): number {
  let x = 0
  let y = top
  for (const item of items) {
    const label = truncate(item.label, 200)
    const itemWidth = 16 + textWidth(label) + 18
    if (x > 0 && x + itemWidth > WIDTH) {
      x = 0
      y += 18
    }
    if (asLines) {
      shapes.push({ kind: 'line', x1: x, y1: y + 5, x2: x + 12, y2: y + 5, stroke: item.color, strokeWidth: 2 })
    } else {
      shapes.push({ kind: 'rect', x, y, width: 10, height: 10, fill: item.color, rx: 2 })
    }
    shapes.push({ kind: 'text', x: x + 16, y: y + 9, text: label, size: FONT, fill: INK.secondary, anchor: 'start' })
    x += itemWidth
  }
  return y + 18 - top
}

// --- Column and line charts ----------------------------------------------

interface Frame {
  left: number
  right: number
  top: number
  bottom: number
  slot: number
  y: (value: number) => number
  x: (categoryIndex: number) => number
}

function drawFrame(spec: ChartSpec, rightPad: number, shapes: Shape[]): Frame {
  let top = 6
  if (spec.series.length > 1) {
    top += drawLegend(spec.series.map((s, i) => ({ label: s.name, color: SERIES_COLORS[i] })), top, spec.type === 'line', shapes) + 6
  }
  if (spec.valueLabel) {
    shapes.push({ kind: 'text', x: 0, y: top + 9, text: truncate(spec.valueLabel, WIDTH), size: FONT, fill: INK.muted, anchor: 'start' })
    top += 18
  }
  top += 8

  const ticks = valueTicks(spec.series.flatMap((s) => s.values))
  const tickLabels = ticks.map(formatChartNumber)
  const left = Math.ceil(Math.max(...tickLabels.map((label) => textWidth(label)))) + 12
  const right = WIDTH - rightPad
  const plotHeight = 250
  const bottom = top + plotHeight

  const low = ticks[0]
  const high = ticks[ticks.length - 1]
  const y = (value: number) => bottom - ((value - low) / (high - low)) * plotHeight

  ticks.forEach((tick, i) => {
    const ty = y(tick)
    // The zero line is the baseline bars stand on; the rest is quieter grid.
    shapes.push({ kind: 'line', x1: left, y1: ty, x2: right, y2: ty, stroke: tick === 0 ? INK.axis : INK.grid, strokeWidth: 1 })
    shapes.push({ kind: 'text', x: left - 8, y: ty + 4, text: tickLabels[i], size: FONT, fill: INK.muted, anchor: 'end' })
  })

  const count = spec.categories.length
  const slot = (right - left) / count
  const x = (index: number) => left + slot * (index + 0.5)

  // Category labels: thin them out rather than let them collide.
  const every = Math.max(1, Math.ceil(52 / slot))
  spec.categories.forEach((category, i) => {
    if (i % every !== 0) return
    shapes.push({
      kind: 'text',
      x: x(i),
      y: bottom + 18,
      text: truncate(category, slot * every - 6),
      size: FONT,
      fill: INK.secondary,
      anchor: 'middle',
    })
  })

  return { left, right, top, bottom, slot, y, x }
}

// A column with its data end rounded and its baseline end square.
function columnPath(x: number, width: number, baseline: number, end: number): string {
  const height = Math.abs(baseline - end)
  const r = Math.min(4, width / 2, height)
  const dir = end < baseline ? 1 : -1 // 1 = grows upward
  const inner = end + dir * r
  return [
    `M${x},${baseline}`,
    `L${x},${inner}`,
    `Q${x},${end} ${x + r},${end}`,
    `L${x + width - r},${end}`,
    `Q${x + width},${end} ${x + width},${inner}`,
    `L${x + width},${baseline}`,
    'Z',
  ].join(' ')
}

const tipFor = (spec: ChartSpec, seriesIndex: number, categoryIndex: number) => {
  const series = spec.series[seriesIndex]
  const value = formatChartNumber(series.values[categoryIndex])
  return spec.series.length > 1 ? `${spec.categories[categoryIndex]} · ${series.name}: ${value}` : `${spec.categories[categoryIndex]}: ${value}`
}

function layoutColumns(spec: ChartSpec): ChartLayout {
  const shapes: Shape[] = []
  const frame = drawFrame(spec, 8, shapes)
  const n = spec.series.length
  const gap = 2
  const band = frame.slot * 0.72
  const barWidth = Math.max(2, Math.min(24, (band - gap * (n - 1)) / n))
  const groupWidth = n * barWidth + gap * (n - 1)
  const baseline = frame.y(0)

  // Values on the caps only when there's one series and room for them —
  // a number on every bar of a grouped chart is unreadable.
  const labelCaps = n === 1 && spec.categories.length <= 12

  spec.series.forEach((series, s) => {
    series.values.forEach((value, c) => {
      const x = frame.x(c) - groupWidth / 2 + s * (barWidth + gap)
      const end = frame.y(value)
      if (value !== 0) {
        shapes.push({ kind: 'path', d: columnPath(x, barWidth, baseline, end), fill: SERIES_COLORS[s], tip: tipFor(spec, s, c) })
      }
      if (labelCaps) {
        const label = formatChartNumber(value)
        if (textWidth(label) <= frame.slot - 4) {
          shapes.push({
            kind: 'text',
            x: x + barWidth / 2,
            y: value >= 0 ? end - 6 : end + 15,
            text: label,
            size: FONT,
            fill: INK.primary,
            anchor: 'middle',
          })
        }
      }
    })
  })

  return { width: WIDTH, height: frame.bottom + 30, shapes }
}

function layoutLines(spec: ChartSpec): ChartLayout {
  const shapes: Shape[] = []
  const n = spec.series.length
  const last = spec.categories.length - 1

  // Room on the right for a value at the end of each line — but only for
  // a few lines, and only if those labels won't sit on top of each other.
  const endLabels = spec.series.map((s) => formatChartNumber(s.values[last]))
  const wantEndLabels = n <= 4
  const rightPad = wantEndLabels ? Math.ceil(Math.max(...endLabels.map((l) => textWidth(l)))) + 16 : 12
  const frame = drawFrame(spec, rightPad, shapes)

  const showMarkers = spec.categories.length <= 24
  spec.series.forEach((series, s) => {
    const points = series.values.map((value, c) => ({ x: frame.x(c), y: frame.y(value) }))
    if (points.length > 1) {
      shapes.push({
        kind: 'path',
        d: points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' '),
        stroke: SERIES_COLORS[s],
        strokeWidth: 2,
      })
    }
    if (showMarkers) {
      points.forEach((p, c) => {
        // The white ring keeps a marker legible where lines cross.
        shapes.push({ kind: 'circle', cx: p.x, cy: p.y, r: 4, fill: SERIES_COLORS[s], stroke: INK.surface, strokeWidth: 2, tip: tipFor(spec, s, c) })
      })
    }
  })

  if (wantEndLabels) {
    const ends = spec.series.map((series) => frame.y(series.values[last])).sort((a, b) => a - b)
    const collide = ends.some((y, i) => i > 0 && y - ends[i - 1] < 13)
    if (!collide) {
      spec.series.forEach((series, s) => {
        shapes.push({
          kind: 'text',
          x: frame.x(last) + 9,
          y: frame.y(series.values[last]) + 4,
          text: endLabels[s],
          size: FONT,
          fill: INK.primary,
          anchor: 'start',
        })
      })
    }
  }

  return { width: WIDTH, height: frame.bottom + 30, shapes }
}

// --- Pie -----------------------------------------------------------------

// Dark or white text, whichever reads better on a given fill.
function inkOn(hex: string): string {
  const channel = (i: number) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  const luminance = 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
  return luminance > 0.36 ? INK.primary : '#ffffff'
}

const MAX_SLICES = 6

export interface PieSlice {
  label: string
  value: number
  color: string
}

// A pie shows shares of one total: the first series only, positive values
// only. Past six slices the eye can't compare them, so the smallest are
// combined into "Other" (each remaining slice keeps its own colour).
export function pieSlices(spec: ChartSpec): PieSlice[] {
  const all = spec.categories
    .map((label, i) => ({ label, value: spec.series[0].values[i], color: SERIES_COLORS[i % SERIES_COLORS.length] }))
    .filter((slice) => slice.value > 0)
  if (all.length <= MAX_SLICES) return all.map((slice, i) => ({ ...slice, color: SERIES_COLORS[i] }))

  const keep = new Set([...all].sort((a, b) => b.value - a.value).slice(0, MAX_SLICES - 1))
  const kept = all.filter((slice) => keep.has(slice)).map((slice, i) => ({ ...slice, color: SERIES_COLORS[i] }))
  const otherValue = all.filter((slice) => !keep.has(slice)).reduce((sum, slice) => sum + slice.value, 0)
  return [...kept, { label: 'Other', value: otherValue, color: OTHER_COLOR }]
}

function layoutPie(spec: ChartSpec): ChartLayout {
  const shapes: Shape[] = []
  const slices = pieSlices(spec)
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  const radius = 118
  const cx = radius + 6
  const cy = radius + 10
  const height = Math.max(cy + radius + 10, 24 + slices.length * 24)

  if (total <= 0) {
    shapes.push({ kind: 'text', x: 0, y: 20, text: 'A pie chart needs at least one value above zero.', size: 12, fill: INK.muted, anchor: 'start' })
    return { width: WIDTH, height: 40, shapes }
  }

  const percent = (value: number) => `${((value / total) * 100).toFixed(value / total < 0.1 ? 1 : 0)}%`
  const point = (angle: number, r: number) => ({ x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) })

  let angle = 0
  slices.forEach((slice) => {
    const sweep = (slice.value / total) * Math.PI * 2
    const tip = `${slice.label}: ${formatChartNumber(slice.value)} (${percent(slice.value)})`
    if (slices.length === 1) {
      shapes.push({ kind: 'circle', cx, cy, r: radius, fill: slice.color, tip })
    } else {
      const start = point(angle, radius)
      const end = point(angle + sweep, radius)
      shapes.push({
        kind: 'path',
        d: `M${cx},${cy} L${start.x.toFixed(2)},${start.y.toFixed(2)} A${radius},${radius} 0 ${sweep > Math.PI ? 1 : 0} 1 ${end.x.toFixed(2)},${end.y.toFixed(2)} Z`,
        fill: slice.color,
        // A white gap, not an outline: it separates neighbouring slices
        // without adding ink that looks like data.
        stroke: INK.surface,
        strokeWidth: 2,
        tip,
      })
    }
    // Percentage inside the slice only where it comfortably fits.
    if (sweep >= 0.42) {
      const mid = point(angle + sweep / 2, slices.length === 1 ? 0 : radius * 0.64)
      shapes.push({ kind: 'text', x: mid.x, y: mid.y + 4, text: percent(slice.value), size: 12, fill: inkOn(slice.color), anchor: 'middle', bold: true })
    }
    angle += sweep
  })

  // The legend carries every label and value, so nothing depends on
  // telling two colours apart or on a slice being big enough to label.
  const legendX = cx + radius + 36
  const valueX = WIDTH - 4
  const startY = Math.max(16, cy - (slices.length * 24) / 2 + 8)
  slices.forEach((slice, i) => {
    const y = startY + i * 24
    const value = `${formatChartNumber(slice.value)} (${percent(slice.value)})`
    shapes.push({ kind: 'rect', x: legendX, y: y - 9, width: 10, height: 10, fill: slice.color, rx: 2 })
    shapes.push({
      kind: 'text',
      x: legendX + 16,
      y,
      text: truncate(slice.label, valueX - legendX - 16 - textWidth(value) - 12),
      size: FONT,
      fill: INK.secondary,
      anchor: 'start',
    })
    shapes.push({ kind: 'text', x: valueX, y, text: value, size: FONT, fill: INK.primary, anchor: 'end' })
  })

  return { width: WIDTH, height, shapes }
}

export function layoutChart(spec: ChartSpec): ChartLayout {
  if (spec.type === 'pie') return layoutPie(spec)
  if (spec.type === 'line') return layoutLines(spec)
  return layoutColumns(spec)
}
