import { useEffect, useState } from 'react'
import { useLab } from '../engine/store'

// Viva.jsx
// Four multiple-choice viva questions shown after the result. Answering all of
// them is the last guided step.

export default function Viva() {
  const experiment = useLab((s) => s.experiment)
  const result = useLab((s) => s.result)
  const markVivaDone = useLab((s) => s.markVivaDone)
  const [answers, setAnswers] = useState([])

  const questions = experiment ? experiment.viva : []
  const allAnswered = answers.length === questions.length && questions.length > 0

  useEffect(() => {
    if (allAnswered) markVivaDone()
  }, [allAnswered, markVivaDone])

  if (!result || !experiment) return null

  const choose = (qi, oi) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[qi] = oi
      return next
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800">Viva questions</h2>
      <p className="mt-1 text-sm text-slate-500">Answer all four to complete the practical.</p>
      <div className="mt-4 space-y-4">
        {questions.map((q, qi) => {
          const answered = answers[qi] !== undefined
          const correct = answers[qi] === q.answerIndex
          return (
            <div key={qi} className="rounded-xl border border-slate-200 p-3">
              <p className="font-medium text-slate-800">{qi + 1}. {q.question}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[qi] === oi
                  const isRight = oi === q.answerIndex
                  let cls = 'border-slate-200 bg-white hover:bg-slate-50'
                  if (answered && selected) cls = isRight ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50'
                  else if (answered && isRight) cls = 'border-emerald-300 bg-emerald-50/60'
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => choose(qi, oi)}
                      className={'rounded-lg border px-3 py-2 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ' + cls}
                    >
                      {answered && selected && <span aria-hidden="true" className="mr-1">{isRight ? '✓' : '✗'}</span>}
                      {opt}
                    </button>
                  )
                })}
              </div>
              {answered && (
                <p className={'mt-2 text-xs ' + (correct ? 'text-emerald-700' : 'text-red-700')}>
                  {correct ? 'Correct. ' : 'Not quite. '}{q.explain}
                </p>
              )}
            </div>
          )
        })}
      </div>
      {allAnswered && <p className="mt-3 text-sm font-semibold text-emerald-700">Viva complete. You can now print your report.</p>}
    </div>
  )
}
