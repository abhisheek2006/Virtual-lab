import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLab } from '../engine/store'
import { formatSimClock, SPEEDS } from '../engine/timeSim'
import SidePanel from '../components/SidePanel'
import Bench from '../components/Bench'
import HintBar from '../components/HintBar'
import Toasts from '../components/Toasts'
import PrecautionsModal from '../components/PrecautionsModal'
import ResultCard from '../components/ResultCard'
import Viva from '../components/Viva'

// Perform.jsx
// The lab bench page. Generic: everything specific comes from the loaded
// experiment JSON and its simulation module.

export default function Perform() {
  const { id } = useParams()
  const init = useLab((s) => s.init)
  const tick = useLab((s) => s.tick)
  const experiment = useLab((s) => s.experiment)
  const sim = useLab((s) => s.sim)
  const simModule = useLab((s) => s.simModule)
  const mode = useLab((s) => s.mode)
  const setMode = useLab((s) => s.setMode)
  const sidePanelOpen = useLab((s) => s.sidePanelOpen)
  const toggleSidePanel = useLab((s) => s.toggleSidePanel)
  const precautionAck = useLab((s) => s.precautionAck)
  const dispatch = useLab((s) => s.dispatch)
  const result = useLab((s) => s.result)
  const resultRef = useRef(null)

  // load the experiment once per id
  useEffect(() => { init(id) }, [id, init])

  // the main simulation clock (only runs after the precautions are accepted).
  // Note: `tick` reads sim from the store, so sim must NOT be a dependency here
  // or the interval would be rebuilt on every frame.
  useEffect(() => {
    if (!precautionAck) return
    const handle = setInterval(() => tick(50), 50)
    return () => clearInterval(handle)
  }, [precautionAck, tick])

  // scroll to the result when it appears
  useEffect(() => {
    if (result && resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [result])

  if (!experiment || !simModule || !sim) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-800">Simulation not available</h1>
        <p className="mt-2 text-slate-500">This experiment has no simulation module yet.</p>
        <Link to={`/experiment/${id}`} className="mt-4 inline-block text-blue-600 hover:underline">Back</Link>
      </div>
    )
  }

  const speed = sim.time.speed

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4">
      {/* top bar */}
      <div className="no-print flex flex-wrap items-center gap-3">
        <Link to={`/experiment/${id}`} className="text-sm text-blue-600 hover:underline">&larr; Back</Link>
        <h1 className="text-lg font-bold text-slate-800">{experiment.shortTitle}</h1>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          {/* simulated clock + speed */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
            <span className="text-xs font-medium text-slate-500">Time</span>
            <span className="font-mono text-sm font-bold text-slate-800">{formatSimClock(sim.time.simMinutes)}</span>
            <span className="ml-1 flex gap-1">
              {SPEEDS.map((sp) => (
                <button key={sp} type="button" onClick={() => dispatch({ type: 'SET_SPEED', payload: { speed: sp } })}
                  className={'rounded px-2 py-0.5 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ' +
                    (speed === sp ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
                  {sp}x
                </button>
              ))}
            </span>
          </div>

          {/* guided / free switch */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
            {['guided', 'free'].map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={'rounded-md px-3 py-1.5 text-sm font-semibold capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ' +
                  (mode === m ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
                {m}
              </button>
            ))}
          </div>

          {!sidePanelOpen && (
            <button type="button" onClick={toggleSidePanel}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
              &#9658; Show manual
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 lg:flex-row">
        {sidePanelOpen && <SidePanel />}
        <div className="min-w-0 flex-1">
          <Bench />
          <div className="mt-3">
            <HintBar />
          </div>
          {result && (
            <div ref={resultRef} className="mt-3 space-y-3">
              <ResultCard />
              <Viva />
            </div>
          )}
        </div>
      </div>

      <Toasts />
      <PrecautionsModal />
    </div>
  )
}
