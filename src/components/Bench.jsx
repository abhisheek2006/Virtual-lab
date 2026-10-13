import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors, pointerWithin,
} from '@dnd-kit/core'
import { useLab } from '../engine/store'
import Shelf from './Shelf'
import { DraggableItem, DropZone } from './DragBits'
import PorcelainDish from './apparatus/PorcelainDish'
import PaintTin from './apparatus/PaintTin'
import WeighingBalance from './apparatus/WeighingBalance'
import ElectricOven from './apparatus/ElectricOven'
import Desiccator from './apparatus/Desiccator'

// Bench.jsx
// Owns the drag-and-drop context and lays out the shelf + working stations as
// instruments standing on the lab counter.

const STATIONS = ['bench', 'balance', 'oven', 'desiccator']
const DISH_TARGETS = [
  { id: 'bench', label: 'Bench' },
  { id: 'balance', label: 'Balance' },
  { id: 'oven', label: 'Oven' },
  { id: 'desiccator', label: 'Desiccator' },
  { id: 'shelf', label: 'Shelf' },
]
const TIN_TARGETS = [
  { id: 'bench', label: 'Bench' },
  { id: 'shelf', label: 'Shelf' },
]

function Screw({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="3" fill="#64748b" stroke="#475569" strokeWidth="1" />
      <line x1="-1.6" y1="0" x2="1.6" y2="0" stroke="#334155" strokeWidth="1" />
    </g>
  )
}

// Instrument housing: brushed-metal bezel with LED status strip, screws and an
// inset working area — makes each station read like a real lab instrument.
function StationCard({ title, children, led = { run: false, warm: false, ok: false }, className = '' }) {
  return (
    <div className={'relative rounded-xl border border-slate-400 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 p-2 shadow-[0_10px_18px_-8px_rgba(15,23,42,0.55)] ' + className}>
      {/* brushed metal top strip */}
      <div className="flex items-center justify-between rounded-t-lg bg-gradient-to-b from-slate-100 to-slate-300 px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          {[
            ['run', led.run ? '#f59e0b' : '#334155', led.run],
            ['warm', led.warm ? '#dc2626' : '#334155', led.warm],
            ['ok', led.ok ? '#22c55e' : '#334155', led.ok],
          ].map(([k, c, on]) => (
            <span key={k}
              className={'h-2 w-2 rounded-full transition ' + (on ? 'shadow-[0_0_6px_1px_rgba(255,255,255,0.55)]' : '')}
              style={{ background: c }} />
          ))}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">{title}</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        </span>
      </div>

      <svg viewBox="0 0 300 10" preserveAspectRatio="none" className="pointer-events-none h-2 w-full" aria-hidden="true">
        <Screw x={6} y={5} />
        <Screw x={294} y={5} />
      </svg>

      {/* inset working area */}
      <div className="relative rounded-lg border border-slate-400/60 bg-gradient-to-b from-slate-100 to-slate-200 p-3 shadow-inner">
        {children}
      </div>

      {/* corner screws */}
      <svg viewBox="0 0 300 10" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-1 h-2 w-full" aria-hidden="true">
        <Screw x={6} y={5} />
        <Screw x={294} y={5} />
      </svg>
    </div>
  )
}

// Live pour effect: paint streams from the tilted tin (off the top of the card)
// down onto the dish, with an expanding splash and dribbling droplets.
function PourOverlay({ color }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="pourStream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* neck of the tilted tin near the top */}
      <path d="M50 0 L56 6 L48 10 Z" fill={color} />

      {/* main falling stream */}
      <motion.path
        d="M52 6 C 55 16 46 22 50 32 C 53 40 48 46 49.5 52"
        stroke="url(#pourStream)" strokeWidth="2.4" fill="none" strokeLinecap="round"
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 0.55, repeat: Infinity }}
      />
      {/* thin fast core of the stream */}
      <motion.path
        d="M53 6 C 54 16 47 22 50.5 32 C 52 40 48.8 46 49.6 52"
        stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round"
        strokeDasharray="6 6"
        animate={{ strokeDashoffset: [-6, 6] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
      />

      {/* splash ripples spreading on the paint surface */}
      <motion.ellipse
        cx="49.6" cy="54" rx="10" ry="3.4" fill="none" stroke={color} strokeWidth="1.1"
        animate={{ opacity: [0.75, 0, 0.75], scale: [0.5, 2, 0.5] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.ellipse
        cx="49.6" cy="54" rx="6" ry="2" fill="none" stroke="#ffffff" strokeWidth="0.7"
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />

      {/* droplets falling off the stream */}
      {[[44, 26], [55, 32], [52, 16], [47, 38], [58, 44]].map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r={i % 2 ? 1.2 : 0.9} fill={color}
          animate={{ cy: [y, y + 16, y], opacity: [0.9, 0, 0.9] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.14, ease: 'easeIn' }}
        />
      ))}

      {/* tiny spatter on the dish rim */}
      <motion.circle cx="56" cy="56" r="0.8" fill={color}
        animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.3, repeat: Infinity, delay: 0.3 }} />
    </svg>
  )
}

export default function Bench() {
  const sim = useLab((s) => s.sim)
  const dispatch = useLab((s) => s.dispatch)
  const [active, setActive] = useState(null)
  const [selected, setSelected] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  if (!sim) return null

  const dishHere = (loc) => sim.dish.location === loc
  const pouring = sim.time.pouring && dishHere('balance')
  const dishProps = {
    paintMass: sim.dish.paintMass, color: sim.dish.color, matte: sim.dish.matte,
    temp: sim.dish.temp, pouring,
  }
  const dishNode = (
    <div className="w-[110px]">
      <PorcelainDish paintMass={sim.dish.paintMass} color={sim.dish.color} matte={sim.dish.matte} />
    </div>
  )

  const onDragEnd = (e) => {
    setActive(null)
    const over = e.over && e.over.id
    if (!over) return
    if (e.active.id === 'dish' && STATIONS.concat('shelf').includes(over)) {
      dispatch({ type: 'MOVE_DISH', payload: { location: over } })
    }
    if (e.active.id === 'paint-tin' && (over === 'bench' || over === 'shelf')) {
      dispatch({ type: 'MOVE_PAINT', payload: { location: over } })
    }
  }

  const place = (target) => {
    if (!selected) return
    if (selected === 'dish') dispatch({ type: 'MOVE_DISH', payload: { location: target } })
    if (selected === 'paint-tin') dispatch({ type: 'MOVE_PAINT', payload: { location: target } })
    setSelected(null)
  }

  const targets = selected === 'dish' ? DISH_TARGETS : selected === 'paint-tin' ? TIN_TARGETS : []

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin}
      onDragStart={(e) => setActive(e.active.id)} onDragEnd={onDragEnd} onDragCancel={() => setActive(null)}>
      <Shelf selected={selected} onSelect={(v) => setSelected((s) => (s === v ? null : v))} />

      {/* fallback placement controls for touch / keyboard */}
      {selected && (
        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm">
          <span className="font-medium text-blue-800">Place {selected === 'dish' ? 'porcelain dish' : 'paint tin'} on:</span>
          {targets.map((t) => (
            <button key={t.id} type="button" onClick={() => place(t.id)}
              className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
              {t.label}
            </button>
          ))}
          <button type="button" onClick={() => setSelected(null)} className="text-xs text-slate-500 hover:underline">cancel</button>
        </div>
      )}

      {/* the working bench */}
      <div className="mt-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {/* work bench rest area */}
          <DropZone id="bench" className="rounded-xl">
            <StationCard title="Work bench" className="min-h-[200px]"
              led={{ run: dishHere('bench') || sim.paintTin.location === 'bench', warm: pouring, ok: sim.dish.paintMass > 0 }}>
              <div className="flex min-h-[150px] items-end justify-center gap-3">
                {dishHere('bench') ? (
                  <DraggableItem id="dish" label="Drag porcelain dish"
                    className={selected === 'dish' ? 'ring-4 ring-blue-400' : ''}>
                    <div onClick={() => setSelected('dish')} className="w-[110px]"><PorcelainDish {...dishProps} /></div>
                  </DraggableItem>
                ) : !dishHere('balance') && !dishHere('oven') && !dishHere('desiccator') && (
                  <span className="pb-6 text-[11px] text-slate-400">drop the dish here</span>
                )}

                {sim.paintTin.location === 'bench' && (
                  <div className="flex flex-col items-center">
                    <DraggableItem id="paint-tin" label="Drag paint tin"
                      className={selected === 'paint-tin' ? 'ring-4 ring-blue-400' : ''}>
                      <div onClick={() => setSelected('paint-tin')}><PaintTin pouring={sim.time.pouring} size={0.8} /></div>
                    </DraggableItem>
                    <button
                      type="button"
                      onPointerDown={(e) => { e.preventDefault(); dispatch({ type: 'POUR', payload: { on: true } }) }}
                      onPointerUp={() => dispatch({ type: 'POUR', payload: { on: false } })}
                      onPointerLeave={() => dispatch({ type: 'POUR', payload: { on: false } })}
                      onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); dispatch({ type: 'POUR', payload: { on: true } }) } }}
                      onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') dispatch({ type: 'POUR', payload: { on: false } }) }}
                      className="mt-1 rounded-md bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      Hold to pour
                    </button>
                  </div>
                )}
              </div>
            </StationCard>
          </DropZone>

          {/* balance */}
          <DropZone id="balance" className="rounded-xl">
            <StationCard title="Weighing balance" className="relative"
              led={{ run: sim.balance.on, ok: sim.balance.stable, warm: sim.dish.temp > 40 }}>
              <WeighingBalance
                balance={sim.balance}
                dish={dishHere('balance') ? { ...dishProps, temp: sim.dish.temp } : null}
                onToggle={() => dispatch({ type: 'TOGGLE_BALANCE' })}
                onFieldChange={(field) => dispatch({ type: 'SET_BALANCE_FIELD', payload: { field } })}
                onRecord={() => dispatch({ type: 'RECORD_BALANCE' })}
              />
              {pouring && <PourOverlay color={sim.dish.color} />}
              {sim.dish.paintMass > 0 && (
                <div className="mt-1 text-center">
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'DISCARD_PAINT' })}
                    className="rounded-md border border-red-300 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    Discard paint &amp; clean dish
                  </button>
                </div>
              )}
              {dishHere('balance') && (
                <DraggableItem id="dish" label="Drag porcelain dish" className="absolute"
                  style={{ top: '18%', left: '28%', width: '44%', height: '34%' }}>
                  <div onClick={() => setSelected('dish')} className="h-full w-full" />
                </DraggableItem>
              )}
            </StationCard>
          </DropZone>

          {/* oven */}
          <DropZone id="oven" className="rounded-xl">
            <StationCard title="Electric oven" className="relative"
              led={{ run: sim.oven.power, warm: sim.oven.temp > 60, ok: sim.oven.running }}>
              <ElectricOven
                oven={sim.oven}
                dish={dishHere('oven') ? { ...dishProps } : null}
                onPower={() => dispatch({ type: 'SET_OVEN_POWER', payload: { on: !sim.oven.power } })}
                onSetpoint={(d) => dispatch({ type: 'STEP_OVEN_SETPOINT', payload: { delta: d } })}
                onToggleDoor={() => dispatch({ type: 'TOGGLE_OVEN_DOOR' })}
                onToggleTimer={() => dispatch({ type: 'TOGGLE_OVEN_TIMER' })}
              />
              {dishHere('oven') && (
                <DraggableItem id="dish" label="Drag porcelain dish from oven" className="absolute"
                  style={{ top: '36%', left: '38%', width: '34%', height: '32%' }}>
                  <div onClick={() => setSelected('dish')} className="h-full w-full" />
                </DraggableItem>
              )}
            </StationCard>
          </DropZone>

          {/* desiccator */}
          <DropZone id="desiccator" className="rounded-xl">
            <StationCard title="Desiccator" className="relative"
              led={{ run: !sim.desiccator.lidOpen, ok: sim.dish.location === 'desiccator' && sim.dish.temp <= 32, warm: sim.dish.temp > 32 }}>
              <Desiccator
                lidOpen={sim.desiccator.lidOpen}
                dish={dishHere('desiccator') ? { ...dishProps } : null}
                onToggleLid={() => dispatch({ type: 'TOGGLE_DESICCATOR' })}
              />
              {dishHere('desiccator') && (
                <DraggableItem id="dish" label="Drag porcelain dish from desiccator" className="absolute"
                  style={{ top: '34%', left: '30%', width: '40%', height: '30%' }}>
                  <div onClick={() => setSelected('dish')} className="h-full w-full" />
                </DraggableItem>
              )}
            </StationCard>
          </DropZone>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {active === 'dish' && dishNode}
        {active === 'paint-tin' && <PaintTin size={0.8} />}
      </DragOverlay>
    </DndContext>
  )
}