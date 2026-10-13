// registry.js
// Maps an experiment id to its simulation module. The Perform page only uses
// this registry, so adding an experiment means importing its module here.

import paintThinner from './paintThinner'

const modules = {
  'paint-thinner': paintThinner,
}

export function getSimModule(id) {
  return modules[id] || null
}

export function hasSimulation(id) {
  return Boolean(modules[id])
}
