import { cn } from '@/lib/utils'

interface TabItem<T extends string> {
  key: T
  label: string
  badge?: string | number
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[]
  active: T
  onChange: (key: T) => void
  variant?: 'underline' | 'pills'
  className?: string
  id?: string
  label?: string
}

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  variant = 'underline',
  className,
  id,
  label,
}: TabsProps<T>) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1

    onChange(tabs[nextIndex].key)
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]
      ?.focus()
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  if (variant === 'pills') {
    return (
      <div role="tablist" aria-label={label} className={cn('flex gap-0.5 bg-muted rounded-md p-0.5 overflow-x-auto', className)}>
        {tabs.map((t, index) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={id ? `${id}-tab-${t.key}` : undefined}
            aria-controls={id ? `${id}-panel-${t.key}` : undefined}
            aria-selected={active === t.key}
            tabIndex={active === t.key ? 0 : -1}
            onClick={() => onChange(t.key)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded text-xs font-medium transition-colors',
              active === t.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
            {t.badge != null && (
              <span className={cn(
                'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none min-w-[1.125rem]',
                active === t.key ? 'bg-muted text-muted-foreground' : 'bg-muted-foreground/20 text-muted-foreground',
              )}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div role="tablist" aria-label={label} className={cn('flex gap-1 border-b border-border overflow-x-auto', className)}>
      {tabs.map((t, index) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          id={id ? `${id}-tab-${t.key}` : undefined}
          aria-controls={id ? `${id}-panel-${t.key}` : undefined}
          aria-selected={active === t.key}
          tabIndex={active === t.key ? 0 : -1}
          onClick={() => onChange(t.key)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors shrink-0',
            active === t.key
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          )}
        >
          {t.label}
          {t.badge != null && (
            <span className={cn(
              'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none min-w-[1.125rem]',
              active === t.key ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
            )}>
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
