import { motion } from 'framer-motion'
import { DishGroup } from './PorcelainDish'

// ElectricOven.jsx
// Oven with a glass front door, temperature display, setpoint controls,
// glowing coils, and vapour wisps while the paint is drying.

function Vapour({ x, delay }) {
  return (
    <motion.path
      d={`M${x} 120 q 8 -14 0 -28 q -8 -14 0 -28`}
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: [0, 0.55, 0], y: -10 }}
      transition={{ duration: 2.2, repeat: Infinity, delay }}
    />
  )
}

// Wavy heat shimmer rising off the hot elements.
function HeatShimmer({ x }) {
  return (
    <motion.path
      d={`M${x} 150 q 6 -8 0 -16 q -6 -8 0 -16`}
      fill="none"
      stroke="#fbbf24"
      strokeWidth="1.6"
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0], y: -4 }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function ElectricOven({ oven, dish, onPower, onSetpoint, onToggleDoor, onToggleTimer }) {
  const heating = oven.power && oven.temp < oven.setpoint - 1
  const atTemp = oven.power && oven.temp >= oven.setpoint - 1
  const showVapour = dish && oven.power && oven.temp > 60

  return (
    <div className="flex w-full flex-col items-center">
      <svg viewBox="0 0 280 220" width="100%" height="185" role="img" aria-label="Electric oven">
        <defs>
          <linearGradient id="ovenBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#b9c4d2" />
          </linearGradient>
          <linearGradient id="ovenDoor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#a7b4c4" />
          </linearGradient>
          <radialGradient id="ovenCavity" cx="0.5" cy="0.35" r="0.8">
            <stop offset="0" stopColor="#3f3f46" />
            <stop offset="1" stopColor="#111827" />
          </radialGradient>
          <linearGradient id="coilGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#dc2626" />
          </linearGradient>
          <radialGradient id="cavityGlow" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0" stopColor="#fb923c" stopOpacity="0.55" />
            <stop offset="0.6" stopColor="#ef4444" stopOpacity="0.28" />
            <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="140" cy="212" rx="115" ry="7" fill="#0f172a" opacity="0.12" />

        {/* outer body */}
        <rect x="10" y="10" width="260" height="196" rx="14" fill="url(#ovenBody)" stroke="#94a3b8" strokeWidth="2" />

        {/* cavity (visible when the door is open) */}
        <rect x="30" y="40" width="220" height="132" rx="8" fill="url(#ovenCavity)" stroke="#374151" strokeWidth="2" />
        {/* warm glow that builds while the oven heats up */}
        {oven.power && oven.temp > 50 && (
          <motion.rect
            x="30" y="40" width="220" height="132" rx="8" fill="url(#cavityGlow)"
            animate={{ opacity: [0.55, 0.95, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {/* rack */}
        <line x1="40" y1="130" x2="240" y2="130" stroke="#9ca3af" strokeWidth="3" />
        {[70, 100, 130, 160, 190, 220].map((x) => (
          <line key={x} x1={x} y1="130" x2={x} y2="136" stroke="#9ca3af" strokeWidth="2" />
        ))}
        {/* coils */}
        <motion.path
          d="M48 158 q 16 -16 32 0 t 32 0 t 32 0 t 32 0 t 32 0"
          fill="none"
          stroke={oven.power ? 'url(#coilGlow)' : '#4b5563'}
          strokeWidth="5"
          strokeLinecap="round"
          animate={{ opacity: oven.power ? [0.7, 1, 0.8] : 0.35 }}
          transition={{ duration: 1.6, repeat: oven.power ? Infinity : 0 }}
        />
        {/* dish resting on the rack */}
        {dish && (
          <g transform="translate(81,69) scale(0.85)">
            <DishGroup paintMass={dish.paintMass} color={dish.color} matte={dish.matte} />
          </g>
        )}
        {/* heat shimmer over the elements */}
        {(heating || atTemp) && (
          <>
            <HeatShimmer x={80} />
            <HeatShimmer x={140} />
            <HeatShimmer x={200} />
          </>
        )}
        {/* vapour wisps from the drying paint */}
        {showVapour && (
          <>
            <Vapour x={120} delay={0} />
            <Vapour x={140} delay={0.6} />
            <Vapour x={160} delay={1.1} />
          </>
        )}

        {/* oven door - swings open from the left hinge */}
        <motion.g
          style={{ transformBox: 'view-box', transformOrigin: '30px 40px' }}
          animate={{ rotate: oven.doorOpen ? -102 : 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          <rect x="30" y="40" width="220" height="132" rx="8" fill="url(#ovenDoor)" stroke="#94a3b8" strokeWidth="2" />
          {/* glass window */}
          <rect x="58" y="62" width="164" height="86" rx="6" fill="#1f2937" opacity="0.85" stroke="#64748b" strokeWidth="1.5" />
          <path d="M66 70 L110 70 L74 142 L58 142 Z" fill="#ffffff" opacity="0.08" />
          <rect x="180" y="70" width="34" height="10" rx="4" fill="#cbd5e1" />
          {/* handle */}
          <rect x="222" y="56" width="10" height="100" rx="5" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        </motion.g>

        {/* top control strip */}
        <rect x="30" y="16" width="220" height="18" rx="6" fill="#1f2937" opacity="0.9" />
        <text x="140" y="29" textAnchor="middle" fontSize="10" fill="#e5e7eb" fontWeight="700">
          {oven.power ? (atTemp ? 'READY · 120°C' : heating ? 'HEATING…' : 'ON') : 'OFF'}
        </text>
      </svg>

      {/* digital read-outs */}
      <div className="mt-1 grid w-full max-w-[260px] grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-slate-900 px-2 py-1">
          <div className="text-[9px] uppercase tracking-wide text-slate-400">Temp</div>
          <div className="font-mono text-sm font-bold text-amber-400">{Math.round(oven.temp)}°C</div>
        </div>
        <div className="rounded-md bg-slate-900 px-2 py-1">
          <div className="text-[9px] uppercase tracking-wide text-slate-400">Set</div>
          <div className="font-mono text-sm font-bold text-sky-300">{oven.setpoint}°C</div>
        </div>
        <div className="rounded-md bg-slate-900 px-2 py-1">
          <div className="text-[9px] uppercase tracking-wide text-slate-400">Timer</div>
          <div className="font-mono text-sm font-bold text-emerald-300">{Math.floor(oven.elapsed)}m</div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onPower}
          className={'rounded-md px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ' +
            (oven.power ? 'bg-slate-600 hover:bg-slate-700' : 'bg-emerald-600 hover:bg-emerald-700')}
        >
          {oven.power ? 'Power Off' : 'Power On'}
        </button>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Decrease setpoint" onClick={() => onSetpoint(-5)}
            className="h-7 w-7 rounded-md bg-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">−</button>
          <span className="text-xs text-slate-600">Set</span>
          <button type="button" aria-label="Increase setpoint" onClick={() => onSetpoint(5)}
            className="h-7 w-7 rounded-md bg-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">+</button>
        </div>
        <button type="button" onClick={onToggleDoor}
          className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
          {oven.doorOpen ? 'Close Door' : 'Open Door'}
        </button>
        <button type="button" onClick={onToggleTimer}
          className={'rounded-md px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ' +
            (oven.running ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700')}
          disabled={!dish}
        >
          {oven.running ? 'Stop Timer' : 'Start Timer'}
        </button>
      </div>
    </div>
  )
}
