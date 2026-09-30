import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ConfirmationBarProps {
  title: ReactNode
  description?: ReactNode
  remainingSeconds?: number
  actionLabel?: string
  pending?: boolean
  disabled?: boolean
  icon?: ReactNode
  onConfirm: () => void
  className?: string
}

export function ConfirmationBar({
  title,
  description,
  remainingSeconds,
  actionLabel = 'Confirm',
  pending,
  disabled,
  icon = <AlertTriangle className="h-4 w-4" />,
  onConfirm,
  className,
}: ConfirmationBarProps) {
  return (
    <div role="alert" className={cn('flex flex-wrap items-center gap-3 rounded-md bg-warning/10 px-4 py-2.5 text-sm', className)}>
      <span className="shrink-0 text-warning">{icon}</span>
      <span className="font-medium text-warning">{title}</span>
      {description && <span className="min-w-[12rem] flex-1 text-muted-foreground">{description}</span>}
      <div className="ml-auto flex items-center gap-3">
        {remainingSeconds !== undefined && (
          <span className="font-mono font-semibold tabular-nums" aria-label={`${remainingSeconds} seconds remaining`}>
            {remainingSeconds}s
          </span>
        )}
        <Button size="sm" onClick={onConfirm} disabled={disabled || pending}>
          {pending ? 'Confirming…' : actionLabel}
        </Button>
      </div>
    </div>
  )
}
