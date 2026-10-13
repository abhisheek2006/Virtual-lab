// timeSim.js
// Small helpers that convert real time into "simulated lab time" and format it.
// Keeping this separate from the experiment logic means any experiment can reuse it.

// The time-control buttons multiply real time by one of these factors.
export const SPEEDS = [1, 60, 240]

// At 240x, 1 real second == 240 simulated seconds == 4 simulated minutes,
// so one simulated hour finishes in 15 real seconds. At 1x it runs in real time.
export function simMinutesFromReal(realMs, speed) {
  return (realMs / 1000) * speed / 60
}

// Format simulated minutes as H:MM:SS, e.g. 0 -> "0:00:00", 60 -> "1:00:00".
export function formatSimClock(simMinutes) {
  const totalSeconds = Math.max(0, Math.round(simMinutes * 60))
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${h}:${pad(m)}:${pad(s)}`
}

// Standard exponential approach: move "value" towards "target" with a time
// constant tau (in simulated minutes) over dt minutes. Used for temperatures.
export function approach(value, target, dt, tau) {
  if (dt <= 0) return value
  const factor = 1 - Math.exp(-dt / tau)
  return value + (target - value) * factor
}
