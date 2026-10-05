'use client'

// The "Insert chart" dialog: choose a chart type, paste the numbers from
// Excel, see the chart as it will be published, save. The equivalent of
// Word's Insert > Chart, with the pasted cells standing in for its
// spreadsheet.
//
// Rendered into <body> through a portal, not inside the article form:
// the dialog has its own text inputs, and pressing Enter in one of them
// would otherwise submit the whole article.

import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ChartColumn, ChartLine, ChartPie, X } from 'lucide-react'
import { chartDataToText, parseChartData, type ChartSpec, type ChartType } from '@/lib/chart/spec'
import { chartToHtml } from '@/lib/chart/svg'
import { inputClass, primaryButtonClass, secondaryButtonClass } from './AdminUI'

const TYPES: { type: ChartType; label: string; icon: ReactNode; hint: string }[] = [
  { type: 'column', label: 'Column', icon: <ChartColumn size={16} />, hint: 'Compare amounts across categories.' },
  { type: 'line', label: 'Line', icon: <ChartLine size={16} />, hint: 'Show change over time.' },
  { type: 'pie', label: 'Pie', icon: <ChartPie size={16} />, hint: 'Show shares of one total (best with six slices or fewer).' },
]

const EXAMPLE = ['\tIncidents\tBoardings', '2021\t34\t28', '2022\t19\t15', '2023\t22\t17'].join('\n')

export default function ChartDialog({
  initial,
  onSave,
  onClose,
}: {
  initial?: ChartSpec
  onSave: (spec: ChartSpec) => void
  onClose: () => void
}) {
  const [type, setType] = useState<ChartType>(initial?.type ?? 'column')
  const [title, setTitle] = useState(initial?.title ?? '')
  const [valueLabel, setValueLabel] = useState(initial?.valueLabel ?? '')
  const [text, setText] = useState(initial ? chartDataToText(initial) : '')

  const parsed = text.trim() ? parseChartData(text) : null
  const spec: ChartSpec | null =
    parsed?.ok ? { type, title: title.trim(), valueLabel: valueLabel.trim(), categories: parsed.categories, series: parsed.series } : null

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-ink/60 flex items-start justify-center overflow-y-auto p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Chart">
      <div className="bg-white w-full max-w-3xl shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h2 className="font-display text-lg text-royal-blue">{initial ? 'Edit chart' : 'Insert chart'}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-royal-blue">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Chart type</span>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => setType(option.type)}
                  aria-pressed={type === option.type}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm border transition-colors ${
                    type === option.type ? 'bg-royal-blue text-white border-royal-blue' : 'border-slate-300 text-slate-700 hover:border-royal-blue'
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">{TYPES.find((option) => option.type === type)?.hint}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1">Title</span>
              <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Figure 1: Reported incidents by year" />
            </label>
            {type !== 'pie' && (
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 mb-1">What the numbers measure (optional)</span>
                <input className={inputClass} value={valueLabel} onChange={(e) => setValueLabel(e.target.value)} placeholder="Number of incidents" />
              </label>
            )}
          </div>

          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">Data</span>
            <textarea
              rows={7}
              className={`${inputClass} font-mono whitespace-pre`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={EXAMPLE}
              spellCheck={false}
            />
            <span className="block text-xs text-slate-400 mt-1">
              In Excel, select the cells including the header row, copy, and paste here. The first column holds the category names; each
              further column is a series of numbers.{' '}
              <button type="button" onClick={() => setText(EXAMPLE)} className="text-ocean-blue hover:underline">
                Fill in an example
              </button>
            </span>
          </label>

          {parsed && !parsed.ok && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{parsed.error}</p>}
          {spec && type === 'pie' && spec.series.length > 1 && (
            <p className="text-sm text-slate-600 bg-amber-50 border-l-4 border-amber-300 px-3 py-2">
              A pie chart shows one set of numbers, so only the first column (“{spec.series[0].name}”) is used.
            </p>
          )}

          {spec && (
            <div>
              <span className="block text-sm font-medium text-slate-700 mb-1.5">Preview</span>
              {/* chartToHtml escapes every piece of the chart's text. */}
              <div className="article-body border border-slate-200 p-4" dangerouslySetInnerHTML={{ __html: chartToHtml(spec) }} />
            </div>
          )}
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-slate-200">
          <button type="button" disabled={!spec} onClick={() => spec && onSave(spec)} className={primaryButtonClass}>
            {initial ? 'Save chart' : 'Insert chart'}
          </button>
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
