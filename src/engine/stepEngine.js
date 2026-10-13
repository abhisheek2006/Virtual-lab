// stepEngine.js
// Pure helpers that decide which guided steps are complete. Kept separate from
// the store so the logic is easy to test and reuse across experiments.

// Evaluate one step by looking up its named check function on the module.
export function evaluateStep(step, checks, sim) {
  const fn = checks[step.check]
  return fn ? Boolean(fn(sim)) : false
}

// Guided mode: steps must be done in order. Consume as many as pass in a row.
export function advanceGuided(steps, checks, sim, stepIndex, completed) {
  const done = { ...completed }
  let idx = stepIndex
  while (idx < steps.length && evaluateStep(steps[idx], checks, sim)) {
    done[steps[idx].id] = true
    idx += 1
  }
  return { stepIndex: idx, completed: done, changed: idx !== stepIndex }
}

// Free mode: any step can complete at any time; just detect what has happened.
export function detectFree(steps, checks, sim, completed) {
  const done = { ...completed }
  let changed = false
  for (const step of steps) {
    if (!done[step.id] && evaluateStep(step, checks, sim)) {
      done[step.id] = true
      changed = true
    }
  }
  return { completed: done, changed }
}
