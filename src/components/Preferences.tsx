import * as React from 'react'
import { ChevronRight, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'

export function PreferencesGroup({
  title,
  description,
  header,
  children,
  className,
}: {
  title?: string
  description?: string
  header?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-2', className)}>
      {(title || description || header) && (
        <div className="flex items-end justify-between gap-3 px-1">
          <div className="min-w-0 flex-1">
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {header && <div className="shrink-0">{header}</div>}
        </div>
      )}
      <div className="overflow-hidden rounded-xl bg-card [box-shadow:var(--card-shadow)] divide-y divide-border">
        {children}
      </div>
    </section>
  )
}

export function PreferencesGroups({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('[column-gap:1.5rem] lg:columns-2 [&>*]:mb-6 [&>*]:break-inside-avoid', className)}>
      {children}
    </div>
  )
}

export function PreferencesColumns({
  title,
  description,
  header,
  children,
  className,
}: {
  title?: string
  description?: string
  header?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className="space-y-2">
      {(title || description || header) && (
        <div className="flex items-end justify-between gap-3 px-1">
          <div className="min-w-0 flex-1">
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {header && <div className="shrink-0">{header}</div>}
        </div>
      )}
      <div
        className={cn(
          'grid gap-3 grid-cols-1 lg:grid-cols-2 items-start [&>*]:overflow-hidden [&>*]:rounded-xl [&>*]:bg-card [&>*]:[box-shadow:var(--card-shadow)]',
          className,
        )}
      >
        {children}
      </div>
    </section>
  )
}

interface RowProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  prefix?: React.ReactNode
  children?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function Row({ title, subtitle, prefix, children, onClick, className }: RowProps) {
  const body = (
    <>
      {prefix && <span className="shrink-0 text-muted-foreground">{prefix}</span>}
      <div className="w-full min-w-0 flex-1 sm:w-auto">
        {title != null && <div className="text-sm font-medium text-foreground break-words">{title}</div>}
        {subtitle != null && <div className="mt-0.5 text-xs text-muted-foreground break-words">{subtitle}</div>}
      </div>
      {children != null && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 max-sm:w-full">{children}</div>
      )}
    </>
  )
  const base = cn('flex min-h-[3.25rem] w-full gap-x-3 gap-y-1.5 px-4 py-2.5', className)
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(base, 'w-full items-center text-left transition-colors hover:bg-accent/50')}
      >
        {body}
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
    )
  }
  return <div className={cn(base, 'flex-col items-start sm:flex-row sm:items-center')}>{body}</div>
}

export function ComboRow({ title, subtitle, children }: { title: React.ReactNode; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-1 items-center gap-3 px-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
      <div className="min-w-0">
        <div className="break-words text-sm font-medium">{title}</div>
        {subtitle != null && <div className="mt-0.5 break-words text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      <div className="min-w-0 w-full">{children}</div>
    </div>
  )
}

export interface EntryRowProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string
  suffix?: React.ReactNode
  error?: string | null
  help?: React.ReactNode
}

export const EntryRow = React.forwardRef<HTMLInputElement, EntryRowProps>(({ title, suffix, error, help, className, ...props }, ref) => {
  const generatedId = React.useId()
  const id = props.id || generatedId
  const [visible, setVisible] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const setInputRef = React.useCallback((input: HTMLInputElement | null) => {
    inputRef.current = input
    if (typeof ref === 'function') ref(input)
    else if (ref) ref.current = input
  }, [ref])
  React.useEffect(() => { inputRef.current?.setCustomValidity(error || '') }, [error])
  return (
    <div className="grid min-w-0 grid-cols-1 gap-x-3 gap-y-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] rounded-lg px-4 py-2 focus-within:bg-accent/40 focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring">
      <label htmlFor={id} className={cn('block self-center text-sm font-medium leading-4 break-words', error ? 'text-destructive' : 'text-muted-foreground')}>
        {title}
      </label>
      <div className="flex min-h-5 min-w-0 items-center gap-2">
        <input
          ref={setInputRef}
          aria-invalid={error ? true : undefined}
          className={cn(
            'min-w-0 w-full bg-transparent text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground/50',
            className,
          )}
          {...props}
          id={id}
          type={props.type === 'password' && visible ? 'text' : props.type}
          aria-describedby={[props['aria-describedby'], help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}
        />
        {props.type === 'password' && <button type="button" disabled={props.disabled} aria-label={visible ? 'Hide Password' : 'Show Password'} aria-pressed={visible} onClick={() => setVisible(!visible)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-muted-foreground">{visible ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}</button>}
        {suffix && <div className="flex shrink-0 items-center gap-1">{suffix}</div>}
      </div>
      {help && <p id={`${id}-help`} className="sm:col-start-2 text-xs leading-4 text-muted-foreground break-words">{help}</p>}
      {error && <p id={`${id}-error`} className="sm:col-start-2 text-xs leading-4 text-destructive break-words">{error}</p>}
    </div>
  )
})
EntryRow.displayName = 'EntryRow'

export function SwitchRow({
  title,
  subtitle,
  checked,
  onCheckedChange,
  disabled,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}) {
  const titleId = React.useId()

  return (
    <div
      onClick={(event) => {
        if (disabled || (event.target as HTMLElement).closest('[role="switch"]')) return
        onCheckedChange(!checked)
      }}
      className={cn(
        'grid min-h-[3.25rem] w-full grid-cols-1 items-center gap-3 px-4 py-2.5 text-left transition-colors sm:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]',
        disabled ? 'opacity-50' : 'cursor-pointer hover:bg-accent/50',
      )}
    >
      <div className="min-w-0 flex-1">
        <div id={titleId} className="text-sm font-medium text-foreground break-words">{title}</div>
        {subtitle != null && <div id={`${titleId}-help`} className="mt-0.5 text-xs text-muted-foreground break-words">{subtitle}</div>}
      </div>
      <Switch
        className="justify-self-start"
        aria-label={typeof title === 'string' ? title : undefined}
        aria-labelledby={titleId}
        aria-describedby={subtitle != null ? `${titleId}-help` : undefined}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  )
}
