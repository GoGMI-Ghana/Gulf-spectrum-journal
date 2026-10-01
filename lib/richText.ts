// Small pure helpers for article rich text (section bodies and the
// conclusion). Safe to import from the browser — the sanitizer, which is
// server-only, lives in lib/sanitizeArticleHtml.ts.
//
// Those fields hold HTML produced by the admin panel's editor
// (components/admin/RichTextEditor.tsx). They used to be plain text, so
// anything that doesn't look like HTML is still treated as plain text
// rather than assumed to be markup.

export function looksLikeHtml(value: string): boolean {
  return /^\s*<[a-z][\s\S]*>/i.test(value)
}

// The editor's empty document is "<p></p>", not "" — this is what
// "the editor has nothing in it" means for save-time checks.
export function isEmptyRichText(value: string): boolean {
  if (/<(img|table|hr)\b/i.test(value)) return false
  return value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() === ''
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// What to load into the editor: existing HTML as-is, or older plain text
// converted to paragraphs (blank line = new paragraph, single newline =
// line break) so its line structure survives being opened and re-saved.
export function toEditorHtml(value: string): string {
  if (!value.trim()) return ''
  if (looksLikeHtml(value)) return value
  return value
    .split(/\n{2,}/)
    .map((para) => `<p>${escapeHtml(para.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('')
}
