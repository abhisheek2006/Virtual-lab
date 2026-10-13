import { useState } from 'react'
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
// Owns the drag-and-drop context and lays out the shelf + working stations.

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

function StationCard({ title, children, className = '' }) {
  return (
    <div className={'rounded-xl border border-slate-200 bg-white p-3 shadow-sm ' + className}>
      <div className="mb-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">{title}</div>
      {children}
    </div>
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
  const dishProps = { paintMass: sim.dish.paintMass, color: sim.dish.color, matte: sim.dish.matte, temp: sim.dish.temp }
  const dishNode = <div className="w-[110px]"><PorcelainDish paintMass={sim.dish.paintMass} color={sim.dish.color} matte={sim.dish.matte} /></div>

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
            <StationCard title="Work bench" className="min-h-[200px]">
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
            <StationCard title="Weighing balance" className="relative">
              <WeighingBalance
                balance={sim.balance}
                dish={dishHere('balance') ? { ...dishProps, temp: sim.dish.temp } : null}
                onToggle={() => dispatch({ type: 'TOGGLE_BALANCE' })}
                onFieldChange={(field) => dispatch({ type: 'SET_BALANCE_FIELD', payload: { field } })}
                onRecord={() => dispatch({ type: 'RECORD_BALANCE' })}
              />
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
            <StationCard title="Electric oven" className="relative">
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
            <StationCard title="Desiccator" className="relative">
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
