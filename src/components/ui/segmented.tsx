import { cn } from '@/lib/utils'

interface SegmentedProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string; activeClass?: string }[]
  className?: string
}

export function Segmented<T extends string>({ value, onChange, options, className }: SegmentedProps<T>) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + options.length) % options.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % options.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = options.length - 1

    onChange(options[nextIndex].value)
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]
      ?.focus()
  }

  return (
    <div role="radiogroup" className={cn('inline-flex h-8 overflow-hidden rounded-md border border-input text-sm', className)}>
      {options.map((o, i) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          tabIndex={value === o.value ? 0 : -1}
          onClick={() => onChange(o.value)}
          onKeyDown={(event) => handleKeyDown(event, i)}
          className={cn(
            'flex items-center px-3 transition-colors',
            i > 0 && 'border-l border-input',
            value === o.value ? (o.activeClass ?? 'bg-primary text-primary-foreground') : 'hover:bg-muted',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
