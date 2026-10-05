// Fonts, colours and styles for the article PDF (lib/pdf/articlePdf.tsx).
//
// Noto Serif is bundled (lib/pdf/fonts, SIL Open Font License) rather than
// using the PDF format's built-in Times/Helvetica: those only cover
// Western European characters, and this journal's author names and
// place names regularly need more (ɛ, ɔ, ŋ, accented Latin).
import path from 'node:path'
import { Font, StyleSheet } from '@react-pdf/renderer'

const FONT_DIR = path.join(process.cwd(), 'lib', 'pdf', 'fonts')

Font.register({
  family: 'Noto Serif',
  fonts: [
    { src: path.join(FONT_DIR, 'NotoSerif-Regular.ttf') },
    { src: path.join(FONT_DIR, 'NotoSerif-Italic.ttf'), fontStyle: 'italic' },
    { src: path.join(FONT_DIR, 'NotoSerif-Bold.ttf'), fontWeight: 'bold' },
    { src: path.join(FONT_DIR, 'NotoSerif-BoldItalic.ttf'), fontWeight: 'bold', fontStyle: 'italic' },
  ],
})

// No automatic hyphenation: the built-in rules are English-only and
// mangle names and non-English terms.
Font.registerHyphenationCallback((word) => [word])

// A4 is 595.28pt wide; this is the side margin, and what's left between
// the margins is the text column.
const PAGE_MARGIN = 62
export const PDF_COLUMN_WIDTH = 595.28 - PAGE_MARGIN * 2

// Body text. Every style that sets a lineHeight also states its own
// fontSize: react-pdf resolves a unitless lineHeight against the font
// size in the SAME style object (falling back to 18pt, not the inherited
// size), so a lineHeight on its own comes out double-spaced.
const BODY_FONT_SIZE = 10.5
const BODY_LINE_HEIGHT = 1.55

// The site's palette (app/globals.css).
export const pdfColors = {
  royalBlue: '#003366',
  gold: '#b8860b',
  ink: '#12202e',
  body: '#1f2937',
  muted: '#64748b',
  rule: '#cbd5e1',
  tint: '#f1f5f9',
}

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'Noto Serif',
    fontSize: BODY_FONT_SIZE,
    // No lineHeight here, deliberately: set on the page it breaks the
    // page-number text (react-pdf mis-measures render-prop text that
    // inherits a line height, and it either vanishes or the render
    // throws). Each text style below sets its own instead.
    color: pdfColors.body,
    paddingTop: 64,
    paddingBottom: 60,
    paddingHorizontal: PAGE_MARGIN,
  },

  // Running header and footer (fixed: repeated on every page).
  header: {
    position: 'absolute',
    top: 28,
    left: PAGE_MARGIN,
    right: PAGE_MARGIN,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: pdfColors.muted,
    borderBottomWidth: 0.75,
    borderBottomColor: pdfColors.gold,
    paddingBottom: 6,
  },
  // Two separately positioned fixed Texts (the documented pattern for
  // page numbers) rather than one row View.
  footerLeft: { position: 'absolute', bottom: 28, left: PAGE_MARGIN, fontSize: 8, color: pdfColors.muted },
  // Spans the full column and right-aligns within it: the page number is
  // filled in after layout, so anchored by `right` alone it has no width
  // to be laid out in and never draws.
  footerRight: {
    position: 'absolute',
    bottom: 28,
    left: PAGE_MARGIN,
    right: PAGE_MARGIN,
    textAlign: 'right',
    fontSize: 8,
    color: pdfColors.muted,
  },

  // Title block.
  kicker: { fontSize: 8.5, letterSpacing: 1.5, textTransform: 'uppercase', color: pdfColors.gold, marginBottom: 8 },
  title: { fontSize: 21, lineHeight: 1.25, fontWeight: 'bold', color: pdfColors.royalBlue, marginBottom: 14 },
  authorName: { fontSize: 11, lineHeight: 1.4, fontWeight: 'bold', color: pdfColors.ink },
  authorAffiliation: { fontSize: 9, lineHeight: 1.4, color: pdfColors.muted, marginBottom: 5 },

  abstractBox: {
    marginTop: 12,
    marginBottom: 10,
    padding: 12,
    backgroundColor: pdfColors.tint,
    borderLeftWidth: 2.5,
    borderLeftColor: pdfColors.royalBlue,
  },
  label: { fontSize: 8.5, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 'bold', color: pdfColors.royalBlue, marginBottom: 5 },
  abstractText: { fontSize: BODY_FONT_SIZE, lineHeight: BODY_LINE_HEIGHT, textAlign: 'justify' },
  keywords: { fontSize: 9.5, lineHeight: 1.45, marginBottom: 6 },

  // Body.
  sectionHeading: { fontSize: 14, lineHeight: 1.3, fontWeight: 'bold', color: pdfColors.royalBlue, marginTop: 18, marginBottom: 7 },
  subheading: { fontSize: 11.5, lineHeight: 1.35, fontWeight: 'bold', color: pdfColors.royalBlue, marginTop: 10, marginBottom: 5 },
  paragraph: { marginBottom: 8, fontSize: BODY_FONT_SIZE, lineHeight: BODY_LINE_HEIGHT, textAlign: 'justify' },
  link: { color: '#0066cc', textDecoration: 'underline' },

  list: { marginBottom: 6 },
  listItem: { flexDirection: 'row', marginBottom: 1 },
  listMarker: { width: 16, marginBottom: 0, textAlign: 'left' },
  listBody: { flex: 1 },

  blockquote: { borderLeftWidth: 2, borderLeftColor: pdfColors.gold, paddingLeft: 10, marginVertical: 4 },
  quoteText: { marginBottom: 6, fontSize: BODY_FONT_SIZE, lineHeight: BODY_LINE_HEIGHT, fontStyle: 'italic', color: '#475569' },

  rule: { borderBottomWidth: 0.75, borderBottomColor: pdfColors.rule, marginVertical: 12 },

  figure: { marginVertical: 10 },
  // Width and height are set per image (see imageSize in htmlToPdf.tsx).
  image: { alignSelf: 'center' },
  caption: { width: '100%', marginTop: 5, fontSize: 8.5, lineHeight: 1.4, color: pdfColors.muted, textAlign: 'center' },

  table: { marginVertical: 8, borderTopWidth: 0.75, borderLeftWidth: 0.75, borderColor: pdfColors.rule },
  tableRow: { flexDirection: 'row' },
  tableCell: { paddingVertical: 4, paddingHorizontal: 5, borderRightWidth: 0.75, borderBottomWidth: 0.75, borderColor: pdfColors.rule },
  tableHeaderCell: { backgroundColor: pdfColors.tint },
  tableText: { fontSize: 9, lineHeight: 1.4, marginBottom: 2 },
  tableHeaderText: { fontSize: 9, lineHeight: 1.4, marginBottom: 2, fontWeight: 'bold', color: pdfColors.royalBlue },

  // End matter.
  reference: { flexDirection: 'row', marginBottom: 4 },
  referenceNumber: { width: 20, fontSize: 9.5 },
  referenceText: { flex: 1, fontSize: 9.5, lineHeight: 1.45 },
  citeBox: { marginTop: 18, padding: 10, borderWidth: 0.75, borderColor: pdfColors.rule },
  citeText: { fontSize: 9.5, lineHeight: 1.45 },
  smallPrint: { marginTop: 10, fontSize: 8, color: pdfColors.muted },
})
