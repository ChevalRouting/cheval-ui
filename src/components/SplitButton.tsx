import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Plus, type LucideIcon } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'

export interface SplitAction {
  label: string
  icon?: LucideIcon
  onClick: () => void
  disabled?: boolean
}

export interface SplitButtonProps {
  label: string
  onClick: () => void
  icon?: LucideIcon
  actions?: SplitAction[]
  disabled?: boolean
  busy?: boolean
  variant?: ButtonProps['variant']
  menuLabel?: string
}

export function SplitButton({ label, onClick, icon: Icon = Plus, actions = [], disabled, busy,
  variant = 'suggested', menuLabel = 'More actions' }: SplitButtonProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, maxHeight: 240 })
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const initial = useRef<'first' | 'last'>('first')
  const id = useId()
  const shown = open && !disabled && !busy && actions.length > 0

  function openMenu(edge: 'first' | 'last' = 'first') {
    initial.current = edge
    setContainer(trigger.current?.closest<HTMLElement>('[role="dialog"], [role="alertdialog"]') ?? document.body)
    setOpen(true)
  }

  function close(restoreFocus = true) {
    setOpen(false)
    if (restoreFocus) trigger.current?.focus()
  }

  useEffect(() => {
    if (!shown) return
    const items = menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')
    if (items?.length) items[initial.current === 'last' ? items.length - 1 : 0].focus()
    else menu.current?.focus()

    function positionMenu() {
      const rect = trigger.current?.getBoundingClientRect()
      if (!rect) return
      const below = window.innerHeight - rect.bottom - 12
      const above = rect.top - 12
      const height = Math.min(240, Math.max(48, Math.max(below, above)))
      const dialog = container && container !== document.body ? container : null
      const bounds = dialog?.getBoundingClientRect()
      const offsetTop = bounds ? bounds.top + (dialog?.clientTop ?? 0) - (dialog?.scrollTop ?? 0) : 0
      const offsetLeft = bounds ? bounds.left + (dialog?.clientLeft ?? 0) - (dialog?.scrollLeft ?? 0) : 0
      setPosition({
        top: (below >= Math.min(height, menu.current?.scrollHeight ?? height)
          ? rect.bottom + 4 : Math.max(8, rect.top - Math.min(height, menu.current?.scrollHeight ?? height) - 4)) - offsetTop,
        left: Math.max(8, Math.min(rect.right - 208, window.innerWidth - 216)) - offsetLeft,
        maxHeight: height,
      })
    }

    function dismiss(event: PointerEvent) {
      if (!menu.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false)
    }

    function focusOutside(event: FocusEvent) {
      if (!menu.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false)
    }

    positionMenu()
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('focusin', focusOutside)
    window.addEventListener('resize', positionMenu)
    window.addEventListener('scroll', positionMenu, true)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('focusin', focusOutside)
      window.removeEventListener('resize', positionMenu)
      window.removeEventListener('scroll', positionMenu, true)
    }
  }, [shown, container])

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      close()
      return
    }
    if (event.key === 'Tab') {
      trigger.current?.focus()
      setOpen(false)
      return
    }
    if (!items.length) return
    let next = index
    if (event.key === 'ArrowDown') next = (index + 1) % items.length
    else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      next = items.findIndex((item, i) => i > index && item.textContent?.trim().toLowerCase().startsWith(event.key.toLowerCase()))
      if (next < 0) next = items.findIndex(item => item.textContent?.trim().toLowerCase().startsWith(event.key.toLowerCase()))
    } else return
    if (next >= 0) {
      event.preventDefault()
      items[next].focus()
    }
  }

  return (
    <div className="inline-flex">
      <Button type="button" variant={variant} disabled={disabled || busy} aria-busy={busy || undefined}
        onClick={onClick} className={actions.length ? 'gap-2 rounded-r-none' : 'gap-2'}>
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />{label}
      </Button>
      {actions.length > 0 && <Button ref={trigger} type="button" variant={variant} disabled={disabled || busy}
        aria-label={menuLabel} title={menuLabel} aria-haspopup="menu" aria-expanded={shown} aria-controls={shown ? id : undefined}
        onClick={() => { if (open) close(); else openMenu() }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            openMenu(event.key === 'ArrowUp' ? 'last' : 'first')
          }
        }} className="rounded-l-none border-l border-current/20 px-2">
        <ChevronDown aria-hidden="true" className="h-4 w-4" />
      </Button>}
      {shown && container && createPortal(
        <div ref={menu} id={id} role="menu" aria-label={menuLabel} tabIndex={-1} onKeyDown={navigate}
          style={{ ...position, position: container === document.body ? 'fixed' : 'absolute' }} className="fixed z-[100] w-52 max-w-[calc(100vw-1rem)] overflow-auto rounded-md bg-popover p-1 text-popover-foreground shadow-lg">
          {actions.map((action, index) => {
            const ActionIcon = action.icon
            return <button key={`${action.label}-${index}`} type="button" role="menuitem" tabIndex={-1}
              disabled={action.disabled} onClick={() => { close(); action.onClick() }}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none disabled:opacity-50">
              {ActionIcon && <ActionIcon aria-hidden="true" className="h-4 w-4 shrink-0" />}{action.label}
            </button>
          })}
        </div>, container,
      )}
    </div>
  )
}
