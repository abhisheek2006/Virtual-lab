import { motion } from 'framer-motion'

// LabRoom.jsx
// A realistic laboratory backdrop drawn entirely in inline SVG + CSS. The bench
// stations sit on top of a steel lab counter; the walls carry a window, wall
// cabinets full of glassware, a ticking clock, a fire extinguisher, a safety
// sign and a vented tile splash-band. Light particles drift in the air.

function Flask({ x, y, w = 24, h = 30, color = 'url(#roomGlass)' }) {
  const cx = x + w / 2
  return (
    <g stroke="#94a3b8" strokeWidth="1.3">
      <rect x={cx - 3} y={y} width="6" height={h * 0.42} fill="#e0f2fe" opacity="0.9" />
      <path
        d={`M ${cx - 3} ${y + h * 0.42} L ${cx + 3} ${y + h * 0.42} L ${cx + w / 2 - 2} ${y + h} Q ${cx} ${y + h + 6} ${cx - w / 2 + 2} ${y + h} Z`}
        fill={color}
        opacity="0.85"
      />
      <path d={`M ${cx - 3} ${y + h * 0.42} L ${cx + 3} ${y + h * 0.42} L ${cx + w / 2 - 2} ${y + h} Q ${cx} ${y + h + 6} ${cx - w / 2 + 2} ${y + h} Z`} fill="#ffffff" opacity="0.18" />
    </g>
  )
}

function Bottle({ x, y, w = 16, h = 34, c = '#bbf7d0' }) {
  return (
    <g>
      <rect x={x + w * 0.28} y={y} width={w * 0.44} height={h * 0.26} rx="1.5" fill={c} opacity="0.95" stroke="#86efac" strokeWidth="1" />
      <rect x={x + w * 0.06} y={y + h * 0.26} width={w * 0.88} height={h * 0.74} rx="3" fill={c} opacity="0.9" stroke="#94a3b8" strokeWidth="1" />
      <rect x={x + w * 0.2} y={y + h * 0.3} width={w * 0.16} height={h * 0.6} fill="#ffffff" opacity="0.35" />
    </g>
  )
}

function Cabinet({ x, label }) {
  return (
    <g>
      <ellipse cx={x + 70} cy="168" rx="70" ry="10" fill="#0f172a" opacity="0.12" />
      <rect x={x} y="18" width="140" height="150" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      <rect x={x + 4} y="22" width="132" height="142" rx="6" fill="#e0f2fe" opacity="0.28" />
      <line x1={x + 6} y1="82" x2={x + 134} y2="82" stroke="#cbd5e1" strokeWidth="3" />
      <line x1={x + 6} y1="132" x2={x + 134} y2="132" stroke="#cbd5e1" strokeWidth="3" />
      {/* glass glare */}
      <path d={`M ${x + 8} 26 L ${x + 44} 26 L ${x + 26} 160 L ${x + 8} 160 Z`} fill="#ffffff" opacity="0.2" />
      {/* contents top shelf */}
      <Bottle x={x + 16} y={52} />
      <Flask x={x + 44} y={42} h={34} />
      <Bottle x={x + 88} y={52} c="#fecaca" />
      {/* contents bottom shelf */}
      <Flask x={x + 22} y={102} h={28} w={20} />
      <Bottle x={x + 66} y={100} h={30} w={15} c="#bfdbfe" />
      <Flask x={x + 102} y={102} h={28} w={20} />
      {/* label */}
      <text x={x + 70} y="156" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="700" letterSpacing="1.5">{label}</text>
      {/* handle */}
      <rect x={x + 132} y="84" width="8" height="26" rx="3" fill="#64748b" stroke="#475569" strokeWidth="1" />
    </g>
  )
}

function LabClock() {
  return (
    <g>
      <circle cx="668" cy="86" r="42" fill="#0f172a" opacity="0.14" />
      <circle cx="668" cy="80" r="42" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="668" cy="80" r="37" fill="#ffffff" />
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1="668" y1="47" x2="668" y2={i % 3 === 0 ? 55 : 52}
          stroke="#64748b"
          strokeWidth={i % 3 === 0 ? 3 : 1.4}
          transform={`rotate(${i * 30} 668 80)`}
        />
      ))}
      <line x1="668" y1="80" x2="656" y2="64" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="668" y1="80" x2="682" y2="86" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: '668px 80px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <line x1="668" y1="80" x2="668" y2="50" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
      </motion.g>
      <circle cx="668" cy="80" r="3" fill="#dc2626" />
      <rect x="652" y="96" width="32" height="14" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
    </g>
  )
}

function Extinguisher({ x, y }) {
  return (
    <g>
      <rect x={x + 14} y={y + 86} width="18" height="26" rx="2" fill="#475569" opacity="0.3" />
      <rect x={x} y={y} width="46" height="84" rx="9" fill="url(#roomExt)" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x={x - 4} y={y - 8} width="54" height="16" rx="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x={x + 20} y={y + 10} width="10" height="34" rx="4" fill="#fecaca" opacity="0.7" />
      <path d={`M ${x + 40} ${y - 4} h 16 l 4 5 -4 5 h -16 Z`} fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.2" />
      <rect x={x + 52} y={y + 2} width="14" height="9" rx="3" fill="#fbbf24" stroke="#b45309" strokeWidth="1.2" />
      <circle cx={x + 96} cy={y + 2} r="5" fill="#dbeafe" />
      <rect x={x + 56} y={y + 2} width="16" height="8" rx="3" fill="#e2e8f0" opacity="0.6" transform={`rotate(28 ${x + 64} ${y + 6})`} />
    </g>
  )
}

const TILE_COLS = 16
const TILE_ROWS = 5
const TILE_TOP = 366

function WallTiles() {
  return (
    <g>
      {[...Array(TILE_ROWS)].map((_, r) =>
        [...Array(TILE_COLS)].map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * (1200 / TILE_COLS)}
            y={TILE_TOP + r * ((560 - TILE_TOP) / TILE_ROWS)}
            width={1200 / TILE_COLS}
            height={(560 - TILE_TOP) / TILE_ROWS}
            fill={(r + c) % 2 === 0 ? '#e8f0fb' : '#dae8fa'}
            stroke="#b7cee8"
            strokeWidth="1"
          />
        ))
      )}
    </g>
  )
}

function Dust({ x, y, dur, delay }) {
  return (
    <motion.circle
      r="1.8"
      fill="#ffffff"
      style={{ position: 'absolute' }}
      initial={{ x, y, opacity: 0 }}
      animate={{ x: x + 22, y: [y, y - 34, y], opacity: [0, 0.6, 0] }}
      transition={{ duration: dur, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

export default function LabRoom({ children }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-300 shadow-inner">
      {/* wall base colour */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#eef4fb] via-[#e6eef9] to-[#dbe7f5]" />

      {/* wall art (window, cabinets, clock, safety equipment, tiles) */}
      <svg
        viewBox="0 0 1200 560"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
        role="img"
        aria-label="Laboratory room"
      >
        <defs>
          <linearGradient id="roomSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7dd3fc" />
            <stop offset="0.7" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="roomGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e0f2fe" stopOpacity="0.5" />
            <stop offset="1" stopColor="#c7d2fe" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="roomExt" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#dc2626" />
            <stop offset="0.5" stopColor="#ef4444" />
            <stop offset="1" stopColor="#b91c1c" />
          </linearGradient>
        </defs>

        {/* window light beam (slowly drifting) */}
        <motion.path
          d="M78 178 L246 216 L246 430 L84 412 Z"
          fill="#bae6fd"
          animate={{ opacity: [0.05, 0.16, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* window */}
        <g>
          <rect x="58" y="196" width="176" height="12" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="66" y="200" width="160" height="5" fill="#cbd5e1" />
          <rect x="60" y="22" width="172" height="176" rx="7" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" />
          <rect x="70" y="32" width="152" height="156" rx="4" fill="url(#roomSky)" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="204" cy="54" r="13" fill="#fde68a" opacity="0.9" />
          <circle cx="204" cy="54" r="20" fill="#fde68a" opacity="0.25" />
          <g fill="#ffffff" opacity="0.85">
            <rect x="96" y="66" width="44" height="11" rx="5" />
            <rect x="120" y="82" width="56" height="11" rx="5" />
            <rect x="84" y="108" width="38" height="11" rx="5" />
          </g>
          <line x1="146" y1="32" x2="146" y2="188" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="70" y1="110" x2="222" y2="110" stroke="#cbd5e1" strokeWidth="3" />
          <path d="M76 38 L118 38 L88 180 L76 180 Z" fill="#ffffff" opacity="0.22" />
        </g>

        {/* reagent shelf above the balance area */}
        <g transform="translate(300 168)">
          <path d="M-8 0 h180 l-12 14 h-156 Z" fill="#b45309" />
          <rect x="8" y="-6" width="86" height="6" rx="2" fill="#fbbf24" />
          <Bottle x={18} y={-42} h={36} c="#bbf7d0" />
          <Bottle x={52} y={-42} h={36} c="#fecaca" />
          <Bottle x={86} y={-38} h={32} c="#bfdbfe" />
          <rect x="118" y="-40" width="26" height="34" rx="3" fill="#ddd6fe" opacity="0.9" stroke="#94a3b8" strokeWidth="1" />
        </g>

        {/* wall clock */}
        <LabClock />

        {/* wall cabinets with glassware */}
        <Cabinet x={906} label="GLASSWARE" />
        <Cabinet x={1056} label="REAGENTS" />

        {/* fire extinguisher */}
        <Extinguisher x={64} y={300} />

        {/* safety / first-aid sign */}
        <g transform="translate(158 348)">
          <rect width="54" height="54" rx="7" fill="#ffffff" stroke="#0f766e" strokeWidth="2.5" />
          <path d="M27 9 v36 M9 27 h36" stroke="#0f766e" strokeWidth="7" strokeLinecap="round" />
        </g>

        {/* vent grille */}
        <g transform="translate(520 330)" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1">
          <rect width="150" height="40" rx="4" fill="#e9eef5" />
          {[...Array(7)].map((_, i) => (
            <rect key={i} x={8 + i * 20} y="9" width="11" height="22" rx="3" />
          ))}
        </g>

        {/* tiled splash band */}
        <WallTiles />

        {/* subtle top vignette */}
        <rect x="0" y="0" width="1200" height="600" fill="url(#roomVignette)" opacity="0.06" />
        <linearGradient id="roomVignette" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
      </svg>

      {/* ambient dust particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Dust x={120} y={200} dur={9} delay={0} />
        <Dust x={420} y={140} dur={12} delay={2} />
        <Dust x={760} y={220} dur={10} delay={4} />
        <Dust x={1000} y={150} dur={13} delay={1} />
      </div>

      {/* steel lab counter the stations stand on */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" aria-hidden="true">
        <div className="h-28 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 shadow-[inset_0_4px_6px_rgba(15,23,42,0.18)]" />
        <div className="h-1 bg-gradient-to-r from-slate-300 via-blue-200 to-slate-300" />
        <div className="h-10 bg-gradient-to-b from-slate-300 to-slate-500">
          <div className="mx-10 mt-2.5 flex justify-between px-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-24 rounded-sm bg-gradient-to-b from-slate-400 to-slate-500 shadow-inner" />
            ))}
          </div>
        </div>
        <div className="h-4 bg-gradient-to-b from-slate-600 to-slate-800" />
      </div>

      {/* soft drop shadow where stations meet the counter */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[150px] z-[4] h-6 bg-gradient-to-b from-transparent to-slate-900/10" />

      {/* content */}
      <div className="relative z-10 px-3 pt-3 pb-[7.75rem]">{children}</div>
    </div>
  )
}