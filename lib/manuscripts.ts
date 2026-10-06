// The rules for manuscript files attached to a submission — shared by the
// public form (to check before uploading), the routes that issue the
// upload URL and record the file, and the admin panel. No server or
// browser dependencies. The same limits are set on the Storage bucket
// itself (backend migration submission_manuscripts), which is what
// actually enforces them.

export const MANUSCRIPT_BUCKET = 'manuscripts'
export const MANUSCRIPT_MAX_BYTES = 15 * 1024 * 1024
export const MANUSCRIPT_MAX_MB = 15

// Keyed by extension rather than by the browser-reported type: browsers
// often report no type at all for .doc and .rtf, depending on what's
// installed on the author's computer.
const CONTENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  odt: 'application/vnd.oasis.opendocument.text',
  rtf: 'application/rtf',
}

export const MANUSCRIPT_ACCEPT = Object.keys(CONTENT_TYPES)
  .map((ext) => `.${ext}`)
  .join(',')

export function manuscriptExtension(fileName: string): string | null {
  const ext = fileName.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]
  return ext && ext in CONTENT_TYPES ? ext : null
}

export const manuscriptContentType = (extension: string) => CONTENT_TYPES[extension]

// Where the upload-url route puts files: a random name it chose itself,
// under submissions/. The submission route checks a claimed path against
// this before recording it, so a submission can't be pointed at some
// other object.
export const MANUSCRIPT_PATH_PATTERN = /^submissions\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|doc|docx|odt|rtf)$/

// The author's own file name, kept only for display to editors.
export function cleanManuscriptName(fileName: string): string {
  return (fileName.split(/[\\/]/).pop() ?? '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 200)
}
