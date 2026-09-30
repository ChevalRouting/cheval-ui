import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/layouts/AppShell'

export interface MobileTab {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  to?: string
  exact?: boolean
  items?: NavItem[]
  sheet?: React.ReactNode
}

function pathMatches(pathname: string, to: string, exact?: boolean) {
  return exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
}

function tabMatches(tab: MobileTab, pathname: string) {
  if (tab.to && pathMatches(pathname, tab.to, tab.exact)) return true
  return (tab.items ?? []).some((item) => pathMatches(pathname, item.to, item.exact))
}

export function MobileSubNav({ items, className }: { items: NavItem[]; className?: string }) {
  const { pathname } = useLocation()
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const active = scroller.current?.querySelector<HTMLElement>('[aria-current="page"]')
    active?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [pathname])

  return (
    <div
      ref={scroller}
      className={cn('flex items-center gap-1.5 overflow-x-auto scrollbar-none px-3 py-2', className)}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'bg-sidebar-accent/60 text-sidebar-foreground/70 hover:text-sidebar-foreground',
            )
          }
        >
          <item.icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}

function MoreSheet({ tab, onClose }: { tab: MobileTab; onClose: () => void }) {
  return (
    <Dialog.Root open onOpenChange={(o) => { if (!o) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 md:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-background rounded-t-2xl shadow-2xl max-h-[75vh] md:hidden focus:outline-none"
          onEscapeKeyDown={onClose}
          onInteractOutside={onClose}
        >
          <div className="flex justify-center pt-2.5 pb-1 shrink-0">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/25" />
          </div>

          <div className="flex items-center justify-between px-5 py-3 shrink-0">
            <Dialog.Title className="text-base font-semibold">{tab.label}</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close" className="-mr-1 flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto py-2 px-3 pb-4 safe-bottom">
            <div className="space-y-0.5">
              {(tab.items ?? []).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:bg-muted/60 hover:text-foreground',
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0 opacity-60" />
                  {item.label}
                </NavLink>
              ))}
            </div>
            {tab.sheet}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface MobileNavProps {
  tabs: MobileTab[]
  activeKey?: string
  className?: string
}

export function MobileNav({ tabs, activeKey, className }: MobileNavProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [sheetKey, setSheetKey] = useState<string | null>(null)

  useEffect(() => setSheetKey(null), [pathname])

  const activeTab = activeKey
    ? tabs.find((tab) => tab.key === activeKey)
    : tabs.find((tab) => tabMatches(tab, pathname))
  const sheetTab = sheetKey ? tabs.find((tab) => tab.key === sheetKey) : undefined

  const handleTap = (tab: MobileTab) => {
    if (tab.to) { navigate(tab.to); return }
    if (tab.sheet) { setSheetKey(tab.key); return }
    if (tab.items?.length && tab.key !== activeTab?.key) navigate(tab.items[0].to)
  }

  return (
    <nav className={cn('md:hidden shrink-0 safe-bottom bg-sidebar border-t border-sidebar-border', className)}>
      {activeTab?.items && activeTab.items.length > 0 && (
        <div className="border-b border-sidebar-border/60">
          <MobileSubNav items={activeTab.items} />
        </div>
      )}

      <div className="h-14 flex items-stretch">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab?.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTap(tab)}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
                isActive
                  ? 'text-sidebar-primary'
                  : 'text-sidebar-foreground/45 hover:text-sidebar-foreground',
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 inset-x-1/4 h-0.5 rounded-t-full bg-sidebar-primary" />
              )}
            </button>
          )
        })}
      </div>

      {sheetTab && <MoreSheet tab={sheetTab} onClose={() => setSheetKey(null)} />}
    </nav>
  )
}
