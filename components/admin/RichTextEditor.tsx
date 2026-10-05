'use client'

// The article body editor: a toolbar over a WYSIWYG area, for the
// formatting a journal article needs — emphasis, sub-headings, lists,
// quotes, links, images and tables — and nothing more. Text pasted from
// Word keeps the formatting this supports and drops the rest (fonts,
// colours, sizes), so articles stay visually consistent.
//
// Produces HTML, stored in articles.sections[].body / articles.conclusion
// and sanitized again when rendered publicly (lib/sanitizeArticleHtml.ts)
// — this editor shapes what editors can easily do, it isn't the security
// boundary.

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import {
  Bold,
  Italic,
  Underline,
  Heading,
  List,
  ListOrdered,
  TextQuote,
  Link2,
  ImagePlus,
  Table,
  Undo2,
  Redo2,
} from 'lucide-react'
import { JOURNAL_IMAGE_ACCEPT, uploadJournalImage } from '@/lib/journalImages'
import { isEmptyRichText } from '@/lib/richText'

// "" and "<p></p>" are the same (empty) document.
const normalize = (html: string) => (isEmptyRichText(html) ? '' : html)

// The picture to upload from a paste, if the paste is "just a picture" —
// a chart copied in Excel, a picture copied in Word, a screenshot.
// Excel also puts a picture on the clipboard when CELLS are copied, and
// Word does when text and a picture are copied together; in both cases
// the real content is the table or the text, so those are left to the
// editor's normal paste.
function pastedPicture(data: DataTransfer | null): File | null {
  if (!data) return null
  const picture = [...data.files].find((file) => file.type.startsWith('image/'))
  if (!picture) return null
  if (/<table\b/i.test(data.getData('text/html'))) return null
  if (data.getData('text/plain').trim() !== '') return null
  return picture
}

// Pictures inside pasted Word text point at files on the author's own
// computer (file://…), which nobody else can load. Drop them rather than
// leave broken images; they're pasted in one at a time instead.
function dropUnloadableImages(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => (/\ssrc=["']https:\/\//i.test(tag) ? tag : ''))
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the text selection: without this the click blurs the editor
      // first and the command applies to nothing.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs transition-colors disabled:opacity-40 ${
        active ? 'bg-royal-blue text-white' : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="w-px self-stretch bg-slate-300 mx-1" />
}

function Toolbar({ editor, onPickImage, uploading }: { editor: Editor; onPickImage: () => void; uploading: boolean }) {
  function handleLink() {
    const current = editor.getAttributes('link').href as string | undefined
    const url = prompt('Link address (leave empty to remove the link)', current ?? 'https://')
    if (url === null) return
    if (url.trim() === '' || url.trim() === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const inTable = editor.isActive('table')

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-300 bg-slate-50 px-1.5 py-1">
      <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton
        label="Sub-heading"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading size={15} />
      </ToolbarButton>
      <ToolbarButton label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton label="Quotation" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <TextQuote size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton label="Link" active={editor.isActive('link')} onClick={handleLink}>
        <Link2 size={15} />
      </ToolbarButton>
      <ToolbarButton label="Insert image" disabled={uploading} onClick={onPickImage}>
        <ImagePlus size={15} />
        {uploading && 'Uploading…'}
      </ToolbarButton>
      <ToolbarButton
        label="Insert table"
        disabled={inTable}
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <Table size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 size={15} />
      </ToolbarButton>

      {/* Only while the cursor is inside a table. */}
      {inTable && (
        <div className="flex flex-wrap items-center gap-0.5 basis-full border-t border-slate-200 mt-1 pt-1">
          <span className="text-[11px] text-slate-400 px-1.5">Table:</span>
          <ToolbarButton label="Add row below" onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row</ToolbarButton>
          <ToolbarButton label="Add column to the right" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Column</ToolbarButton>
          <ToolbarButton label="Delete this row" onClick={() => editor.chain().focus().deleteRow().run()}>− Row</ToolbarButton>
          <ToolbarButton label="Delete this column" onClick={() => editor.chain().focus().deleteColumn().run()}>− Column</ToolbarButton>
          <ToolbarButton label="Delete the whole table" onClick={() => editor.chain().focus().deleteTable().run()}>Delete table</ToolbarButton>
        </div>
      )}
    </div>
  )
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  // The paste/drop handlers below are created once with the editor, but
  // need the current handleFile (which closes over that editor).
  const handleFileRef = useRef<(file: File) => void>(() => {})

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // One sub-heading level: the section's own heading is the H2.
        heading: { levels: [3] },
        code: false,
        codeBlock: false,
        strike: false,
        link: { openOnClick: false, autolink: true, protocols: ['http', 'https', 'mailto'] },
      }),
      Image,
      TableKit.configure({ table: { resizable: false } }),
    ],
    content: value,
    // This component is server-rendered first (the admin pages aren't
    // client-only); rendering the editor immediately would mismatch.
    immediatelyRender: false,
    // Re-render on every change so the toolbar's active/disabled states
    // follow the cursor.
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: 'article-body min-h-32 px-3 py-2 focus:outline-none',
        ...(placeholder ? { 'aria-label': placeholder } : {}),
      },
      handlePaste: (_view, event) => {
        const picture = pastedPicture(event.clipboardData)
        if (!picture) return false
        event.preventDefault()
        handleFileRef.current(picture)
        return true
      },
      handleDrop: (_view, event) => {
        const picture = [...(event.dataTransfer?.files ?? [])].find((file) => file.type.startsWith('image/'))
        if (!picture) return false
        event.preventDefault()
        handleFileRef.current(picture)
        return true
      },
      transformPastedHTML: dropUnloadableImages,
    },
    onUpdate: ({ editor: current }) => onChange(normalize(current.getHTML())),
  })

  // The editor owns its content once created. Push `value` in only when
  // it changes from outside — the article finishing loading, or sections
  // being reordered (which reuses editors by position) — never as an echo
  // of this editor's own edit, which would reset the cursor.
  useEffect(() => {
    if (!editor) return
    if (normalize(value) !== normalize(editor.getHTML())) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  async function handleFile(file: File) {
    if (!editor) return
    setUploadError(null)
    setUploading(true)
    const result = await uploadJournalImage(file, 'articles')
    setUploading(false)
    if (result.error !== null) {
      setUploadError(result.error)
      return
    }
    const caption = prompt('Caption for this image (optional). It is shown under the image.')?.trim() ?? ''
    // The caption doubles as the image's description for screen readers.
    editor.chain().focus().setImage({ src: result.url, alt: caption, title: caption }).run()
  }

  useEffect(() => {
    handleFileRef.current = handleFile
  })

  return (
    <div className="border border-slate-300 focus-within:border-royal-blue bg-white">
      {editor && <Toolbar editor={editor} uploading={uploading} onPickImage={() => fileRef.current?.click()} />}
      <EditorContent editor={editor} />
      <p className="text-[11px] text-slate-400 px-3 py-1.5 border-t border-slate-200">
        To add a chart from Excel or a picture from Word, copy it on its own and paste it here — or drag an image file in.
      </p>
      <input
        ref={fileRef}
        type="file"
        accept={JOURNAL_IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          // Reset so choosing the same file again still fires onChange.
          e.target.value = ''
          if (file) handleFile(file)
        }}
      />
      {uploadError && <p className="text-sm text-red-700 px-3 py-2 border-t border-slate-200">{uploadError}</p>}
    </div>
  )
}
