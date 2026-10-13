import { Link, useParams } from 'react-router-dom'
import { getExperiment, getExperimentSummary } from '../data'
import { hasSimulation } from '../experiments/registry'

export default function ChooseMode() {
  const { id } = useParams()
  const exp = getExperiment(id)
  const summary = getExperimentSummary(id)

  if (!exp) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Experiment not available yet</h1>
        <p className="mt-2 text-slate-500">{summary ? summary.title : 'Unknown experiment.'}</p>
        <Link to="/" className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    )
  }

  const simReady = hasSimulation(id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/" className="text-sm text-blue-600 hover:underline">&larr; All experiments</Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-800">{exp.title}</h1>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Aim</h2>
        <p className="mt-1 text-slate-800">{exp.aim}</p>
        {exp.course && <p className="mt-3 text-xs text-slate-500">{exp.course}</p>}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to={`/experiment/${id}/read`}
          className="group flex flex-col items-center rounded-2xl border-2 border-blue-200 bg-blue-50 p-8 text-center transition hover:border-blue-500 hover:bg-blue-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
        >
          <span className="text-4xl" aria-hidden="true">&#128214;</span>
          <span className="mt-3 text-xl font-bold text-blue-800">Read</span>
          <span className="mt-1 text-sm text-blue-700">Read the full lab manual</span>
        </Link>

        {simReady ? (
          <Link
            to={`/experiment/${id}/perform`}
            className="group flex flex-col items-center rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-8 text-center transition hover:border-emerald-500 hover:bg-emerald-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
          >
            <span className="text-4xl" aria-hidden="true">&#129514;</span>
            <span className="mt-3 text-xl font-bold text-emerald-800">Perform</span>
            <span className="mt-1 text-sm text-emerald-700">Carry out the simulation</span>
          </Link>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 text-center opacity-70">
            <span className="text-4xl" aria-hidden="true">&#9203;</span>
            <span className="mt-3 text-xl font-bold text-slate-500">Perform</span>
            <span className="mt-1 text-sm text-slate-400">Simulation coming soon</span>
          </div>
        )}
      </div>
    </div>
  )
}
