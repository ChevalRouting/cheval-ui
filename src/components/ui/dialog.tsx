import { useRef } from 'react'
import * as RDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  hideClose?: boolean
  captureKeyboard?: boolean
}

export function Dialog({ open, onClose, title, description, children, footer, className, hideClose, captureKeyboard }: DialogProps) {
  const previousFocus = useRef<HTMLElement | null>(null)
  const wasOpen = useRef(false)
  if (open && !wasOpen.current && typeof document !== 'undefined') previousFocus.current = document.activeElement as HTMLElement
  wasOpen.current = open
  return (
    <RDialog.Root open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <RDialog.Portal>
        <RDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <RDialog.Content
          {...(!description ? { 'aria-describedby': undefined } : {})}
          onCloseAutoFocus={event => { event.preventDefault(); previousFocus.current?.focus() }}
          onEscapeKeyDown={event => { if (captureKeyboard && (event.target as HTMLElement).closest('[data-console-input]')) event.preventDefault() }}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-background shadow-2xl focus:outline-none',
            className ?? 'max-w-lg',
          )}
        >
          {(title || description || !hideClose) && (
            <div className="flex items-start gap-3 px-5 py-4 shrink-0">
              <div className="min-w-0 flex-1">
                {title && <RDialog.Title className="text-base font-semibold">{title}</RDialog.Title>}
                {description && <RDialog.Description className="mt-0.5 text-sm text-muted-foreground">{description}</RDialog.Description>}
                {!title && <RDialog.Title className="sr-only">Dialog</RDialog.Title>}
              </div>
              {!hideClose && (
                <RDialog.Close asChild>
                  <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-muted-foreground hover:text-foreground" aria-label="Close">
                    <X className="h-5 w-5" />
                  </button>
                </RDialog.Close>
              )}
            </div>
          )}
          {children != null && <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>}
          {footer && <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 px-5 pb-4 pt-2">{footer}</div>}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  )
}

interface AlertDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  title: React.ReactNode
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  busy?: boolean
}

export function AlertDialog({
  open, onCancel, onConfirm, title, description,
  confirmLabel = 'Continue', cancelLabel = 'Cancel', destructive, busy,
}: AlertDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => { if (!busy) onCancel() }}
      title={title}
      description={description}
      className="max-w-md"
      hideClose
      footer={
        <>
          <Button variant="outline" onClick={onCancel} disabled={busy} autoFocus={destructive}>{cancelLabel}</Button>
          <Button
            variant={destructive ? 'destructive' : 'suggested'}
            onClick={onConfirm}
            disabled={busy}
            autoFocus={!destructive}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  )
}
