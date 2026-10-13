import { useLab } from '../engine/store'
import ObservationTable from './ObservationTable'
import { getPrecautions } from '../data'

// SidePanel.jsx
// Collapsible instruction panel with tabs. Its open/closed state is remembered
// by the store (and localStorage).

const TABS = [
  { id: 'aim', label: 'Aim' },
  { id: 'apparatus', label: 'Apparatus' },
  { id: 'procedure', label: 'Procedure' },
  { id: 'precautions', label: 'Precautions' },
  { id: 'observations', label: 'Observations' },
]

export default function SidePanel() {
  const experiment = useLab((s) => s.experiment)
  const apparatusList = useLab((s) => s.apparatusList)
  const sideTab = useLab((s) => s.sideTab)
  const setSideTab = useLab((s) => s.setSideTab)
  const toggleSidePanel = useLab((s) => s.toggleSidePanel)

  if (!experiment) return null
  const precautions = getPrecautions()

  return (
    <aside className="no-print flex w-full shrink-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm lg:w-[340px]">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <h2 className="text-sm font-bold text-slate-700">Lab Manual</h2>
        <button
          type="button"
          onClick={toggleSidePanel}
          aria-label="Minimise the side panel"
          className="rounded-md border border-slate-300 px-2 py-0.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          &#9668; Hide
        </button>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-slate-200 px-2 py-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSideTab(t.id)}
            className={
              'rounded-md px-2.5 py-1 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ' +
              (sideTab === t.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-3 py-3 text-sm text-slate-700 lg:max-h-[calc(100vh-220px)]">
        {sideTab === 'aim' && (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-slate-800">Aim</h3>
              <p>{experiment.aim}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Course Outcome</h3>
              <p>{experiment.courseOutcome}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Learning Outcomes</h3>
              <ul className="list-disc pl-4">
                <li>Practical: {experiment.practicalLearningOutcome}</li>
                <li>Laboratory: {experiment.laboratoryLearningOutcome}</li>
                <li>Affective: {experiment.affectiveDomainOutcome}</li>
              </ul>
            </div>
          </div>
        )}

        {sideTab === 'apparatus' && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500">Only the items listed for this experiment are available.</p>
            {apparatusList.map((a) => (
              <div key={a.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                <div className="font-semibold text-slate-800">{a.name}</div>
                <div className="text-xs text-slate-500">{a.specification}</div>
              </div>
            ))}
          </div>
        )}

        {sideTab === 'procedure' && (
          <ol className="list-decimal space-y-1 pl-4">
            {experiment.procedure.map((p, i) => <li key={i}>{p}</li>)}
          </ol>
        )}

        {sideTab === 'precautions' && (
          <div className="space-y-2">
            <ul className="list-disc space-y-1 pl-4">
              {experiment.precautions.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
            <h3 className="pt-1 font-semibold text-slate-800">General safety</h3>
            <ul className="list-disc space-y-1 pl-4 text-slate-600">
              {precautions.general.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        )}

        {sideTab === 'observations' && <ObservationTable />}
      </div>
    </aside>
  )
}
