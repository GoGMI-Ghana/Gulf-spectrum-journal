// A chart as HTML for the web page and the editor preview: its title, the
// drawing as inline SVG, and a "view the data" table.
//
// Built as a string (not React) because article bodies are stored HTML
// that's assembled as a string on the server (lib/sanitizeArticleHtml.ts).
// Every piece of text that comes from the chart's data is escaped here.

import { layoutChart, pieSlices, type Shape } from './layout'
import { formatChartNumber, type ChartSpec } from './spec'

const escape = (value: string | number) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const round = (n: number) => Math.round(n * 100) / 100

// Hovering a mark shows its value, using the browser's own tooltip — no
// script, so it works in the statically generated page.
const tip = (text?: string) => (text ? `<title>${escape(text)}</title>` : '')

function shapeToSvg(shape: Shape): string {
  switch (shape.kind) {
    case 'path':
      return `<path d="${escape(shape.d)}" fill="${shape.fill ?? 'none'}"${
        shape.stroke ? ` stroke="${shape.stroke}" stroke-width="${shape.strokeWidth ?? 1}" stroke-linejoin="round" stroke-linecap="round"` : ''
      }>${tip(shape.tip)}</path>`
    case 'line':
      return `<line x1="${round(shape.x1)}" y1="${round(shape.y1)}" x2="${round(shape.x2)}" y2="${round(shape.y2)}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" />`
    case 'circle':
      return `<circle cx="${round(shape.cx)}" cy="${round(shape.cy)}" r="${shape.r}" fill="${shape.fill}"${
        shape.stroke ? ` stroke="${shape.stroke}" stroke-width="${shape.strokeWidth ?? 1}"` : ''
      }>${tip(shape.tip)}</circle>`
    case 'rect':
      return `<rect x="${round(shape.x)}" y="${round(shape.y)}" width="${shape.width}" height="${shape.height}" rx="${shape.rx ?? 0}" fill="${shape.fill}" />`
    case 'text':
      return `<text x="${round(shape.x)}" y="${round(shape.y)}" font-size="${shape.size}" fill="${shape.fill}" text-anchor="${shape.anchor}"${
        shape.bold ? ' font-weight="600"' : ''
      }>${escape(shape.text)}</text>`
  }
}

// The same numbers as a table: for screen readers, for anyone who can't
// tell two colours apart, and for readers who want the exact figures.
function dataTable(spec: ChartSpec): string {
  if (spec.type === 'pie') {
    const slices = pieSlices(spec)
    const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1
    const rows = slices
      .map((s) => `<tr><td>${escape(s.label)}</td><td>${formatChartNumber(s.value)}</td><td>${((s.value / total) * 100).toFixed(1)}%</td></tr>`)
      .join('')
    return `<table><thead><tr><th></th><th>${escape(spec.series[0].name || 'Value')}</th><th>Share</th></tr></thead><tbody>${rows}</tbody></table>`
  }
  const head = spec.series.map((s) => `<th>${escape(s.name)}</th>`).join('')
  const rows = spec.categories
    .map((category, i) => `<tr><td>${escape(category)}</td>${spec.series.map((s) => `<td>${formatChartNumber(s.values[i])}</td>`).join('')}</tr>`)
    .join('')
  return `<table><thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody></table>`
}

export function chartToHtml(spec: ChartSpec): string {
  const layout = layoutChart(spec)
  const label = spec.title || `${spec.type} chart`
  return [
    '<figure class="article-chart">',
    spec.title ? `<p class="article-chart-title">${escape(spec.title)}</p>` : '',
    `<svg viewBox="0 0 ${layout.width} ${round(layout.height)}" role="img" aria-label="${escape(label)}" font-family="inherit">`,
    layout.shapes.map(shapeToSvg).join(''),
    '</svg>',
    `<details><summary>View the data</summary><div class="table-scroll">${dataTable(spec)}</div></details>`,
    '</figure>',
  ].join('')
}
