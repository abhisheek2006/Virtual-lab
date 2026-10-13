import { Link } from 'react-router-dom'
import { useLab } from '../engine/store'

// ResultCard.jsx
// Shows the student's result next to the simulated actual value, the feedback,
// and the list of logged mistakes.

const GRADE_STYLE = {
  excellent: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  good: 'border-sky-300 bg-sky-50 text-sky-800',
  check: 'border-amber-300 bg-amber-50 text-amber-800',
}

export default function ResultCard() {
  const result = useLab((s) => s.result)
  const sim = useLab((s) => s.sim)
  const experimentId = useLab((s) => s.experimentId)
  const newAttempt = useLab((s) => s.newAttempt)
  const mistakes = sim ? sim.mistakes : []

  if (!result) return null

  const grade = GRADE_STYLE[result.grade] || GRADE_STYLE.check
  const diff = result.studentPercent !== null ? Math.abs(result.studentPercent - result.actualPercent).toFixed(2) : null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800">Result</h2>
      <div className={'mt-3 rounded-xl border p-4 ' + grade}>
        <p className="text-base font-semibold">{result.feedback}</p>
        {result.studentPercent !== null ? (
          <p className="mt-1 text-2xl font-bold">
            {result.studentPercent.toFixed(2)} <span className="text-base font-medium">% thinner</span>
          </p>
        ) : (
          <p className="mt-1 text-sm">No percentage entered in the Observations tab.</p>
        )}
        <p className="mt-1 text-sm">Simulated actual value: <b>{result.actualPercent.toFixed(2)} %</b>{diff !== null && ` (difference ${diff} %)`}</p>
        <p className="mt-1 text-xs">Heating time used: {result.heatMinutes.toFixed(1)} minutes (procedure requires 60 minutes).</p>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-700">Mistakes logged ({mistakes.length})</h3>
        {mistakes.length === 0 ? (
          <p className="mt-1 text-sm text-emerald-700">No mistakes &mdash; well done!</p>
        ) : (
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-red-700">
            {mistakes.map((m, i) => <li key={i}>{m.text} <span className="text-slate-400">(at {m.at} min)</span></li>)}
          </ul>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={newAttempt}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          New attempt
        </button>
        <Link
          to={`/experiment/${experimentId}/report`}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          View report
        </Link>
      </div>
    </div>
  )
}
