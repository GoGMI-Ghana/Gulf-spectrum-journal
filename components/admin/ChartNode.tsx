'use client'

// The editor's chart block. In the document it's a single, indivisible
// node holding the chart's data; in the stored HTML it's
//   <div data-chart='{…}'></div>
// which the public page and the PDF each draw from (see lib/chart/). In
// the editor it shows the same drawing, with Edit and Remove buttons.

import { useState } from 'react'
import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from '@tiptap/react'
import { Pencil, Trash2 } from 'lucide-react'
import { parseChartSpec, type ChartSpec } from '@/lib/chart/spec'
import { chartToHtml } from '@/lib/chart/svg'
import ChartDialog from './ChartDialog'

function ChartNodeView({ node, updateAttributes, deleteNode, selected }: ReactNodeViewProps) {
  const [editing, setEditing] = useState(false)
  const spec = parseChartSpec(node.attrs.spec)

  return (
    <NodeViewWrapper className={`relative my-4 border ${selected ? 'border-royal-blue' : 'border-transparent hover:border-slate-200'}`} contentEditable={false}>
      {spec ? (
        <div dangerouslySetInnerHTML={{ __html: chartToHtml(spec) }} />
      ) : (
        <p className="text-sm text-red-700 p-3">This chart’s data couldn’t be read. Remove it and insert the chart again.</p>
      )}
      <div className="absolute top-1 right-1 flex gap-1">
        {spec && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 bg-white border border-slate-300 hover:border-royal-blue text-slate-700 text-xs px-2 py-1"
          >
            <Pencil size={12} /> Edit chart
          </button>
        )}
        <button
          type="button"
          onClick={deleteNode}
          aria-label="Remove chart"
          className="inline-flex items-center bg-white border border-slate-300 hover:border-red-500 hover:text-red-600 text-slate-500 text-xs px-2 py-1"
        >
          <Trash2 size={12} />
        </button>
      </div>
      {editing && spec && (
        <ChartDialog
          initial={spec}
          onClose={() => setEditing(false)}
          onSave={(next: ChartSpec) => {
            updateAttributes({ spec: JSON.stringify(next) })
            setEditing(false)
          }}
        />
      )}
    </NodeViewWrapper>
  )
}

export const ChartNode = Node.create({
  name: 'chart',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      // The chart as JSON text — kept as one opaque string so the editor
      // never tries to interpret or merge its contents.
      spec: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-chart') ?? '',
        renderHTML: (attributes) => ({ 'data-chart': attributes.spec as string }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-chart]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartNodeView)
  },
})
