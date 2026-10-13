// PorcelainDish.jsx
// White glazed porcelain dish. Exports:
//   default PorcelainDish  - a standalone <svg>
//   DishGroup              - an SVG <g> so stations can embed the dish in their own drawing

const DISH_VIEWBOX = '0 0 140 80'

// Map paint mass (0..1.6 g) to the size of the paint blob.
function blobSize(paintMass) {
  const t = Math.min(paintMass, 1.6) / 1.6
  return { rx: 8 + t * 24, ry: 3.5 + t * 8 }
}

export function DishGroup({ paintMass = 0, color = '#1d4ed8', matte = false, showPaint = true }) {
  const { rx, ry } = blobSize(paintMass)
  const hasPaint = showPaint && paintMass > 0.001
  return (
    <g>
      <defs>
        <linearGradient id="dishOuter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#eef2f7" />
          <stop offset="1" stopColor="#c9d4e2" />
        </linearGradient>
        <linearGradient id="dishInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#dde5ee" />
        </linearGradient>
      </defs>
      {/* soft shadow on the surface */}
      <ellipse cx="70" cy="70" rx="52" ry="7" fill="#0f172a" opacity="0.12" />
      {/* outer glazed body */}
      <path d="M18 30 Q70 14 122 30 Q112 66 70 70 Q28 66 18 30 Z" fill="url(#dishOuter)" stroke="#c7d2de" strokeWidth="1.5" />
      {/* inner rim */}
      <ellipse cx="70" cy="30" rx="52" ry="13" fill="url(#dishInner)" stroke="#cbd5e1" strokeWidth="1" />
      <ellipse cx="70" cy="31" rx="44" ry="10" fill="#e2e8f0" opacity="0.6" />
      {/* paint blob sitting in the dish */}
      {hasPaint && (
        <>
          <ellipse cx="70" cy="33" rx={rx} ry={ry} fill={color} />
          <ellipse cx="70" cy={33 + ry * 0.35} rx={rx * 0.85} ry={ry * 0.5} fill="#000" opacity="0.12" />
          {!matte && (
            <ellipse cx={70 - rx * 0.3} cy={33 - ry * 0.4} rx={rx * 0.3} ry={ry * 0.34} fill="#ffffff" opacity="0.6" />
          )}
        </>
      )}
      {/* long glaze highlight */}
      <path d="M30 34 Q70 21 112 34" stroke="#ffffff" strokeWidth="2.2" fill="none" opacity="0.75" />
    </g>
  )
}

export default function PorcelainDish({ paintMass = 0, color = '#1d4ed8', matte = false, className = '', title = 'Porcelain dish' }) {
  return (
    <svg viewBox={DISH_VIEWBOX} className={className} width="100%" height="100%" role="img" aria-label={title}>
      <DishGroup paintMass={paintMass} color={color} matte={matte} />
    </svg>
  )
}
