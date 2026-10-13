import { DishGroup } from './PorcelainDish'

// WeighingBalance.jsx
// Digital chemical balance with 3-decimal display. The reading and stability
// come from the simulation; this component only draws and raises events.

export default function WeighingBalance({ balance, dish, onToggle, onRecord, onFieldChange }) {
  const on = balance.on
  const stable = balance.stable
  const hot = dish && dish.temp > 40
  const reading = balance.reading
  const digits = on ? (reading === null ? '- - - . - - -' : reading.toFixed(3)) : '- - - . - - -'

  return (
    <div className="flex w-full flex-col items-center">
      <svg viewBox="0 0 240 170" width="100%" height="150" role="img" aria-label="Digital weighing balance">
        <defs>
          <linearGradient id="balBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8fafc" />
            <stop offset="0.5" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="balPan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e5e7eb" />
            <stop offset="1" stopColor="#9ca3af" />
          </linearGradient>
          <radialGradient id="balGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#34d399" stopOpacity="0.35" />
            <stop offset="1" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="120" cy="162" rx="95" ry="7" fill="#0f172a" opacity="0.12" />

        {/* pan */}
        <ellipse cx="120" cy="60" rx="62" ry="15" fill="url(#balPan)" stroke="#94a3b8" strokeWidth="1.5" />
        <ellipse cx="120" cy="58" rx="62" ry="15" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
        <ellipse cx="120" cy="57" rx="50" ry="11" fill="#e2e8f0" opacity="0.6" />
        {on && <ellipse cx="120" cy="60" rx="62" ry="15" fill="url(#balGlow)" />}

        {/* dish sits on the pan when it is here */}
        {dish && (
          <g transform="translate(50,-12)">
            <DishGroup paintMass={dish.paintMass} color={dish.color} matte={dish.matte} />
          </g>
        )}

        {/* support stem */}
        <rect x="114" y="72" width="12" height="22" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

        {/* body */}
        <rect x="28" y="92" width="184" height="66" rx="12" fill="url(#balBody)" stroke="#94a3b8" strokeWidth="1.5" />
        {/* display */}
        <rect x="56" y="102" width="128" height="38" rx="6" fill="#0b1220" stroke="#334155" strokeWidth="1.5" />
        <text x="120" y="128" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="22" fontWeight="700"
          fill={on ? (hot ? '#f59e0b' : '#4ade80') : '#1e293b'}>
          {digits}
        </text>
        <text x="120" y="148" textAnchor="middle" fontSize="9" fill={on && stable ? '#4ade80' : '#64748b'} fontWeight="600">
          {on ? (hot ? 'UNSTABLE · HOT DISH' : stable ? 'STABLE' : 'STABILISING…') : 'POWER OFF'}
        </text>
        {/* unit */}
        <text x="196" y="128" textAnchor="middle" fontSize="12" fill="#94a3b8" fontWeight="700">g</text>
        {/* power indicator dot */}
        <circle cx="196" cy="150" r="4" fill={on ? '#22c55e' : '#94a3b8'} />
      </svg>

      {/* HTML controls for accessibility */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          className={'rounded-md px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ' +
            (on ? 'bg-slate-600 hover:bg-slate-700' : 'bg-emerald-600 hover:bg-emerald-700')}
        >
          {on ? 'Power Off' : 'Power On'}
        </button>
        <label className="flex items-center gap-1 text-xs text-slate-600">
          Record
          <select
            value={balance.field}
            onChange={(e) => onFieldChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-1.5 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Observation field to record"
          >
            <option value="W1">W1</option>
            <option value="W2">W2</option>
            <option value="W3">W3</option>
          </select>
        </label>
        <button
          type="button"
          onClick={onRecord}
          disabled={!on || !stable}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Record
        </button>
      </div>
    </div>
  )
}
