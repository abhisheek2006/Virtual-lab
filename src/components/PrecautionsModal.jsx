import { useLab } from '../engine/store'
import { getPrecautions } from '../data'

// PrecautionsModal.jsx
// A safety pop-up shown when the Perform page opens. The student must
// acknowledge it before starting.

export default function PrecautionsModal() {
  const experiment = useLab((s) => s.experiment)
  const ack = useLab((s) => s.precautionAck)
  const ackPrecautions = useLab((s) => s.ackPrecautions)

  if (!experiment || ack) return null
  const precautions = getPrecautions()

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="precaution-title"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="precaution-title" className="flex items-center gap-2 text-xl font-bold text-amber-800">
          <span aria-hidden="true">&#9888;</span> Laboratory Precautions
        </h2>
        <p className="mt-1 text-sm text-slate-500">Please read carefully before you begin the practical.</p>

        <h3 className="mt-4 text-sm font-semibold text-slate-800">For this practical</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {experiment.precautions.map((p, i) => <li key={i}>{p}</li>)}
        </ul>

        <h3 className="mt-4 text-sm font-semibold text-slate-800">General safety</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {precautions.general.map((p, i) => <li key={i}>{p}</li>)}
        </ul>

        <button
          type="button"
          onClick={ackPrecautions}
          className="mt-6 w-full rounded-xl bg-amber-600 px-4 py-3 font-semibold text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
        >
          I have read and understood &mdash; Start experiment
        </button>
      </div>
    </div>
  )
}
