'use client'

// Small shared building blocks for the /admin pages — kept here rather
// than repeated in every manager component (topics/authors/issues/
// articles/users all need the same input styling, a labeled field
// wrapper, and an editable string-array control for things like
// keywords and references).

import { X, Plus } from 'lucide-react'
import type { ReactNode } from 'react'

export const inputClass =
  'w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue'
export const primaryButtonClass =
  'bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-5 py-2 text-sm transition-colors disabled:opacity-60'
export const secondaryButtonClass =
  'border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-5 py-2 text-sm transition-colors'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400 mt-1">{hint}</span>}
    </label>
  )
}

export function AdminHeading({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="font-display text-2xl text-royal-blue">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null
  return <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 mb-4">{message}</p>
}

// Editable list of plain strings — used for articles.keywords and
// articles.references, both `text[]` columns with no other structure.
export function StringListEditor({
  values,
  onChange,
  placeholder,
}: {
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={inputClass}
            value={v}
            placeholder={placeholder}
            onChange={(e) => onChange(values.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            className="text-slate-400 hover:text-red-600 px-2 shrink-0"
            aria-label="Remove"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        className="flex items-center gap-1 text-sm text-ocean-blue hover:underline"
      >
        <Plus size={14} /> Add
      </button>
    </div>
  )
}
