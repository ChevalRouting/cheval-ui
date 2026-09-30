import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NoticeIntent = 'info' | 'warning' | 'danger' | 'success'

const intentClasses: Record<NoticeIntent, string> = {
  info: 'bg-info/15 text-info',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  success: 'bg-success/15 text-success',
}

export interface NoticeBannerProps {
  children: ReactNode
  intent?: NoticeIntent
  icon?: ReactNode
  onDismiss?: () => void
  dismissLabel?: string
  className?: string
}

export function NoticeBanner({
  children,
  intent = 'info',
  icon,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
}: NoticeBannerProps) {
  return (
    <div role={intent === 'danger' ? 'alert' : 'status'} className={cn('flex items-center gap-3 px-4 py-2 text-sm', intentClasses[intent], className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      <div className="min-w-0 flex-1 break-words">{children}</div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="flex h-8 w-8 shrink-0 items-center justify-center rounded opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={dismissLabel}>
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
