// engine/store.js
// A single Zustand store drives every Perform-page behaviour. It is completely
// generic: it only calls the functions provided by the experiment's module.

import { create } from 'zustand'
import { getApparatusList, getExperiment } from '../data'
import { getSimModule } from '../experiments/registry'
import { simMinutesFromReal } from './timeSim'
import { advanceGuided, detectFree } from './stepEngine'

// Remember the side-panel open/closed state and mode between visits.
const savedPanel = localStorage.getItem('vcl:panelOpen')
const savedMode = localStorage.getItem('vcl:mode')

let toastId = 0

export const useLab = create((set, get) => ({
  experimentId: null,
  experiment: null,
  apparatusList: [],
  simModule: null,
  sim: null,
  mode: savedMode === 'free' ? 'free' : 'guided',
  stepIndex: 0,
  completed: {},
  sidePanelOpen: savedPanel === null ? true : savedPanel === 'true',
  sideTab: 'aim',
  precautionAck: false,
  toasts: [],
  result: null,

  // --- setup ---
  init: (experimentId) => {
    const experiment = getExperiment(experimentId)
    const simModule = getSimModule(experimentId)
    const apparatusList = experiment ? getApparatusList(experiment.apparatus) : []
    let sim = null
    if (experiment && simModule && experiment.simulation) {
      sim = simModule.createInitialState(experiment.simulation.hidden)
    }
    set({
      experimentId,
      experiment,
      simModule,
      apparatusList,
      sim,
      stepIndex: 0,
      completed: {},
      result: null,
      precautionAck: false,
      toasts: [],
    })
  },

  newAttempt: () => {
    const { experiment, simModule } = get()
    if (!experiment || !simModule) return
    const sim = simModule.createInitialState(experiment.simulation.hidden)
    set({ sim, stepIndex: 0, completed: {}, result: null, toasts: [] })
  },

  setMode: (mode) => {
    localStorage.setItem('vcl:mode', mode)
    set({ mode })
    get()._advanceSteps()
  },

  toggleSidePanel: () => {
    const next = !get().sidePanelOpen
    localStorage.setItem('vcl:panelOpen', String(next))
    set({ sidePanelOpen: next })
  },

  setSideTab: (sideTab) => set({ sideTab }),

  ackPrecautions: () => set({ precautionAck: true }),

  // --- generic action dispatch ---
  dispatch: (action) => {
    const { sim, simModule } = get()
    if (!sim || !simModule) return
    const out = simModule.reduce(sim, action)
    set({ sim: { ...out.state } })
    get()._applyEvents(out.events)
    get()._advanceSteps()
  },

  setObservation: (field, value) =>
    get().dispatch({ type: 'SET_OBSERVATION', payload: { field, value } }),

  // --- timer tick ---
  tick: (dtRealMs) => {
    const { sim, simModule } = get()
    if (!sim || !simModule) return
    const dtSim = simMinutesFromReal(dtRealMs, sim.time.speed)
    const out = simModule.tick(sim, dtSim, dtRealMs)
    set({ sim: { ...out.state } })
    get()._applyEvents(out.events)
    get()._advanceSteps()
  },

  _applyEvents: (events) => {
    if (!events || events.length === 0) return
    const state = get()
    const sim = state.sim
    for (const e of events) {
      if (e.kind === 'warn' || e.kind === 'info' || e.kind === 'block') {
        const exists = state.toasts.some((t) => t.text === e.text)
        if (!exists) {
          const id = ++toastId
          set({ toasts: [...get().toasts, { id, ...e }] })
          setTimeout(() => set({ toasts: get().toasts.filter((t) => t.id !== id) }), 5000)
        }
      }
      // Log mistakes for the report (warnings and blocks count as mistakes).
      if ((e.kind === 'warn' || e.kind === 'block') && sim) {
        const already = sim.mistakes.some((m) => m.text === e.text)
        if (!already) sim.mistakes.push({ text: e.text, at: Math.round(sim.time.simMinutes) })
      }
    }
  },

  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

  _advanceSteps: () => {
    const { experiment, simModule, sim, mode, stepIndex, completed } = get()
    if (!experiment || !simModule || !sim) return
    const checks = simModule.stepChecks

    if (mode === 'guided') {
      const r = advanceGuided(experiment.steps, checks, sim, stepIndex, completed)
      if (r.changed) set({ stepIndex: r.stepIndex, completed: r.completed })
    } else {
      const r = detectFree(experiment.steps, checks, sim, completed)
      if (r.changed) set({ completed: r.completed })
    }
  },

  finish: () => {
    const { sim, simModule } = get()
    if (!sim || !simModule || sim.result) return
    const result = simModule.makeResult(sim)
    sim.result = result
    sim.flags.finished = true
    set({ sim: { ...sim }, result })
    get()._advanceSteps()
  },

  markVivaDone: () => {
    const { sim } = get()
    if (!sim) return
    sim.flags.vivaDone = true
    set({ sim: { ...sim } })
    get()._advanceSteps()
  },
}))
