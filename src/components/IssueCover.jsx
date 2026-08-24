// Designed cover art for an issue, standing in for real cover photography —
// a compass line-mark plus the issue title set as a small journal cover,
// the way ScienceDirect shows an issue thumbnail beside the masthead.

function wrapLines(text, maxChars, maxLines) {
  const words = text.split(' ')
  const lines = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
    if (lines.length === maxLines) break
  }
  if (current && lines.length < maxLines) lines.push(current)

  if (lines.length === maxLines) {
    const last = lines[maxLines - 1]
    lines[maxLines - 1] = last.length > maxChars - 1 ? `${last.slice(0, maxChars - 1)}…` : last
  }
  return lines
}

export default function IssueCover({ issue, className = '' }) {
  const titleLines = wrapLines(issue.theme, 16, 5)
  const lineHeight = 21

  return (
    <svg viewBox="0 0 300 400" className={className} role="img" aria-label={`Cover of Issue ${issue.number}: ${issue.theme}`}>
      <rect x="0" y="0" width="300" height="400" fill="#003366" />
      <rect x="14" y="14" width="272" height="372" fill="none" stroke="#DAA520" strokeWidth="1.5" />

      <text x="150" y="42" textAnchor="middle" fill="#F5E6D3" fontSize="9" letterSpacing="2.5" fontFamily="Inter, sans-serif">
        THE GULF SPECTRUM
      </text>

      <text x="150" y="105" textAnchor="middle" fill="#DAA520" fontSize="52" fontWeight="700" fontFamily="'Playfair Display', serif">
        N°{issue.number}
      </text>

      <line x1="110" y1="128" x2="190" y2="128" stroke="#DAA520" strokeWidth="1" />

      <text x="150" y={180} textAnchor="middle" fill="#ffffff" fontFamily="'Playfair Display', serif" fontSize="19">
        {titleLines.map((line, i) => (
          <tspan key={i} x="150" dy={i === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>

      {/* Compass rose mark */}
      <g transform="translate(150, 320)">
        <circle r="26" fill="none" stroke="#DAA520" strokeWidth="1" opacity="0.7" />
        <path d="M0 -20 L6 0 L0 20 L-6 0 Z" fill="#DAA520" />
        <path d="M-20 0 L0 -6 L20 0 L0 6 Z" fill="#F5E6D3" opacity="0.8" />
      </g>

      <text x="150" y="372" textAnchor="middle" fill="#F5E6D3" fontSize="8" letterSpacing="1.5" fontFamily="Inter, sans-serif">
        GoGMI JOURNAL OF MARITIME RESEARCH
      </text>
      <text x="150" y="386" textAnchor="middle" fill="#F5E6D3" fontSize="8" opacity="0.6" fontFamily="Inter, sans-serif">
        Volume {issue.volume} · {issue.publishedDate}
      </text>
    </svg>
  )
}
