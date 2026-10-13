import { motion } from 'framer-motion'

// PorcelainDish.jsx
// White glazed porcelain dish. Exports:
//   default PorcelainDish  - a standalone <svg>
//   DishGroup              - an SVG <g> so stations can embed the dish in their own drawing
// Extra props: temp (hot shimmer), pouring (ripples while paint flows in), matte (dry finish).

const DISH_VIEWBOX = '0 0 140 80'

// Map paint mass (0..1.6 g) to the size of the paint blob.
function blobSize(paintMass) {
  const t = Math.min(paintMass, 1.6) / 1.6
  return { rx: 8 + t * 24, ry: 3.5 + t * 8 }
}

function HotShimmer() {
  return (
    <g>
      {[30, 50, 70, 90, 110].map((x, i) => (
        <motion.path
          key={x}
          d={`M${x} 20 q 4 -7 0 -14 q -4 -7 0 -14`}
          fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: -6, opacity: [0, 0.55, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
        />
      ))}
    </g>
  )
}

function PourRipples() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={i}
          cx="70" cy="40" rx="26" ry="6" fill="none"
          stroke={`rgba(255,255,255,${0.8 - i * 0.25})`} strokeWidth="1.1"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.5] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.34, ease: 'easeOut' }}
        />
      ))}
    </g>
  )
}

export function DishGroup({ paintMass = 0, color = '#1d4ed8', matte = false, showPaint = true, temp = 0, pouring = false }) {
  const { rx, ry } = blobSize(paintMass)
  const hasPaint = showPaint && paintMass > 0.001
  const hot = temp > 40
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
          {matte ? (
            /* dry, dull surface: tiny stipples instead of a wet gloss */
            <ellipse cx="70" cy="33" rx={rx * 0.5} ry={ry * 0.45} fill="#ffffff" opacity="0.1" />
          ) : (
            <ellipse cx={70 - rx * 0.3} cy={33 - ry * 0.4} rx={rx * 0.3} ry={ry * 0.34} fill="#ffffff" opacity="0.6" />
          )}
        </>
      )}
      {/* wet-blob shine grows while paint flows in */}
      {pouring && <PourRipples />}
      {/* long glaze highlight */}
      <path d="M30 34 Q70 21 112 34" stroke="#ffffff" strokeWidth="2.2" fill="none" opacity="0.75" />
      {/* heat shimmer rising from a hot dish */}
      {hot && <HotShimmer />}
    </g>
  )
}

export default function PorcelainDish({ paintMass = 0, color = '#1d4ed8', matte = false, temp = 0, pouring = false, className = '', title = 'Porcelain dish' }) {
  return (
    <svg viewBox={DISH_VIEWBOX} className={className} width="100%" height="100%" role="img" aria-label={title}>
      <DishGroup paintMass={paintMass} color={color} matte={matte} temp={temp} pouring={pouring} />
    </svg>
  )
}