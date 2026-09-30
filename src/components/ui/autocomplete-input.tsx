import { type InputHTMLAttributes, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface AutocompleteOption {
  value: string
  label: string
  description?: string
  meta?: string
  keywords?: string[]
}

export interface AutocompleteInputProps {
  value: string
  options: AutocompleteOption[]
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  maxOptions?: number
  className?: string
  popupMinWidth?: number
  filterOptions?: boolean
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'disabled' | 'className'>
}

interface PopupPosition {
  container: HTMLElement
  position: 'fixed' | 'absolute'
  transform?: string
  top: number
  left: number
  width: number
  maxHeight: number
}

export function AutocompleteInput({
  value,
  options,
  onChange,
  placeholder,
  emptyMessage = 'No options match. You can enter a value manually.',
  disabled,
  maxOptions = 12,
  className,
  popupMinWidth = 320,
  filterOptions = true,
  inputProps,
}: AutocompleteInputProps) {
  const listId = useId()
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [popup, setPopup] = useState<PopupPosition | null>(null)
  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase()
    return options.filter((option) => {
      if (!filterOptions || !query) return true
      return [option.value, option.label, option.description, option.meta, ...(option.keywords ?? [])]
        .some((part) => part?.toLowerCase().includes(query))
    }).slice(0, maxOptions)
  }, [filterOptions, maxOptions, options, value])

  useEffect(() => setActive(0), [value])
  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, listId, open])

  useEffect(() => {
    if (!open) return
    const position = () => {
      const rect = anchorRef.current?.getBoundingClientRect()
      if (!rect) return
      const width = Math.min(Math.max(rect.width, popupMinWidth), window.innerWidth - 16)
      const spaceBelow = window.innerHeight - rect.bottom - 8
      const spaceAbove = rect.top - 8
      const placeBelow = spaceBelow >= 160 || spaceBelow >= spaceAbove
      const availableHeight = placeBelow ? spaceBelow : spaceAbove
      const dialog = anchorRef.current?.closest<HTMLElement>('[role="dialog"], [role="alertdialog"]')
      const containerRect = dialog?.getBoundingClientRect()
      const offsetTop = containerRect ? containerRect.top + (dialog?.clientTop ?? 0) - (dialog?.scrollTop ?? 0) : 0
      const offsetLeft = containerRect ? containerRect.left + (dialog?.clientLeft ?? 0) - (dialog?.scrollLeft ?? 0) : 0
      setPopup({
        container: dialog ?? document.body,
        position: dialog ? 'absolute' : 'fixed',
        top: (placeBelow ? rect.bottom + 4 : rect.top - 4) - offsetTop,
        transform: placeBelow ? undefined : 'translateY(-100%)',
        left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)) - offsetLeft,
        width,
        maxHeight: Math.max(48, Math.min(288, availableHeight - 4)),
      })
    }
    position()
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    return () => {
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
    }
  }, [open, popupMinWidth])

  const choose = (option: AutocompleteOption) => {
    onChange(option.value)
    setOpen(false)
  }
  const activeId = filtered[active] ? `${listId}-${active}` : undefined

  return (
    <div ref={anchorRef} className="relative w-full">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...inputProps}
        role="combobox"
        aria-controls={open ? listId : undefined}
        aria-expanded={open && !disabled}
        aria-autocomplete="list"
        aria-activedescendant={open ? activeId : undefined}
        value={value}
        disabled={disabled}
        className={cn('pl-8', className)}
        placeholder={placeholder}
        onFocus={event => { inputProps?.onFocus?.(event); setOpen(true) }}
        onBlur={event => { inputProps?.onBlur?.(event); setOpen(false) }}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
        }}
        onKeyDown={(event) => {
          inputProps?.onKeyDown?.(event)
          if (event.defaultPrevented) return
          if (event.key === 'ArrowDown' && filtered.length > 0) {
            event.preventDefault()
            setOpen(true)
            setActive((current) => open ? (current + 1) % filtered.length : 0)
          } else if (event.key === 'ArrowUp' && filtered.length > 0) {
            event.preventDefault()
            setOpen(true)
            setActive((current) => open ? (current - 1 + filtered.length) % filtered.length : filtered.length - 1)
          } else if (event.key === 'Enter' && open && filtered[active]) {
            event.preventDefault()
            choose(filtered[active])
          } else if (event.key === 'Escape' && open) {
            event.preventDefault()
            event.stopPropagation()
            setOpen(false)
          }
        }}
      />
      {open && !disabled && popup && createPortal(
        <div
          id={listId}
          role="listbox"
          className="fixed z-[100] overflow-y-auto overscroll-contain rounded-md bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-black/10 dark:ring-white/10"
          style={{ position: popup.position, top: popup.top, transform: popup.transform, left: popup.left, width: popup.width, maxHeight: popup.maxHeight }}
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">{emptyMessage}</div>
          ) : filtered.map((option, index) => (
            <button
              id={`${listId}-${index}`}
              key={option.value}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={option.value === value}
              className={cn(
                'flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm',
                index === active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60',
              )}
              onPointerDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(option)}
            >
              <Check className={cn('h-3.5 w-3.5 shrink-0', option.value === value ? 'opacity-100' : 'opacity-0')} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{option.label}</span>
                {option.description && <span className="block truncate text-xs text-muted-foreground">{option.description}</span>}
              </span>
              {option.meta && <span className="shrink-0 text-[10px] text-muted-foreground">{option.meta}</span>}
            </button>
          ))}
        </div>,
        popup.container,
      )}
    </div>
  )
}
