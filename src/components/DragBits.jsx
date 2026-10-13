import { useDraggable, useDroppable } from '@dnd-kit/core'

// DragBits.jsx
// Two tiny wrappers around @dnd-kit. Keeping them here means Shelf and Bench
// do not need to know anything about the drag library.

export function DraggableItem({ id, label, disabled = false, className = '', style, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, disabled })
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      role="button"
      aria-label={label}
      tabIndex={0}
      style={style}
      className={
        'touch-none select-none ' +
        (disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing ') +
        (isDragging ? 'opacity-30 ' : '') +
        'rounded focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ' +
        className
      }
    >
      {children}
    </div>
  )
}

export function DropZone({ id, className = '', style, children }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className + ' transition ' + (isOver ? ' ring-4 ring-emerald-400/80 bg-emerald-50/40 ' : '')}
    >
      {children}
    </div>
  )
}
