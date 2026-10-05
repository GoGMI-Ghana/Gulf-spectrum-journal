// The data model for charts made in the article editor ("Insert chart"),
// and the parser for the cells an editor pastes in from Excel.
//
// A chart is stored inside the article's HTML as
//   <div data-chart='{"type":"column",...}'></div>
// — just its data, not a picture. The drawing is produced from that data
// each time it's needed (lib/chart/layout.ts): as SVG on the web page and
// in the editor, and as vector shapes in the PDF. Pure functions with no
// browser or server dependencies, so all three can share them.

export type ChartType = 'column' | 'line' | 'pie'

export interface ChartSeries {
  name: string
  values: number[] // one per category
}

export interface ChartSpec {
  type: ChartType
  title: string
  // What the numbers measure, shown above the value axis ("Incidents").
  valueLabel: string
  categories: string[]
  series: ChartSeries[]
}

export const CHART_TYPES: ChartType[] = ['column', 'line', 'pie']

// The palette has eight colours that stay distinguishable (including for
// colour-blind readers) only in this order — a ninth series can't be given
// a safe colour, so it isn't accepted.
export const MAX_SERIES = 8
export const MAX_CATEGORIES = 24
const MAX_TEXT = 120

const clean = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT)

// "1,234.5", "45%", "(12)" [accounting negative], " 7 " -> number.
function parseNumber(raw: string): number | null {
  let text = raw.replace(/[\s ]/g, '')
  if (text === '' || text === '-' || text === '—') return null
  let negative = false
  if (/^\(.*\)$/.test(text)) {
    negative = true
    text = text.slice(1, -1)
  }
  text = text.replace(/^[$£€₵]/, '').replace(/%$/, '').replace(/,/g, '')
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(text)) return null
  const value = Number(text)
  if (!Number.isFinite(value)) return null
  return negative ? -value : value
}

export type ParseResult = { ok: true; categories: string[]; series: ChartSeries[] } | { ok: false; error: string }

// Cells copied from Excel arrive as rows separated by newlines and columns
// by tabs. Expected shape: a header row naming each series, then one row
// per category:
//
//            Incidents   Boardings
//   2021     34          28
//   2022     19          15
//
// Comma-separated text is accepted too, for data typed by hand.
export function parseChartData(text: string): ParseResult {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')
  if (lines.length < 2) {
    return { ok: false, error: 'Paste at least two rows: a header row, then one row for each category.' }
  }
  const separator = lines.some((line) => line.includes('\t')) ? '\t' : ','
  // Excel wraps a cell in quotes when it contains a comma or a quote.
  const unquote = (cell: string) => cell.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"').trim()
  const rows = lines.map((line) => line.split(separator).map(unquote))
  const width = Math.max(...rows.map((row) => row.length))
  if (width < 2) {
    return { ok: false, error: 'Each row needs a label and at least one number, in separate columns.' }
  }

  const [header, ...body] = rows
  const seriesCount = width - 1
  if (seriesCount > MAX_SERIES) {
    return { ok: false, error: `A chart can show up to ${MAX_SERIES} series (columns of numbers) — this has ${seriesCount}.` }
  }
  if (body.length > MAX_CATEGORIES) {
    return { ok: false, error: `A chart can show up to ${MAX_CATEGORIES} categories (rows) — this has ${body.length}.` }
  }

  const categories = body.map((row, i) => clean(row[0]) || `Row ${i + 1}`)
  const series: ChartSeries[] = []
  for (let column = 1; column < width; column++) {
    const values: number[] = []
    for (let r = 0; r < body.length; r++) {
      const cell = body[r][column] ?? ''
      const value = parseNumber(cell)
      if (value === null) {
        const shown = cell === '' ? 'an empty cell' : `"${cell}"`
        return { ok: false, error: `Row ${r + 2}, column ${column + 1} has ${shown} where a number is expected.` }
      }
      values.push(value)
    }
    series.push({ name: clean(header[column]) || `Series ${column}`, values })
  }
  return { ok: true, categories, series }
}

// The reverse: a stored chart's data as tab-separated text, to refill the
// editing box.
export function chartDataToText(spec: Pick<ChartSpec, 'categories' | 'series'>): string {
  const header = ['', ...spec.series.map((s) => s.name)].join('\t')
  const rows = spec.categories.map((category, i) => [category, ...spec.series.map((s) => String(s.values[i]))].join('\t'))
  return [header, ...rows].join('\n')
}

// Validates anything claiming to be a chart — the stored attribute is
// editor-supplied text, so it's never trusted to have the right shape.
export function parseChartSpec(value: unknown): ChartSpec | null {
  let data = value
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      return null
    }
  }
  if (!data || typeof data !== 'object') return null
  const raw = data as Record<string, unknown>

  if (!CHART_TYPES.includes(raw.type as ChartType)) return null
  if (!Array.isArray(raw.categories) || !Array.isArray(raw.series)) return null
  if (raw.categories.length < 1 || raw.categories.length > MAX_CATEGORIES) return null
  if (raw.series.length < 1 || raw.series.length > MAX_SERIES) return null

  const categories = raw.categories.map(clean)
  const series: ChartSeries[] = []
  for (const item of raw.series as unknown[]) {
    if (!item || typeof item !== 'object') return null
    const { name, values } = item as Record<string, unknown>
    if (!Array.isArray(values) || values.length !== categories.length) return null
    if (!values.every((v) => typeof v === 'number' && Number.isFinite(v))) return null
    series.push({ name: clean(name), values: values as number[] })
  }

  return { type: raw.type as ChartType, title: clean(raw.title), valueLabel: clean(raw.valueLabel), categories, series }
}

export function formatChartNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
}
