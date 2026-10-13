import { Link, useParams } from 'react-router-dom'
import { getExperiment } from '../data'

function Section({ title, children }) {
  return (
    <section className="mt-6 break-inside-avoid">
      <h2 className="border-b border-slate-200 pb-1 text-lg font-semibold text-slate-800">{title}</h2>
      <div className="mt-2 text-slate-700">{children}</div>
    </section>
  )
}

export default function Read() {
  const { id } = useParams()
  const exp = getExperiment(id)

  if (!exp) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-600">Manual not found.</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link to={`/experiment/${id}`} className="text-sm text-blue-600 hover:underline">&larr; Back</Link>
        <button
          onClick={() => window.print()}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Print / Save as PDF
        </button>
      </div>

      <article className="print-area mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">{exp.title}</h1>
        {exp.course && <p className="mt-1 text-xs text-slate-500">{exp.course}</p>}

        <Section title="Practical Significance">
          <p>{exp.significance}</p>
        </Section>

        <Section title="Industry / Employer Expected Outcomes">
          <ol className="list-decimal space-y-1 pl-5">
            {exp.industryOutcomes.map((o, i) => <li key={i}>{o}</li>)}
          </ol>
        </Section>

        <Section title="Course Outcome">
          <p>{exp.courseOutcome}</p>
        </Section>

        <Section title="Learning Outcomes">
          <ul className="list-disc space-y-1 pl-5">
            <li><b>Practical:</b> {exp.practicalLearningOutcome}</li>
            <li><b>Laboratory:</b> {exp.laboratoryLearningOutcome}</li>
            <li><b>Affective domain:</b> {exp.affectiveDomainOutcome}</li>
          </ul>
        </Section>

        <Section title="Theory">
          <p>{exp.theory}</p>
        </Section>

        <Section title="Experimental Set-up">
          <p>{exp.experimentalSetUp}</p>
        </Section>

        <Section title="Resources">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="border border-slate-200 px-2 py-1">Sr.</th>
                  <th className="border border-slate-200 px-2 py-1">Resource</th>
                  <th className="border border-slate-200 px-2 py-1">Specification</th>
                  <th className="border border-slate-200 px-2 py-1">Qty</th>
                </tr>
              </thead>
              <tbody>
                {exp.resources.map((r) => (
                  <tr key={r.sr}>
                    <td className="border border-slate-200 px-2 py-1">{r.sr}</td>
                    <td className="border border-slate-200 px-2 py-1">{r.resource}</td>
                    <td className="border border-slate-200 px-2 py-1">{r.specification}</td>
                    <td className="border border-slate-200 px-2 py-1">{r.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Precautions">
          <ul className="list-disc space-y-1 pl-5">
            {exp.precautions.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </Section>

        <Section title="Procedure">
          <ol className="list-decimal space-y-1 pl-5">
            {exp.procedure.map((p, i) => <li key={i}>{p}</li>)}
          </ol>
        </Section>

        <Section title="Observation Table">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="border border-slate-200 px-2 py-1">Sr.</th>
                  <th className="border border-slate-200 px-2 py-1">Observation</th>
                  <th className="border border-slate-200 px-2 py-1">Symbol</th>
                  <th className="border border-slate-200 px-2 py-1">Value</th>
                </tr>
              </thead>
              <tbody>
                {exp.observationTable.map((row) => (
                  <tr key={row.sr}>
                    <td className="border border-slate-200 px-2 py-1">{row.sr}</td>
                    <td className="border border-slate-200 px-2 py-1">{row.observation}</td>
                    <td className="border border-slate-200 px-2 py-1">{row.symbol}</td>
                    <td className="border border-slate-200 px-2 py-1 text-slate-400">______ {row.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Calculations">
          <p>{exp.calculation}</p>
        </Section>

        <Section title="Result">
          <p>{exp.result}</p>
        </Section>
      </article>

      <div className="no-print mt-6 flex justify-center">
        <Link
          to={`/experiment/${id}/perform`}
          className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        >
          Perform this experiment &rarr;
        </Link>
      </div>
    </div>
  )
}
