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
    <div className="flex h-[84px] w-[110px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/60 px-2 text-center">
      <span className="text-[11px] leading-tight text-slate-400">{text}</span>
    </div>
  )
}

export default function Shelf({ selected, onSelect }) {
  const apparatusList = useLab((s) => s.apparatusList)
  const sim = useLab((s) => s.sim)

  return (
    <DropZone id="shelf" className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-200 p-3">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Shelf &mdash; items for this experiment</div>
      <div className="flex flex-wrap items-stretch gap-3">
        {apparatusList.map((item) => {
          const movable = MOVABLE[item.id]
          if (!movable) {
            return (
              <div key={item.id} className="flex h-[84px] w-[110px] flex-col items-center justify-center rounded-lg border border-slate-300 bg-white/70 px-2 text-center">
                <span className="text-[11px] font-medium leading-tight text-slate-600">{item.name}</span>
                <span className="mt-1 text-[9px] text-slate-400">equipment · on bench</span>
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
              <span className="mt-1 text-[10px] font-medium text-slate-500">{item.name}</span>
            </div>
          )
        })}
      </div>
    </DropZone>
  )
}
