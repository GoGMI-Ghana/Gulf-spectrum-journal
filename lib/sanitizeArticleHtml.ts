// Cleans article rich text before it's put on a public page. Server-only
// (sanitize-html is a Node library) — it runs when a page is generated,
// not in the browser.
//
// The HTML comes from the admin editor, but the editor is not the
// boundary: an editor account writes straight to the database, so it
// could store anything. This allowlist is what guarantees that only
// formatting reaches readers — no scripts, event handlers, inline styles,
// iframes, or javascript: links.
import sanitizeHtml from 'sanitize-html'
import { parseChartSpec } from './chart/spec'
import { chartToHtml } from './chart/svg'

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'sup', 'sub',
    'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'hr',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    // Only as the placeholder for an editor-made chart — see the div
    // transform below.
    'div',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    div: ['data-chart'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['https'] },
  allowProtocolRelative: false,
  // An image whose src was rejected above (or was never there) would be
  // left as an empty <img> — drop it instead.
  exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src,
  transformTags: {
    // Every link opens in a new tab without handing the new page a
    // reference back to this one.
    a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' } }),
    // A div survives only as a chart placeholder. Any other div becomes a
    // tag that isn't on the allowlist, so it's removed and its contents
    // kept — the same as every other unknown tag.
    div: (tagName, attribs) => ('data-chart' in attribs ? { tagName, attribs } : { tagName: 'unwrap', attribs: {} }),
  },
}

const ENTITIES: Record<string, string> = {
  '&quot;': '"',
  '&#34;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
}
const decodeAttribute = (value: string) => value.replace(/&(?:quot|#34|#39|#x27|lt|gt|amp);/g, (entity) => ENTITIES[entity])

const CHART_PLACEHOLDER = /<div data-chart="([^"]*)"><\/div>/g

// `charts`: the web page wants each chart placeholder replaced by its
// drawing ('html'). The PDF builder draws charts itself, as vectors, so it
// asks for the placeholders to be left in place ('keep').
export function sanitizeArticleHtml(html: string, { charts = 'html' }: { charts?: 'html' | 'keep' } = {}): string {
  const clean = sanitizeHtml(html, OPTIONS)
    // An image's caption is stored as its title attribute (that's what
    // the editor's image node has); show it as a real caption. Runs on
    // the sanitized output, where attribute values are already escaped.
    .replace(/<img\b([^>]*?)\s+title="([^"]*)"([^>]*?)\s*\/?>/g, (_match, before: string, caption: string, after: string) =>
      caption.trim() ? `<figure><img${before}${after} /><figcaption>${caption}</figcaption></figure>` : `<img${before}${after} />`
    )
    // Wide tables scroll sideways on a phone instead of breaking the page.
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, '</table></div>')

  if (charts === 'keep') return clean
  // Last, so the chart's own markup isn't touched by the steps above. The
  // stored data is validated before anything is drawn from it; a
  // placeholder that doesn't hold a valid chart simply disappears.
  return clean.replace(CHART_PLACEHOLDER, (_match, data: string) => {
    const spec = parseChartSpec(decodeAttribute(data))
    return spec ? chartToHtml(spec) : ''
  })
}
