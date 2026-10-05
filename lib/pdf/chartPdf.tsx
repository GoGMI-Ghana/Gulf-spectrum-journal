// A chart in the article PDF, drawn as vector shapes from the same layout
// the web page uses (lib/chart/layout.ts) — so it stays sharp at any zoom
// and matches the page exactly.

import type { ReactNode } from 'react'
import { Circle, Line, Path, Rect, Svg, Text, View } from '@react-pdf/renderer'
import { layoutChart, type Shape } from '../chart/layout'
import type { ChartSpec } from '../chart/spec'
import { PDF_COLUMN_WIDTH, pdfStyles } from './styles'

function renderShape(shape: Shape, key: number): ReactNode {
  switch (shape.kind) {
    case 'path':
      return (
        <Path
          key={key}
          d={shape.d}
          fill={shape.fill ?? 'none'}
          stroke={shape.stroke}
          strokeWidth={shape.stroke ? (shape.strokeWidth ?? 1) : undefined}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )
    case 'line':
      return <Line key={key} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
    case 'circle':
      return (
        <Circle
          key={key}
          cx={shape.cx}
          cy={shape.cy}
          r={shape.r}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.stroke ? (shape.strokeWidth ?? 1) : undefined}
        />
      )
    case 'rect':
      return <Rect key={key} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} ry={shape.rx} fill={shape.fill} />
    case 'text':
      return (
        <Text
          key={key}
          x={shape.x}
          y={shape.y}
          fill={shape.fill}
          textAnchor={shape.anchor}
          style={{ fontSize: shape.size, fontFamily: 'Noto Serif', fontWeight: shape.bold ? 'bold' : 'normal' }}
        >
          {shape.text}
        </Text>
      )
  }
}

export function renderChartPdf(spec: ChartSpec, key: string): ReactNode {
  const layout = layoutChart(spec)
  // The layout's 640-unit canvas scaled to the text column.
  const width = Math.min(PDF_COLUMN_WIDTH, 420)
  const height = (width * layout.height) / layout.width
  return (
    <View key={key} style={pdfStyles.figure} wrap={false}>
      {spec.title ? <Text style={pdfStyles.chartTitle}>{spec.title}</Text> : null}
      <Svg viewBox={`0 0 ${layout.width} ${layout.height}`} style={{ width, height, alignSelf: 'center' }}>
        {layout.shapes.map(renderShape)}
      </Svg>
    </View>
  )
}
