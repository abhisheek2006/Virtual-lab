import { useLab } from '../engine/store'

// ObservationTable.jsx
// Editable table matching the manual. Fields filled from the balance can also
// be typed. Each field shows a tick / cross based on the simulation.

const ROWS = [
  { field: 'W1', obs: 'Weight of empty porcelain dish', sym: 'W1', unit: 'g' },
  { field: 'W2', obs: 'Weight of porcelain dish + paint (before heating)', sym: 'W2', unit: 'g' },
  { field: 'W', obs: 'Weight of paint, W = W2 - W1', sym: 'W', unit: 'g' },
  { field: 'W3', obs: 'Weight of porcelain dish + paint (after heating)', sym: 'W3', unit: 'g' },
  { field: 'Z', obs: 'Loss in weight of paint, Z = W2 - W3', sym: 'Z', unit: 'g' },
  { field: 'percent', obs: 'Thinner content = (Z x 100) / W', sym: '%', unit: '%' },
]

function Status({ state }) {
  if (state === 'correct') {
    return <span title="Correct" aria-label="Correct" className="inline-flex items-center gap-1 font-semibold text-emerald-700"><span aria-hidden="true">&#10003;</span>ok</span>
  }
  if (state === 'wrong') {
    return <span title="Incorrect" aria-label="Incorrect" className="inline-flex items-center gap-1 font-semibold text-red-700"><span aria-hidden="true">&#10007;</span>check</span>
  }
  return <span className="text-slate-400" aria-label="Not entered">&mdash;</span>
}

export default function ObservationTable() {
  const sim = useLab((s) => s.sim)
  const simModule = useLab((s) => s.simModule)
  const setObservation = useLab((s) => s.setObservation)

  if (!sim || !simModule) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="border border-slate-200 px-1.5 py-1">Sr.</th>
            <th className="border border-slate-200 px-1.5 py-1">Observation</th>
            <th className="border border-slate-200 px-1.5 py-1">Symbol</th>
            <th className="border border-slate-200 px-1.5 py-1">Value</th>
            <th className="border border-slate-200 px-1.5 py-1">Check</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => {
            const status = simModule.fieldStatus(sim, row.field)
            return (
              <tr key={row.field}>
                <td className="border border-slate-200 px-1.5 py-1">{i + 1}</td>
                <td className="border border-slate-200 px-1.5 py-1">{row.obs}</td>
                <td className="border border-slate-200 px-1.5 py-1 font-semibold">{row.sym}</td>
                <td className="border border-slate-200 px-1.5 py-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={sim.observations[row.field]}
                      onChange={(e) => setObservation(row.field, e.target.value)}
                      placeholder="___"
                      aria-label={`Value for ${row.sym}`}
                      className="w-20 rounded border border-slate-300 px-1.5 py-0.5 text-right font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    />
                    <span className="text-slate-400">{row.unit}</span>
                  </div>
                </td>
                <td className="border border-slate-200 px-1.5 py-1"><Status state={status} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-slate-500">
        Tip: after a stable reading, use the <b>Record</b> button on the balance. You can also type values here.
      </p>
    </div>
  )
}
