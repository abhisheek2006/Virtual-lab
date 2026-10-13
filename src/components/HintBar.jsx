import { useState } from 'react'
import { useLab } from '../engine/store'

// HintBar.jsx
// Bottom bar: shows the current step (guided) or progress (free), the hint,
// and the Reset / Hint / Finish buttons.

export default function HintBar() {
  const experiment = useLab((s) => s.experiment)
  const mode = useLab((s) => s.mode)
  const stepIndex = useLab((s) => s.stepIndex)
  const completed = useLab((s) => s.completed)
  const result = useLab((s) => s.result)
  const newAttempt = useLab((s) => s.newAttempt)
  const finish = useLab((s) => s.finish)
  const [showHint, setShowHint] = useState(false)

  if (!experiment) return null
  const steps = experiment.steps
  const guidedDone = stepIndex >= steps.length
  const current = steps[Math.min(stepIndex, steps.length - 1)]
  const doneCount = steps.filter((s) => completed[s.id]).length

  return (
    <div className="no-print flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="min-w-[240px] flex-1">
        {mode === 'guided' ? (
          guidedDone ? (
            <p className="text-sm font-semibold text-emerald-700">All steps complete. Review your result and answer the viva.</p>
          ) : (
            <p className="text-sm text-slate-700">
              <span className="mr-2 rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                Step {stepIndex + 1}/{steps.length}
              </span>
              <span className="font-semibold">{current.title}:</span> {current.text}
            </p>
          )
        ) : (
          <p className="text-sm text-slate-700">
            <span className="mr-2 rounded bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700">Free mode</span>
            {doneCount}/{steps.length} steps detected. Any action is allowed &mdash; mistakes still give warnings.
          </p>
        )}
        {showHint && <p className="mt-1 text-sm text-amber-700"><b>Hint:</b> {current.hint}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          Hint
        </button>
        <button
          type="button"
          onClick={() => { if (window.confirm('Reset this attempt? All your readings will be cleared.')) newAttempt() }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={finish}
          disabled={!!result}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          Finish
        </button>
      </div>
    </div>
  )
}
