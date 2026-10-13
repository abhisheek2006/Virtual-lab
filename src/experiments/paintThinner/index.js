// paintThinner/index.js
// All simulation logic for "Thinner content in oil paint" lives here.
// The Perform page and the generic engine never hard-code anything about this
// experiment; they only call the functions exported at the bottom.

const round3 = (v) => Math.round(v * 1000) / 1000
const rand = (min, max) => min + Math.random() * (max - min)
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// A small paint colour palette so each attempt looks a little different.
const PAINT_COLORS = ['#1d4ed8', '#0f766e', '#b91c1c', '#7c3aed', '#b45309']

function createInitialState(hidden) {
  const h = { ...hidden }
  // Hidden truth values. Never shown to the student until the result screen.
  const truth = {
    dishMass: round3(rand(h.emptyDishMin, h.emptyDishMax)),
    thinnerFraction: rand(h.thinnerFractionMin, h.thinnerFractionMax),
    room: h.roomTemperature,
  }
  return {
    hidden: h,
    truth,
    time: { simMinutes: 0, speed: 1, pouring: false },
    balance: {
      on: false,
      settleSec: 0,
      stable: false,
      stableNoise: 0,
      reading: null,
      weightKey: '',
      field: 'W1',
    },
    oven: {
      power: false,
      setpoint: h.ovenSetpoint,
      temp: h.roomTemperature,
      doorOpen: false,
      running: false,
      elapsed: 0,
    },
    desiccator: { lidOpen: true },
    dish: {
      location: 'shelf', // shelf | bench | balance | oven | desiccator
      temp: h.roomTemperature,
      paintMass: 0,
      heatMinutes: 0,
      evaporated: 0,
      matte: false,
      color: PAINT_COLORS[Math.floor(Math.random() * PAINT_COLORS.length)],
    },
    paintTin: { location: 'shelf' },
    records: { W1: null, W2: null, W3: null },
    observations: { W1: '', W2: '', W3: '', W: '', Z: '', percent: '' },
    mistakes: [],
    result: null,
    flags: { finished: false, vivaDone: false, blockDiscard: false },
  }
}

// Current mass of paint actually in the dish (added paint minus evaporated thinner).
function contentMass(state) {
  return Math.max(0, state.dish.paintMass - state.dish.evaporated)
}

// What the balance pan physically carries right now.
function panTrueWeight(state) {
  if (state.dish.location !== 'balance') return 0
  return round3(state.truth.dishMass + contentMass(state))
}

// The three "true" weighings the answer key is built from.
export function trueWeighings(state) {
  const dm = state.truth.dishMass
  return {
    W1: round3(dm),
    W2: round3(dm + state.dish.paintMass),
    W3: round3(dm + contentMass(state)),
    truePercent: round3(state.truth.thinnerFraction * 100),
  }
}

function ev(kind, text) {
  return { kind, text }
}

// ---- Continuous simulation step (called by the engine on a timer) ----
function tick(state, dtSimMin, dtRealMs) {
  const events = []
  const h = state.hidden
  const room = state.truth.room

  // advance simulated clock
  state.time.simMinutes += dtSimMin

  // --- oven temperature ---
  const oven = state.oven
  if (oven.power && oven.temp < oven.setpoint) {
    oven.temp = Math.min(oven.setpoint, oven.temp + ((oven.setpoint - room) / h.ovenHeatMinutes) * dtSimMin)
  } else if (!oven.power && oven.temp > room) {
    oven.temp = Math.max(room, oven.temp - ((oven.setpoint - room) / (h.ovenHeatMinutes * 2)) * dtSimMin)
  }

  // --- dish temperature ---
  const dish = state.dish
  if (dish.location === 'oven' && !oven.doorOpen) {
    dish.temp += (oven.temp - dish.temp) * (1 - Math.exp(-dtSimMin / 1.5))
  } else if (dish.location === 'desiccator' && !state.desiccator.lidOpen) {
    dish.temp += (room - dish.temp) * (1 - Math.exp(-dtSimMin / h.coolTimeConstantMin))
  } else {
    dish.temp += (room - dish.temp) * (1 - Math.exp(-dtSimMin / 5))
  }
  dish.temp = clamp(dish.temp, room, 260)

  // --- heating progress (only while the timer runs and the dish is in a hot oven) ---
  if (oven.running && dish.location === 'oven' && !oven.doorOpen && oven.temp >= oven.setpoint - 2) {
    dish.heatMinutes += dtSimMin
    oven.elapsed += dtSimMin
  }

  // --- evaporation ---
  dish.evaporated = round3(dish.paintMass * state.truth.thinnerFraction * (1 - Math.exp(-dish.heatMinutes / h.heatTimeConstantMin)))
  if (dish.heatMinutes > 10) dish.matte = true

  // --- pouring paint (press and hold) ---
  if (state.time.pouring && state.balance.on && dish.location === 'balance' && state.paintTin.location === 'bench') {
    const add = h.pourStep * (h.pourStepsPerTick || 1)
    dish.paintMass = round3(dish.paintMass + add)
    state.balance.settleSec = 0
    if (dish.paintMass > h.paintMassHigh && dish.paintMass < h.paintMassBlock && !state.flags.overPaintWarned) {
      state.flags.overPaintWarned = true
      events.push(ev('warn', 'You need approximately 1 g of paint.'))
    }
    if (dish.paintMass >= h.paintMassBlock && !state.flags.blockDiscard) {
      state.flags.blockDiscard = true
      events.push({ kind: 'block', text: 'That is far more than 1 g of paint. Discard the paint and clean the dish.', action: 'discard' })
    }
  }
  if (state.time.pouring && dish.location !== 'balance' && dtRealMs > 0) {
    // holding the tin while the dish is not on the balance simply does nothing
    events.push(ev('info', 'Put the dish on the balance before pouring paint.'))
    state.time.pouring = false
  }

  // --- balance electronics ---
  const bal = state.balance
  if (!bal.on) {
    bal.reading = null
    bal.stable = false
    bal.settleSec = 0
    bal.weightKey = ''
  } else {
    const w = panTrueWeight(state)
    const key = w.toFixed(3) + '|' + dish.location
    if (key !== bal.weightKey) {
      bal.weightKey = key
      bal.settleSec = 0
      bal.stable = false
    }
    const hot = dish.location === 'balance' && dish.temp > h.hotThreshold
    bal.settleSec += dtRealMs / 1000
    if (hot) {
      bal.stable = false
      bal.settleSec = 0
      bal.reading = round3(w + (Math.random() - 0.5) * 0.02)
      events.push(ev('warn', 'The dish is hot. Cool it in the desiccator to room temperature first.'))
    } else if (bal.settleSec >= 4) {
      if (!bal.stable) {
        bal.stable = true
        bal.stableNoise = (Math.random() * 2 - 1) * h.balanceNoise
      }
      bal.reading = round3(w + bal.stableNoise)
    } else {
      bal.stable = false
      bal.reading = round3(w + (Math.random() - 0.5) * 0.006)
    }
  }

  // --- live warnings for oven temperature ---
  if (dish.location === 'oven' && !oven.doorOpen && oven.power) {
    if (oven.setpoint !== h.ovenSetpoint) {
      events.push(ev('warn', 'The procedure requires 120 C.'))
    }
  }

  return { state, events }
}

// ---- Discrete actions ----
function reduce(state, action) {
  const events = []
  const h = state.hidden
  const p = action.payload || {}

  switch (action.type) {
    case 'SET_SPEED':
      state.time.speed = p.speed
      break

    case 'TOGGLE_BALANCE':
      state.balance.on = !state.balance.on
      if (state.balance.on) events.push(ev('info', 'Balance switched on. It will take a few seconds to settle.'))
      break

    case 'SET_BALANCE_FIELD':
      state.balance.field = p.field
      break

    case 'RECORD_BALANCE': {
      const bal = state.balance
      if (!bal.on) { events.push(ev('warn', 'Switch the balance on first.')); break }
      if (bal.reading === null) { events.push(ev('warn', 'There is nothing on the balance pan.')); break }
      if (!bal.stable) { events.push(ev('warn', 'Wait for the reading to stabilise before recording.')); break }
      const field = bal.field
      const value = round3(bal.reading)
      state.records[field] = value
      state.observations[field] = value.toFixed(3)
      // recording W1 clears any earlier W2/W3 (fresh start)
      if (field === 'W1') {
        state.records.W2 = null; state.records.W3 = null
        state.observations.W2 = ''; state.observations.W3 = ''; state.observations.W = ''
        state.observations.Z = ''; state.observations.percent = ''
      }
      // helpfully move the selector to the next field
      if (field === 'W1') state.balance.field = 'W2'
      else if (field === 'W2') state.balance.field = 'W3'
      events.push(ev('info', `Recorded ${field} = ${value.toFixed(3)} g`))
      break
    }

    case 'SET_OVEN_POWER':
      state.oven.power = !!p.on
      events.push(ev('info', state.oven.power ? 'Oven switched on.' : 'Oven switched off.'))
      break

    case 'STEP_OVEN_SETPOINT': {
      const next = clamp(state.oven.setpoint + p.delta, 100, 250)
      state.oven.setpoint = next
      break
    }

    case 'TOGGLE_OVEN_DOOR':
      state.oven.doorOpen = !state.oven.doorOpen
      // no penalty for opening while the dish is inside - just animate
      break

    case 'TOGGLE_OVEN_TIMER':
      state.oven.running = !state.oven.running
      break

    case 'MOVE_DISH': {
      const to = p.location
      // moving out of the oven or into it needs the door open
      const needsDoor = (to === 'oven' && state.dish.location !== 'oven') || (state.dish.location === 'oven' && to !== 'oven')
      if (needsDoor && !state.oven.doorOpen) {
        events.push(ev('warn', 'Open the oven door first.'))
        break
      }
      if (to === 'oven') {
        const t = state.oven.temp
        if (state.oven.setpoint !== h.ovenSetpoint || t < h.ovenSetpointTolerance.low || t > h.ovenSetpointTolerance.high) {
          events.push(ev('warn', 'The procedure requires 120 C. Check the oven temperature.'))
        }
      }
      // warn if the dish is taken out before the full hour of heating
      if (state.dish.location === 'oven' && to !== 'oven' && state.dish.heatMinutes > 0 && state.dish.heatMinutes < h.heatTimeMinutes) {
        events.push(ev('warn', 'Heating time was less than 1 hour. Thinner may not be fully evaporated.'))
      }
      state.dish.location = to
      state.balance.settleSec = 0
      state.balance.stable = false
      break
    }

    case 'MOVE_PAINT':
      state.paintTin.location = p.location
      break

    case 'POUR':
      if (p.on) {
        if (state.dish.location !== 'balance') { events.push(ev('info', 'Put the dish on the balance before pouring paint.')); break }
        if (state.paintTin.location !== 'bench') { events.push(ev('info', 'Take the paint tin to the bench first.')); break }
        if (!state.balance.on) { events.push(ev('info', 'Switch the balance on first.')); break }
      }
      state.time.pouring = !!p.on
      break

    case 'TOGGLE_DESICCATOR':
      state.desiccator.lidOpen = !state.desiccator.lidOpen
      break

    case 'DISCARD_PAINT':
      state.dish.paintMass = 0
      state.dish.evaporated = 0
      state.dish.heatMinutes = 0
      state.dish.matte = false
      state.flags.blockDiscard = false
      state.flags.overPaintWarned = false
      state.records.W2 = null; state.records.W3 = null
      state.observations.W2 = ''; state.observations.W3 = ''; state.observations.W = ''
      state.observations.Z = ''; state.observations.percent = ''
      events.push(ev('info', 'Paint discarded. The dish is clean and ready again.'))
      break

    case 'SET_OBSERVATION':
      state.observations[p.field] = p.value
      break

    case 'VIVA_DONE':
      state.flags.vivaDone = true
      break

    case 'RESET':
      return { state: createInitialState(state.hidden), events: [ev('info', 'New attempt started.')] }

    default:
      break
  }

  return { state, events }
}

// ---- Step checks: pure functions of state, named in the JSON ----
const stepChecks = {
  checkOvenPreheat: (s) => s.oven.power && s.oven.setpoint === s.hidden.ovenSetpoint,
  checkRecordW1: (s) => s.records.W1 !== null,
  checkPourPaint: (s) => s.dish.paintMass >= s.hidden.paintMassLow && s.dish.paintMass <= s.hidden.paintMassHigh,
  checkRecordW2: (s) => s.records.W2 !== null,
  checkLoadOven: (s) =>
    s.dish.location === 'oven' && !s.oven.doorOpen &&
    s.oven.setpoint === s.hidden.ovenSetpoint &&
    s.oven.temp >= s.hidden.ovenSetpointTolerance.low && s.oven.temp <= s.hidden.ovenSetpointTolerance.high,
  checkHeatHour: (s) => s.dish.heatMinutes >= s.hidden.heatTimeMinutes,
  checkCooled: (s) => s.dish.location === 'desiccator' && !s.desiccator.lidOpen && s.dish.temp <= s.hidden.cooledThreshold,
  checkRecordW3: (s) => s.records.W3 !== null,
  checkCalculated: (s) => isArithmeticCorrect(s.observations),
  checkReviewed: (s) => s.result !== null && s.flags.vivaDone,
}

// Helps the Observations table show tick / cross marks.
export function isArithmeticCorrect(o) {
  const num = (v) => (v === '' || v === null || v === undefined ? NaN : Number(v))
  const W1 = num(o.W1), W2 = num(o.W2), W3 = num(o.W3), W = num(o.W), Z = num(o.Z), pc = num(o.percent)
  if ([W2, W1].every((x) => !isNaN(x)) && Math.abs(W - (W2 - W1)) > 0.01) return false
  if ([W2, W3].every((x) => !isNaN(x)) && Math.abs(Z - (W2 - W3)) > 0.01) return false
  if (!isNaN(Z) && !isNaN(W) && W !== 0 && !isNaN(pc) && Math.abs(pc - (Z * 100) / W) > 0.01) return false
  if ([W, Z, pc].some((x) => isNaN(x))) return false
  return true
}

// Per-field validation for the observation table.
export function fieldStatus(state, field) {
  const o = state.observations
  const num = (v) => (v === '' || v === null ? NaN : Number(v))
  const truth = trueWeighings(state)
  const within = (a, b, tol) => !isNaN(a) && Math.abs(a - b) <= tol
  switch (field) {
    case 'W1': return o.W1 === '' ? 'empty' : within(num(o.W1), truth.W1, 0.002) ? 'correct' : 'wrong'
    case 'W2': return o.W2 === '' ? 'empty' : within(num(o.W2), truth.W2, 0.002) ? 'correct' : 'wrong'
    case 'W3': return o.W3 === '' ? 'empty' : within(num(o.W3), truth.W3, 0.002) ? 'correct' : 'wrong'
    case 'W': return o.W === '' ? 'empty' : within(num(o.W), num(o.W2) - num(o.W1), 0.01) ? 'correct' : 'wrong'
    case 'Z': return o.Z === '' ? 'empty' : within(num(o.Z), num(o.W2) - num(o.W3), 0.01) ? 'correct' : 'wrong'
    case 'percent':
      return o.percent === '' ? 'empty'
        : within(num(o.percent), (num(o.Z) * 100) / num(o.W), 0.01) ? 'correct' : 'wrong'
    default: return 'empty'
  }
}

// Build the result object when the student presses Finish.
export function makeResult(state) {
  const truth = trueWeighings(state)
  const o = state.observations
  const num = (v) => (v === '' || v === null ? NaN : Number(v))
  let studentPercent = num(o.percent)
  if (isNaN(studentPercent) && !isNaN(num(o.Z)) && !isNaN(num(o.W)) && num(o.W) !== 0) {
    studentPercent = (num(o.Z) * 100) / num(o.W)
  }
  const actual = truth.truePercent
  let feedback = 'Check your heating time and cooling.'
  let grade = 'check'
  if (!isNaN(studentPercent)) {
    const diff = Math.abs(studentPercent - actual)
    if (diff <= 1) { feedback = 'Excellent'; grade = 'excellent' }
    else if (diff <= 3) { feedback = 'Good'; grade = 'good' }
  } else {
    feedback = 'You have not entered your final percentage yet.'
  }
  return {
    studentPercent: isNaN(studentPercent) ? null : round3(studentPercent),
    actualPercent: actual,
    feedback,
    grade,
    heatMinutes: round3(state.dish.heatMinutes),
    truth,
  }
}

const paintThinner = {
  id: 'paint-thinner',
  createInitialState,
  tick,
  reduce,
  stepChecks,
  fieldStatus,
  makeResult,
  trueWeighings,
}

export default paintThinner
