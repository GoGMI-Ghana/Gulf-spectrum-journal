// Turns an article's (already sanitized) rich-text HTML into react-pdf
// elements. The PDF renderer has no HTML support of its own, so each tag
// the sanitizer allows (lib/sanitizeArticleHtml.ts) is mapped by hand
// here — if a tag is added to that allowlist, add it here too, or it
// falls through as plain text.
//
// Images are fetched and re-encoded up front (prepareImages), because the
// PDF renderer accepts only JPEG and PNG while the journal's uploads may
// be WebP, and because building the element tree itself is synchronous.

import type { ReactNode } from 'react'
import { Image, Link, Text, View } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import { parseDocument } from 'htmlparser2'
import type { ChildNode, Element } from 'domhandler'
import sharp from 'sharp'
import { parseChartSpec } from '../chart/spec'
import { renderChartPdf } from './chartPdf'
import { PDF_COLUMN_WIDTH, pdfStyles } from './styles'

export interface PdfImage {
  data: Buffer
  format: 'png' | 'jpg'
  // Pixel size of `data`, for working out its size on the page.
  width: number
  height: number
}

const IMAGE_TIMEOUT_MS = 10_000
const IMAGE_MAX_BYTES = 8 * 1024 * 1024
// Print width of the text column is ~16cm; this is plenty at 200dpi and
// keeps a photo-heavy article's PDF to a sensible size.
const IMAGE_MAX_WIDTH = 1400
// Tallest a figure may be on the page (points) — leaves room for a caption.
const IMAGE_MAX_HEIGHT = 400

const isElement = (node: ChildNode): node is Element => node.type === 'tag'

function collectImageSources(nodes: ChildNode[], into: Set<string>) {
  for (const node of nodes) {
    if (!isElement(node)) continue
    if (node.name === 'img' && node.attribs.src) into.add(node.attribs.src)
    collectImageSources(node.children, into)
  }
}

async function loadImage(src: string): Promise<PdfImage | null> {
  try {
    // The sanitizer only lets https image URLs through; checked again
    // here since this is a server-side fetch of an editor-supplied URL.
    if (!src.startsWith('https://')) return null
    const res = await fetch(src, { signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) })
    if (!res.ok) return null
    const input = Buffer.from(await res.arrayBuffer())
    if (input.byteLength > IMAGE_MAX_BYTES) return null

    const image = sharp(input).rotate().resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
    const { format } = await sharp(input).metadata()
    // Charts and diagrams (PNG, or WebP which may be either) stay
    // lossless so lines and text remain crisp; photos stay JPEG.
    const isPhoto = format === 'jpeg'
    const { data, info } = await (isPhoto ? image.jpeg({ quality: 85 }) : image.flatten({ background: '#ffffff' }).png()).toBuffer({
      resolveWithObject: true,
    })
    return { data, format: isPhoto ? 'jpg' : 'png', width: info.width, height: info.height }
  } catch (err) {
    // A missing image shouldn't cost the reader the whole PDF.
    console.error('Failed to load an image for the article PDF', src, err)
    return null
  }
}

export async function prepareImages(htmlFragments: string[]): Promise<Map<string, PdfImage>> {
  const sources = new Set<string>()
  for (const html of htmlFragments) collectImageSources(parseDocument(html).children, sources)
  const loaded = await Promise.all([...sources].map(async (src) => [src, await loadImage(src)] as const))
  return new Map(loaded.filter((entry): entry is [string, PdfImage] => entry[1] !== null))
}

// --- Inline content (inside a paragraph, heading, cell…) ---------------

const INLINE_STYLES: Record<string, Style> = {
  strong: { fontWeight: 'bold' },
  b: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
  i: { fontStyle: 'italic' },
  u: { textDecoration: 'underline' },
  s: { textDecoration: 'line-through' },
  sup: { fontSize: 7 },
  sub: { fontSize: 7 },
}

function renderInline(nodes: ChildNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}-${i}`
    if (node.type === 'text') return node.data
    if (!isElement(node)) return null
    if (node.name === 'br') return '\n'
    if (node.name === 'a' && node.attribs.href) {
      return (
        <Link key={key} src={node.attribs.href} style={pdfStyles.link}>
          {renderInline(node.children, key)}
        </Link>
      )
    }
    const style = INLINE_STYLES[node.name]
    const children = renderInline(node.children, key)
    return style ? (
      <Text key={key} style={style}>
        {children}
      </Text>
    ) : (
      children
    )
  })
}

// --- Block content -----------------------------------------------------

const BLOCK_TAGS = new Set(['p', 'h3', 'h4', 'ul', 'ol', 'blockquote', 'hr', 'img', 'figure', 'table', 'div'])

// An image's size on the page, in points. Given explicitly rather than
// left to the layout engine: with only max-width/max-height it couldn't
// tell how tall a figure was before placing it, and split captions from
// their pictures across pages. Images appear at the size they'd have in
// a Word document (96 pixels to the inch), shrunk to fit the text column
// or a sensible height.
function imageSize(image: PdfImage): { width: number; height: number } {
  let width = Math.min(image.width * 0.75, PDF_COLUMN_WIDTH)
  let height = (width * image.height) / image.width
  if (height > IMAGE_MAX_HEIGHT) {
    height = IMAGE_MAX_HEIGHT
    width = (height * image.width) / image.height
  }
  return { width, height }
}

function renderImage(node: Element, caption: string | null, images: Map<string, PdfImage>, key: string): ReactNode {
  const image = images.get(node.attribs.src ?? '')
  if (!image) return null
  return (
    <View key={key} style={pdfStyles.figure} wrap={false}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image has no alt prop */}
      <Image src={{ data: image.data, format: image.format }} style={[pdfStyles.image, imageSize(image)]} />
      {caption ? <Text style={pdfStyles.caption}>{caption}</Text> : null}
    </View>
  )
}

function textContent(node: ChildNode): string {
  if (node.type === 'text') return node.data
  return isElement(node) ? node.children.map(textContent).join('') : ''
}

function renderTable(table: Element, images: Map<string, PdfImage>, key: string): ReactNode {
  const rows: Element[] = []
  const collectRows = (nodes: ChildNode[]) => {
    for (const node of nodes) {
      if (!isElement(node)) continue
      if (node.name === 'tr') rows.push(node)
      else collectRows(node.children)
    }
  }
  collectRows(table.children)

  return (
    <View key={key} style={pdfStyles.table}>
      {rows.map((row, r) => (
        <View key={r} style={pdfStyles.tableRow} wrap={false}>
          {row.children.filter(isElement).map((cell, c) => (
            <View
              key={c}
              style={[
                pdfStyles.tableCell,
                { flex: Number(cell.attribs.colspan) || 1 },
                cell.name === 'th' ? pdfStyles.tableHeaderCell : {},
              ]}
            >
              {renderBlocks(cell.children, images, `${key}-${r}-${c}`, cell.name === 'th' ? pdfStyles.tableHeaderText : pdfStyles.tableText)}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

function renderList(list: Element, images: Map<string, PdfImage>, key: string, textStyle: Style): ReactNode {
  const ordered = list.name === 'ol'
  return (
    <View key={key} style={pdfStyles.list}>
      {list.children.filter(isElement).map((item, i) => (
        <View key={i} style={pdfStyles.listItem}>
          <Text style={[textStyle, pdfStyles.listMarker]}>{ordered ? `${i + 1}.` : '•'}</Text>
          <View style={pdfStyles.listBody}>{renderBlocks(item.children, images, `${key}-${i}`, textStyle)}</View>
        </View>
      ))}
    </View>
  )
}

// `textStyle` is the paragraph style in force — it differs inside table
// cells and quotations.
export function renderBlocks(
  nodes: ChildNode[],
  images: Map<string, PdfImage>,
  keyPrefix: string,
  textStyle: Style = pdfStyles.paragraph
): ReactNode[] {
  const out: ReactNode[] = []
  // Loose text and inline tags that sit directly among blocks (a list
  // item's bare text, say) are gathered into one paragraph.
  let inlineRun: ChildNode[] = []
  const flushInline = () => {
    if (inlineRun.some((n) => textContent(n).trim() !== '')) {
      const key = `${keyPrefix}-i${out.length}`
      out.push(
        <Text key={key} style={textStyle}>
          {renderInline(inlineRun, key)}
        </Text>
      )
    }
    inlineRun = []
  }

  nodes.forEach((node, i) => {
    const key = `${keyPrefix}-${i}`
    if (!isElement(node) || !BLOCK_TAGS.has(node.name)) {
      inlineRun.push(node)
      return
    }
    flushInline()

    switch (node.name) {
      case 'p':
        if (textContent(node).trim() !== '') {
          out.push(
            <Text key={key} style={textStyle}>
              {renderInline(node.children, key)}
            </Text>
          )
        }
        break
      case 'h3':
      case 'h4':
        out.push(
          <Text key={key} style={pdfStyles.subheading} minPresenceAhead={40}>
            {renderInline(node.children, key)}
          </Text>
        )
        break
      case 'ul':
      case 'ol':
        out.push(renderList(node, images, key, textStyle))
        break
      case 'blockquote':
        out.push(
          <View key={key} style={pdfStyles.blockquote}>
            {renderBlocks(node.children, images, key, pdfStyles.quoteText)}
          </View>
        )
        break
      case 'hr':
        out.push(<View key={key} style={pdfStyles.rule} />)
        break
      case 'img':
        out.push(renderImage(node, null, images, key))
        break
      case 'figure': {
        const img = node.children.filter(isElement).find((c) => c.name === 'img')
        const caption = node.children.filter(isElement).find((c) => c.name === 'figcaption')
        if (img) out.push(renderImage(img, caption ? textContent(caption).trim() : null, images, key))
        break
      }
      case 'table':
        out.push(renderTable(node, images, key))
        break
      case 'div': {
        // A chart made in the editor (left as a placeholder by the
        // sanitizer's 'keep' mode), drawn here as vectors…
        const chart = 'data-chart' in node.attribs ? parseChartSpec(node.attribs['data-chart']) : null
        if (chart) out.push(renderChartPdf(chart, key))
        // …otherwise the sanitizer's scroll wrapper around a table.
        else out.push(...renderBlocks(node.children, images, key, textStyle))
        break
      }
    }
  })
  flushInline()
  return out
}

export function htmlToPdf(html: string, images: Map<string, PdfImage>, keyPrefix: string): ReactNode[] {
  return renderBlocks(parseDocument(html).children, images, keyPrefix)
}

// Text from before the rich-text editor: blank line = new paragraph.
export function plainTextToPdf(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(/\n{2,}/)
    .filter((para) => para.trim() !== '')
    .map((para, i) => (
      <Text key={`${keyPrefix}-${i}`} style={pdfStyles.paragraph}>
        {para.trim()}
      </Text>
    ))
}

