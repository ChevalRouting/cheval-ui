import { createContext, createElement, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggle: () => {},
})

function getInitialTheme(storageKey: string, defaultTheme: Theme): Theme {
  const stored = localStorage.getItem(storageKey)
  if (stored === 'light' || stored === 'dark') return stored
  return defaultTheme
}

export function useTheme() {
  return useContext(ThemeContext)
}

export function useThemeState(storageKey = 'cheval-ui-theme', defaultTheme: Theme = 'dark'): ThemeContextValue {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme(storageKey, defaultTheme))

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
    localStorage.setItem(storageKey, theme)
  }, [storageKey, theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggle }
}

export function ThemeProvider({
  children,
  storageKey,
  defaultTheme,
}: {
  children: React.ReactNode
  storageKey?: string
  defaultTheme?: Theme
}) {
  const value = useThemeState(storageKey, defaultTheme)
  return createElement(ThemeContext.Provider, { value }, children)
}
