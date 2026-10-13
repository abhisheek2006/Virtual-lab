import { motion } from 'framer-motion'
import { DishGroup } from './PorcelainDish'

// Desiccator.jsx
// Glass desiccator with a sliding lid, perforated plate and desiccant beads.
// Shows the live temperature of the dish kept inside.

export default function Desiccator({ lidOpen, dish, onToggleLid }) {
  return (
    <div className="flex w-full flex-col items-center">
      <svg viewBox="0 0 180 190" width="100%" height="165" role="img" aria-label="Desiccator">
        <defs>
          <linearGradient id="dessGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e0f2fe" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#bae6fd" stopOpacity="0.35" />
            <stop offset="1" stopColor="#93c5fd" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="beads" cx="0.5" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#fef9c3" />
            <stop offset="1" stopColor="#facc15" />
          </radialGradient>
        </defs>

        <ellipse cx="90" cy="180" rx="78" ry="7" fill="#0f172a" opacity="0.12" />

        {/* base */}
        <path d="M12 150 Q90 168 168 150 L168 164 Q90 182 12 164 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
        <ellipse cx="90" cy="150" rx="78" ry="14" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

        {/* desiccant beads at the bottom */}
        {[[56, 150], [70, 154], [86, 156], [102, 154], [118, 150], [64, 147], [96, 148], [80, 143], [110, 143], [90, 140]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="6" fill="url(#beads)" stroke="#eab308" strokeWidth="0.8" />
        ))}

        {/* glass body (dome) */}
        <path d="M26 150 L26 74 Q26 34 90 34 Q154 34 154 74 L154 150 Z"
          fill="url(#dessGlass)" stroke="#93c5fd" strokeWidth="2" />
        {/* glass highlight streaks */}
        <path d="M40 74 Q40 48 70 40" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.6" strokeLinecap="round" />
        <path d="M44 90 L44 140" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />

        {/* perforated plate */}
        <ellipse cx="90" cy="128" rx="60" ry="12" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" opacity="0.95" />
        {[45, 65, 85, 105, 125, 135].map((x) => (
          <circle key={x} cx={x} cy="128" r="1.8" fill="#94a3b8" />
        ))}

        {/* dish on the plate */}
        {dish && (
          <>
            <g transform="translate(41,83) scale(0.7)">
              <DishGroup paintMass={dish.paintMass} color={dish.color} matte={dish.matte} />
            </g>
            <rect x="60" y="92" width="60" height="15" rx="4" fill="#0f172a" opacity="0.8" />
            <text x="90" y="103" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, monospace" fill="#7dd3fc" fontWeight="700">
              {Math.round(dish.temp)}°C {dish.temp <= 32 ? '✓' : ''}
            </text>
          </>
        )}

        {/* sliding lid */}
        <motion.g
          animate={{ x: lidOpen ? 74 : 0, y: lidOpen ? -6 : 0, rotate: lidOpen ? 8 : 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        >
          <ellipse cx="90" cy="34" rx="64" ry="13" fill="#dbeafe" stroke="#60a5fa" strokeWidth="2" />
          <ellipse cx="90" cy="31" rx="52" ry="9" fill="#eff6ff" opacity="0.9" />
          <circle cx="90" cy="22" r="7" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="1.5" />
        </motion.g>
      </svg>

      <button
        type="button"
        onClick={onToggleLid}
        className="mt-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        {lidOpen ? 'Close Lid' : 'Open Lid'}
      </button>
    </div>
  )
}
