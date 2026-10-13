import { useLab } from '../engine/store'

// Toasts.jsx
// Floating friendly messages: warnings, hints and blocking errors.

const STYLE = {
  warn: 'border-amber-300 bg-amber-50 text-amber-900',
  info: 'border-sky-300 bg-sky-50 text-sky-900',
  block: 'border-red-300 bg-red-50 text-red-900',
}

export default function Toasts() {
  const toasts = useLab((s) => s.toasts)
  const dismissToast = useLab((s) => s.dismissToast)
  const dispatch = useLab((s) => s.dispatch)

  return (
    <div className="no-print pointer-events-none fixed bottom-4 right-4 z-40 flex w-[320px] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id}
          className={'pointer-events-auto flex items-start gap-2 rounded-xl border p-3 text-sm shadow-lg ' + (STYLE[t.kind] || STYLE.info)}>
          <span aria-hidden="true">{t.kind === 'block' ? '\u26D4' : t.kind === 'warn' ? '\u26A0\uFE0F' : '\u2139\uFE0F'}</span>
          <div className="flex-1">
            <p>{t.text}</p>
            {t.action === 'discard' && (
              <button
                type="button"
                onClick={() => { dispatch({ type: 'DISCARD_PAINT' }); dismissToast(t.id) }}
                className="mt-2 rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                Discard paint and clean dish
              </button>
            )}
          </div>
          <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss message"
            className="text-current opacity-60 hover:opacity-100">&#10005;</button>
        </div>
      ))}
    </div>
  )
}
