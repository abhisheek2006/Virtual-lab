import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLab } from '../engine/store'

// Report.jsx
// Print-friendly report. Values come from the store (the current attempt).
// Student name and date are typed in and can be printed.

export default function Report() {
  const { id } = useParams()
  const experiment = useLab((s) => s.experiment)
  const sim = useLab((s) => s.sim)
  const result = useLab((s) => s.result)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')

  if (!experiment || !sim) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-800">No attempt to report</h1>
        <p className="mt-2 text-slate-500">Please perform the experiment first, then open the report.</p>
        <Link to={`/experiment/${id}/perform`} className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700">
          Go to the simulation
        </Link>
      </div>
    )
  }

  const o = sim.observations
  const rows = [
    { sr: 1, obs: 'Weight of empty porcelain dish', sym: 'W1', val: o.W1, unit: 'g' },
    { sr: 2, obs: 'Weight of porcelain dish + paint (before heating)', sym: 'W2', val: o.W2, unit: 'g' },
    { sr: 3, obs: 'Weight of paint, W = W2 - W1', sym: 'W', val: o.W, unit: 'g' },
    { sr: 4, obs: 'Weight of porcelain dish + paint (after heating)', sym: 'W3', val: o.W3, unit: 'g' },
    { sr: 5, obs: 'Loss in weight of paint, Z = W2 - W3', sym: 'Z', val: o.Z, unit: 'g' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link to={`/experiment/${id}/perform`} className="text-sm text-blue-600 hover:underline">&larr; Back to bench</Link>
        <button onClick={() => window.print()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
          Print / Save as PDF
        </button>
      </div>

      <article className="print-area mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-xl font-bold text-slate-800">Laboratory Report</h1>
        <p className="mt-1 text-center text-sm text-slate-600">{experiment.title}</p>

        <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <label className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Student name:</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"
              className="flex-1 border-b border-slate-300 px-1 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" />
          </label>
          <label className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Date:</span>
            <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="DD / MM / YYYY"
              className="flex-1 border-b border-slate-300 px-1 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" />
          </label>
        </div>

        <section className="mt-5">
          <h2 className="border-b border-slate-200 pb-1 text-base font-semibold text-slate-800">Aim</h2>
          <p className="mt-1 text-slate-700">{experiment.aim}</p>
        </section>

        <section className="mt-5 break-inside-avoid">
          <h2 className="border-b border-slate-200 pb-1 text-base font-semibold text-slate-800">Observation Table</h2>
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="border border-slate-200 px-2 py-1">Sr.</th>
                <th className="border border-slate-200 px-2 py-1">Observation</th>
                <th className="border border-slate-200 px-2 py-1">Symbol</th>
                <th className="border border-slate-200 px-2 py-1">Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.sr}>
                  <td className="border border-slate-200 px-2 py-1">{r.sr}</td>
                  <td className="border border-slate-200 px-2 py-1">{r.obs}</td>
                  <td className="border border-slate-200 px-2 py-1">{r.sym}</td>
                  <td className="border border-slate-200 px-2 py-1 font-mono">{r.val === '' ? '______' : r.val} {r.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-5">
          <h2 className="border-b border-slate-200 pb-1 text-base font-semibold text-slate-800">Calculation</h2>
          <p className="mt-1 text-slate-700">{experiment.calculation}</p>
          <p className="mt-1 font-mono text-slate-700">
            = ({o.Z === '' ? 'Z' : o.Z} x 100) / {o.W === '' ? 'W' : o.W} = {o.percent === '' ? '______' : o.percent} %
          </p>
        </section>

        <section className="mt-5">
          <h2 className="border-b border-slate-200 pb-1 text-base font-semibold text-slate-800">Result</h2>
          <p className="mt-1 text-slate-700">
            Thinner content of the paint = <b>{o.percent === '' ? '______' : o.percent} %</b>
          </p>
          {result && (
            <p className="mt-1 text-sm text-slate-500">
              Performance feedback: {result.feedback}.
            </p>
          )}
        </section>

        {sim.mistakes.length > 0 && (
          <section className="mt-5 break-inside-avoid">
            <h2 className="border-b border-slate-200 pb-1 text-base font-semibold text-slate-800">Observations &amp; Cautions Taken</h2>
            <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
              {sim.mistakes.map((m, i) => <li key={i}>{m.text}</li>)}
            </ul>
          </section>
        )}

        <p className="mt-8 text-right text-sm text-slate-500">
          Signature: ______________________
        </p>
      </article>
    </div>
  )
}
