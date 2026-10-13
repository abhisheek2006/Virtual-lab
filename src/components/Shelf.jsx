import { useLab } from '../engine/store'
import { DraggableItem, DropZone } from './DragBits'
import PorcelainDish from './apparatus/PorcelainDish'
import PaintTin from './apparatus/PaintTin'

// Shelf.jsx
// The top shelf. Shows every item used by this experiment. Movable items
// (dish, paint tin) can be dragged to the bench; fixed equipment is labelled.

const MOVABLE = {
  'porcelain-dish': { itemId: 'dish', loc: (s) => s.dish.location },
  'oil-paint': { itemId: 'paint-tin', loc: (s) => s.paintTin.location },
}

const LOC_LABEL = {
  shelf: 'on shelf',
  bench: 'on bench',
  balance: 'on balance',
  oven: 'in oven',
  desiccator: 'in desiccator',
}

function EmptySlot({ text }) {
  return (
    <div className="flex h-[84px] w-[110px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-amber-200/50 bg-amber-950/40 px-2 text-center shadow-inner">
      <span className="text-[11px] leading-tight text-amber-100/80">{text}</span>
    </div>
  )
}

export default function Shelf({ selected, onSelect }) {
  const apparatusList = useLab((s) => s.apparatusList)
  const sim = useLab((s) => s.sim)

  return (
    <DropZone id="shelf"
      className="relative rounded-lg border border-amber-900/70 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 px-4 pb-5 pt-3 shadow-[0_14px_20px_-10px_rgba(120,53,15,0.55)]">
      {/* shelf edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-lg bg-gradient-to-b from-amber-300/80 to-transparent" />
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-200">
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 20h16M6 20V8h4v12M10 20H6M14 20V4h4v16M14 20h4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        Shelf &mdash; items for this experiment
      </div>
      <div className="flex flex-wrap items-stretch gap-3">
        {apparatusList.map((item) => {
          const movable = MOVABLE[item.id]
          if (!movable) {
            return (
              <div key={item.id} className="flex h-[84px] w-[110px] flex-col items-center justify-center rounded-lg border border-amber-200/40 bg-amber-950/30 px-2 text-center shadow-inner">
                <span className="text-[11px] font-medium leading-tight text-amber-100">{item.name}</span>
                <span className="mt-1 text-[9px] text-amber-200/60">equipment · on bench</span>
              </div>
            )
          }
          const here = sim && movable.loc(sim) === 'shelf'
          const ring = selected === movable.itemId ? 'ring-4 ring-blue-400 ' : ''
          return (
            <div key={item.id} className="flex flex-col items-center">
              {here ? (
                <DraggableItem id={movable.itemId} label={`Drag ${item.name}`} className={ring}>
                  <div onClick={() => onSelect(movable.itemId)} className="flex h-[84px] w-[110px] items-end justify-center pb-1">
                    {item.id === 'porcelain-dish' ? (
                      <div className="w-[90px]"><PorcelainDish /></div>
                    ) : (
                      <PaintTin size={0.7} />
                    )}
                  </div>
                </DraggableItem>
              ) : (
                <EmptySlot text={`${item.name} — ${LOC_LABEL[movable.loc(sim)]}`} />
              )}
              <span className="mt-1 text-[10px] font-medium text-amber-100">{item.name}</span>
            </div>
          )
        })}
      </div>
    </DropZone>
  )
}
