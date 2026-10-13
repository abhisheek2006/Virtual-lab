// data/index.js
// One place that loads all JSON data. Vite's import.meta.glob lets new
// experiment files be picked up automatically - no code change needed.

import apparatus from './apparatus.json'
import precautions from './precautions.json'
import experimentIndex from './experiments/index.json'

// Grab every JSON file in the experiments folder at build time.
const manualModules = import.meta.glob('./experiments/*.json', { eager: true })

const manuals = {}
for (const mod of Object.values(manualModules)) {
  const data = mod.default || mod
  if (data && data.id) manuals[data.id] = data
}

export function getExperimentList() {
  return experimentIndex.experiments
}

export function getExperiment(id) {
  return manuals[id] || null
}

export function getExperimentSummary(id) {
  return experimentIndex.experiments.find((e) => e.id === id) || null
}

export function getApparatus(id) {
  return apparatus[id] || null
}

export function getApparatusList(ids) {
  return ids.map((id) => apparatus[id]).filter(Boolean)
}

export function getPrecautions() {
  return precautions
}
