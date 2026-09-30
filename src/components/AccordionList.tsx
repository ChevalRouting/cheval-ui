import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'

export interface AccordionListProps<T> {
  items: T[]
  getId?: (item: T, index: number) => string
  renderSummary: (item: T) => React.ReactNode
  renderBody: (item: T) => React.ReactNode
  renderActions?: (item: T) => React.ReactNode
  onAdd?: () => void
  onRemove?: (item: T) => void
  addLabel?: string
  description?: React.ReactNode
  emptyTitle?: string
  emptyMessage?: string
}

export function AccordionList<T>({
  items, getId, renderSummary, renderBody, renderActions, onAdd, onRemove,
  addLabel = 'Add', description, emptyTitle = 'Nothing here yet', emptyMessage = '',
}: AccordionListProps<T>) {
  const idOf = (item: T, index: number) => (getId ? getId(item, index) : String(index))
  const idList = items.map(idOf)
  const [open, setOpen] = useState<Set<string>>(() => new Set(idList.slice(0, 1)))
  const known = useRef<Set<string>>(new Set(idList))
  const initialized = useRef(idList.length > 0)

  useEffect(() => {
    const ids = items.map(idOf)
    const idSet = new Set(ids)
    if (!initialized.current) {
      if (ids.length > 0) { initialized.current = true; setOpen(new Set(ids.slice(0, 1))) }
      known.current = idSet
      return
    }
    setOpen((previous) => {
      let changed = false
      const next = new Set<string>()
      previous.forEach((id) => { if (idSet.has(id)) next.add(id); else changed = true })
      ids.forEach((id) => { if (!known.current.has(id)) { next.add(id); changed = true } })
      return changed ? next : previous
    })
    known.current = idSet
  }, [items, getId])

  const toggle = (id: string) => setOpen((previous) => {
    const next = new Set(previous)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
  const allOpen = idList.length > 0 && idList.every((id) => open.has(id))

  return (
    <div className="min-w-0 space-y-4">
      {(description || onAdd || items.length > 1) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {description ? <div className="min-w-0 text-sm text-muted-foreground">{description}</div> : <span />}
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
            {items.length > 1 && <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setOpen(allOpen ? new Set() : new Set(idList))}>
              {allOpen ? <ChevronsDownUp className="h-3.5 w-3.5" /> : <ChevronsUpDown className="h-3.5 w-3.5" />}{allOpen ? 'Collapse all' : 'Expand all'}
            </Button>}
            {onAdd && <Button variant="outline" size="sm" className="gap-1.5" onClick={onAdd}><Plus className="h-3.5 w-3.5" />{addLabel}</Button>}
          </div>
        </div>
      )}
      {items.length === 0 ? <EmptyState className="py-10" title={emptyTitle} message={emptyMessage} /> : (
        <div className="space-y-2">{items.map((item, index) => {
          const id = idOf(item, index)
          const isOpen = open.has(id)
          return <section key={id} className="min-w-0 overflow-hidden rounded-xl bg-card [box-shadow:var(--card-shadow)]">
            <div className="flex min-w-0 items-center gap-2 px-3 py-2.5">
              <button type="button" aria-expanded={isOpen} onClick={() => toggle(id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                {isOpen ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
                <div className="min-w-0 flex-1">{renderSummary(item)}</div>
              </button>
              {renderActions?.(item)}
              {onRemove && <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => onRemove(item)}><Trash2 className="h-3.5 w-3.5" /></Button>}
            </div>
            {isOpen && <div className="min-w-0 bg-muted/15 px-3 py-3 shadow-[inset_0_1px_hsl(var(--border)/0.55)]">{renderBody(item)}</div>}
          </section>
        })}</div>
      )}
    </div>
  )
}
