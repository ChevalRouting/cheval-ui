import { Suspense, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Moon, MoreHorizontal, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/useTheme'
import { SectionLabel } from '@/components/SectionLabel'
import { Spinner } from '@/components/Spinner'
import { MobileNav, type MobileTab } from '@/components/ui/mobile-nav'

export interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}

export interface NavGroup {
  label?: string
  key?: string
  icon?: React.ComponentType<{ className?: string }>
  items: NavItem[]
}

const MAX_MOBILE_TABS = 5

function buildMobileTabs(nav: NavGroup[], extras: React.ReactNode): MobileTab[] {
  if (nav.length > 1) {
    const tabs = nav.map((group, gi): MobileTab => {
      const direct = group.items.length === 1 && !group.label
      const icon = group.icon ?? group.items[0]?.icon ?? MoreHorizontal
      if (direct) {
        const item = group.items[0]
        return { key: group.key ?? item.to, label: group.label || item.label, icon, to: item.to, exact: item.exact }
      }
      return { key: group.key ?? group.label ?? `group-${gi}`, label: group.label ?? 'Menu', icon, items: group.items }
    })
    if (extras) tabs.push({ key: '__more__', label: 'More', icon: MoreHorizontal, sheet: extras })
    return tabs
  }

  const items = nav[0]?.items ?? []
  const primary = items.slice(0, MAX_MOBILE_TABS - 1)
  const overflow = items.slice(MAX_MOBILE_TABS - 1)
  const tabs: MobileTab[] = primary.map((item) => ({
    key: item.to,
    label: item.label,
    icon: item.icon,
    to: item.to,
    exact: item.exact,
  }))
  tabs.push({ key: '__more__', label: 'More', icon: MoreHorizontal, items: overflow, sheet: extras })
  return tabs
}

interface ShellSlotState {
  collapsed: boolean
  closeMobile: () => void
}

type ShellSlot = React.ReactNode | ((state: ShellSlotState) => React.ReactNode)

interface AppShellProps {
  nav: NavGroup[]
  title?: string
  logo?: React.ComponentType<{ className?: string }>
  brand?: React.ReactNode
  banners?: React.ReactNode
  sidebarTop?: ShellSlot
  sidebarFooter?: ShellSlot
  mobileNavigation?: React.ReactNode
  mobileOverlay?: React.ReactNode
  showMobileHeader?: boolean
  showThemeToggle?: boolean
  collapsedStorageKey?: string
  contentClassName?: string
  children?: React.ReactNode
}

function renderSlot(slot: ShellSlot | undefined, state: ShellSlotState) {
  return typeof slot === 'function' ? slot(state) : slot
}

function NavItems({ groups, collapsed, onNavigate }: { groups: NavGroup[]; collapsed: boolean; onNavigate?: () => void }) {
  return (
    <nav className={cn('space-y-4', collapsed ? 'px-1' : 'px-2')}>
      {groups.map((group, gi) => (
        <div key={group.label || `group-${gi}`}>
          {group.label && !collapsed && (
            <div className="px-2 mb-1.5">
              <SectionLabel className="text-sidebar-foreground/35">{group.label}</SectionLabel>
            </div>
          )}
          {group.label && collapsed && (
            <div className="border-t border-sidebar-border/30 mx-1.5 mb-1" />
          )}

          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-[13px] font-medium transition-colors w-full',
                    collapsed ? 'justify-center py-2 h-9' : 'gap-2.5 px-2.5 py-1.5',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                  )
                }
              >
                <item.icon className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    <ChevronRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-30 transition-opacity" />
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { theme, toggle } = useTheme()
  const icon = theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />
  const label = theme === 'dark' ? 'Light mode' : 'Dark mode'

  return (
    <button
      onClick={toggle}
      title={label}
      aria-label={label}
      className={cn(
        'flex items-center rounded-md text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full',
        collapsed ? 'justify-center h-8' : 'gap-2.5 px-3 py-1.5 text-sm font-medium',
      )}
    >
      {icon}
      {!collapsed && label}
    </button>
  )
}

function Brand({ title, brand, logo, collapsed }: { title: string; brand?: React.ReactNode; logo?: React.ComponentType<{ className?: string }>; collapsed: boolean }) {
  if (brand) return <>{brand}</>

  const Logo = logo

  return (
    <>
      {Logo && <Logo className="h-7 w-7 shrink-0" />}
      {!collapsed && (
        <span className="text-[15px] font-semibold tracking-tight text-sidebar-foreground truncate">{title}</span>
      )}
    </>
  )
}

export function AppShell({
  nav,
  title = 'App',
  logo,
  brand,
  banners,
  sidebarTop,
  sidebarFooter,
  mobileNavigation,
  mobileOverlay,
  showMobileHeader = true,
  showThemeToggle = true,
  collapsedStorageKey = 'sidebar-collapsed',
  contentClassName,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(collapsedStorageKey) === 'true')
  const closeMobile = () => {}

  const toggleCollapse = () => {
    setCollapsed((c) => {
      localStorage.setItem(collapsedStorageKey, String(!c))
      return !c
    })
  }

  const mobileExtras = (
    <div className="mt-2 pt-2 border-t border-border/50 space-y-0.5">
      {sidebarTop && <div className="pb-1">{renderSlot(sidebarTop, { collapsed: false, closeMobile })}</div>}
      {renderSlot(sidebarFooter, { collapsed: false, closeMobile })}
      {showThemeToggle && <ThemeToggle collapsed={false} />}
    </div>
  )

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside
        className={cn(
          'hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0',
          'transition-[width] duration-200 ease-in-out overflow-hidden',
          collapsed ? 'w-14' : 'w-56',
        )}
      >
        <div className={cn('flex items-center border-b border-sidebar-border shrink-0 h-12', collapsed ? 'justify-center' : 'px-3 gap-2.5')}>
          <Brand title={title} brand={brand} logo={logo} collapsed={collapsed} />
        </div>

        {sidebarTop && (
          <div className={cn('border-b border-sidebar-border py-2', collapsed ? 'px-1' : 'px-2')}>
            {renderSlot(sidebarTop, { collapsed, closeMobile })}
          </div>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          <NavItems groups={nav} collapsed={collapsed} />
        </div>

        <div className={cn('border-t border-sidebar-border space-y-0.5', collapsed ? 'p-1' : 'p-2')}>
          <button
            onClick={toggleCollapse}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex items-center rounded-md transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
              collapsed ? 'justify-center h-8' : 'gap-2.5 px-3 py-1.5 text-xs font-medium',
            )}
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <><ChevronLeft className="h-3.5 w-3.5" /><span>Collapse</span></>}
          </button>
          {renderSlot(sidebarFooter, { collapsed, closeMobile })}
          {showThemeToggle && <ThemeToggle collapsed={collapsed} />}
        </div>
      </aside>

      <div className="min-w-0 flex-1 flex flex-col overflow-hidden bg-background">
        {showMobileHeader && <div className="md:hidden flex items-center gap-2 h-12 px-3 border-b border-border bg-sidebar text-sidebar-foreground shrink-0">
          <Brand title={title} brand={brand} logo={logo} collapsed={false} />
        </div>}

        {banners}

        <main className="flex-1 overflow-auto">
          <div className={cn('p-4 md:p-6', contentClassName)}>
            <Suspense fallback={<Spinner />}>
              {children ?? <Outlet />}
            </Suspense>
          </div>
        </main>
        {mobileNavigation ?? <MobileNav tabs={buildMobileTabs(nav, mobileExtras)} />}
      </div>

      {mobileOverlay}
    </div>
  )
}
