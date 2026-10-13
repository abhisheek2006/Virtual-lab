import { Link } from 'react-router-dom'
import { getExperimentList, getPrecautions } from '../data'

function ExperimentCard({ exp }) {
  const active = exp.status === 'active'
  const content = (
    <div
      className={
        'flex items-center justify-between rounded-xl border p-4 transition ' +
        (active
          ? 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
          : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70')
      }
    >
      <div className="pr-3">
        <p className={'font-semibold ' + (active ? 'text-slate-800' : 'text-slate-500')}>{exp.title}</p>
        {active ? (
          <p className="mt-1 text-sm text-blue-700">Tap to open &mdash; equipped with a full lab simulation</p>
        ) : (
          <p className="mt-1 text-sm text-slate-400">{exp.shortTitle}</p>
        )}
      </div>
      <span
        className={
          'shrink-0 rounded-full px-3 py-1 text-xs font-semibold ' +
          (active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500')
        }
      >
        {active ? 'Start' : 'Coming soon'}
      </span>
    </div>
  )

  if (!active) {
    return <div aria-disabled="true">{content}</div>
  }
  return <Link to={`/experiment/${exp.id}`}>{content}</Link>
}

export default function Home() {
  const experiments = getExperimentList()
  const precautions = getPrecautions()

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT ~65% */}
        <section className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-slate-800">List of Experiments</h1>
          <p className="mt-1 text-sm text-slate-500">
            Choose an experiment to read the manual or practise it on screen.
          </p>
          <div className="mt-4 space-y-3">
            {experiments.map((exp) => (
              <ExperimentCard key={exp.id} exp={exp} />
            ))}
          </div>
        </section>

        {/* RIGHT ~35% sticky */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-20 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-800">
              <span aria-hidden="true">&#9888;</span> Laboratory Precautions
            </h2>
            <h3 className="mt-3 text-sm font-semibold text-amber-800">General</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-900">
              {precautions.general.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <h3 className="mt-3 text-sm font-semibold text-amber-800">For this practical</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-900">
              {precautions.experiment.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
