import { motion } from 'framer-motion'

// PaintTin.jsx
// Purely visual oil-paint tin. Dragging is handled by the parent (DraggableItem)
// and pouring is handled by a separate press-and-hold button on the bench.

export default function PaintTin({ pouring = false, size = 1 }) {
  return (
    <motion.div
      animate={{ rotate: pouring ? -32 : 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      style={{ transformOrigin: '75% 95%', width: 84 * size, height: 100 * size }}
    >
      <svg viewBox="0 0 100 120" width="100%" height="100%" role="img" aria-label="Oil paint tin">
        <defs>
          <linearGradient id="tinBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#94a3b8" />
            <stop offset="0.25" stopColor="#e2e8f0" />
            <stop offset="0.55" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="tinLabel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fef3c7" />
            <stop offset="1" stopColor="#fcd34d" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="112" rx="34" ry="6" fill="#0f172a" opacity="0.15" />
        <rect x="18" y="24" width="64" height="84" rx="6" fill="url(#tinBody)" stroke="#64748b" strokeWidth="1.5" />
        <rect x="18" y="46" width="64" height="40" fill="url(#tinLabel)" opacity="0.95" />
        <text x="50" y="66" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e">OIL</text>
        <text x="50" y="78" textAnchor="middle" fontSize="9" fontWeight="600" fill="#b45309">PAINT</text>
        <ellipse cx="50" cy="24" rx="32" ry="9" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        <ellipse cx="50" cy="23" rx="24" ry="6" fill="#cbd5e1" />
        <rect x="26" y="26" width="6" height="80" rx="3" fill="#ffffff" opacity="0.35" />
      </svg>
    </motion.div>
  )
}
