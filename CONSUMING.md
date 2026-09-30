# Switching an app to cheval-ui

Step-by-step to make a new (or existing) Vite + React + TypeScript + Tailwind app render with
cheval-ui instead of a local copy of the UI, and verify it works. These examples assume
`cheval-ui/` and `my-app/` are sibling directories. Start in their parent directory.

---

## 0. Build cheval-ui first

Consumers import the built `dist/`, so build it (re-run this whenever you change the library):

```sh
cd cheval-ui
npm install
npm run build        # -> dist/ (esm + d.ts) + dist/styles.css
```

## 1. Install it in your app

Since it is not published yet, link it by path. Peers are installed alongside:

```sh
cd ../my-app
npm install ../cheval-ui
npm install react react-dom react-router-dom tailwindcss
# only if you use them:
#   npm install recharts                       # for cheval-ui/charts
#   npm install @xterm/xterm @xterm/addon-fit  # for cheval-ui/terminal
#   npm install sonner                         # if you call toast() directly
```

`npm install ../cheval-ui` writes `"cheval-ui": "file:../cheval-ui"`. After rebuilding the library,
run `npm install` again in the app (or `npm rebuild cheval-ui`) so the copy refreshes.

## 2. Point Tailwind at the preset AND the library's dist

This is the #1 gotcha: Tailwind must scan the library's compiled JS or the class names inside
cheval-ui components produce **no CSS** and everything looks unstyled.

```js
// tailwind.config.js
module.exports = {
  presets: [require('cheval-ui/tailwind-preset')],   // the Adwaita theme (colors, radius, animations)
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/cheval-ui/dist/**/*.js',          // <-- REQUIRED
  ],
  theme: { extend: {} },   // your own additions go here; the palette comes from the preset
  plugins: [],             // tailwindcss-animate is already in the preset
}
```

Make sure PostCSS runs Tailwind (standard Vite setup):

```js
// postcss.config.js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

## 3. Load the token stylesheet + the Tailwind entry

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```ts
// src/main.tsx  (order matters: tokens before your own overrides)
import 'cheval-ui/styles.css'   // :root / .dark HSL variables + base body styles
import './index.css'
```

## 4. Wrap the app in the providers

`AppShell`/`LoginForm` need a router; the theme toggle needs the theme provider.

```tsx
// src/main.tsx (continued)
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'cheval-ui'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
)
```

## 5. Replace local UI imports with cheval-ui

Everything comes from the package root:

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Tabs, Badge } from 'cheval-ui'
```

If you are migrating an app that already has a local `components/ui`, rewrite the imports and then
delete the local copies:

```sh
# primitives: @/components/ui/<x>  ->  cheval-ui   (macOS sed; Linux: drop the '')
grep -rl "@/components/ui/" src | xargs sed -i '' -E "s#from '@/components/ui/[a-z-]+'#from 'cheval-ui'#g"

# the three that were DEFAULT exports locally are NAMED in cheval-ui:
#   Keep product logos local and pass them through AppShell/LoginScreen props.
#   import SaveButton from '@/components/SaveButton'  ->  import { SaveButton } from 'cheval-ui'
#   import TagInput from '@/components/TagInput'  ->  import { TagInput } from 'cheval-ui'
```

Then remove the now-duplicated local pieces: `src/components/ui/`, the theme block in your old
`tailwind.config`, and the `:root`/`.dark` token CSS (they come from the preset + `styles.css` now).
Run `npx tsc --noEmit` and fix any leftover import paths.

Toasts: render `<Toaster />` once (from `cheval-ui`), and call `toast()` from `sonner`:

```tsx
import { Toaster } from 'cheval-ui'
import { toast } from 'sonner'
```

## 6. Use the layout and login

```tsx
// App.tsx
import { Routes, Route } from 'react-router-dom'
import { AppShell, LoginScreen, LoginForm, type NavGroup } from 'cheval-ui'
import { LayoutDashboard, Network, Settings2 } from 'lucide-react'

const nav: NavGroup[] = [
  { items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true }] },
  { label: 'Network', items: [{ to: '/net', label: 'Network', icon: Network }] },
  { label: 'System',  items: [{ to: '/settings', label: 'Settings', icon: Settings2 }] },
]

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginScreen title="My App" subtitle="Sign in to continue">
            <LoginForm onSubmit={async (u, p) => { await myAuth(u, p) /* throw to show an error */ }} />
          </LoginScreen>
        }
      />
      <Route element={<AppShell nav={nav} title="My App" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/net" element={<NetPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
```

`AppShell` slots: `brand`, `banners` (full-width nodes above content), `sidebarFooter` (e.g. a
Settings link / Sign out). It renders `<Outlet/>` by default, or `children` if you pass them.

## 7. Run and verify

```sh
npm run dev
```

Check:
- Components are **styled** (Button has a blue fill, Cards have borders/rounded corners). If they are
  unstyled, step 2's `content` glob or the preset is missing.
- The sidebar renders, active nav item highlights, collapse toggle persists across reload, mobile
  width shows the hamburger + drawer.
- Toggling the sidebar sun/moon flips **light/dark** (adds/removes `.dark` on `<html>`). If colors do
  not change, `cheval-ui/styles.css` is not imported or `ThemeProvider` is missing.
- `/login` shows the branded screen; a rejected `onSubmit` shows the inline error.
- `npx tsc --noEmit` is clean.

## Troubleshooting

- **Everything unstyled** → `./node_modules/cheval-ui/dist/**/*.js` missing from Tailwind `content`,
  or the preset not applied.
- **Dark mode does nothing** → `styles.css` not imported, or app not wrapped in `ThemeProvider`, or
  your config dropped `darkMode: ['class']` (the preset sets it; don't override it away).
- **`useContext`/router errors from AppShell** → not inside `<BrowserRouter>`.
- **Type or import errors after edits to the library** → rebuild cheval-ui (`npm run build`) and
  re-install in the app.
- **Duplicate React** (hooks error) → ensure the app has a single `react`; with `file:` links this is
  usually fine because react is a peer, not bundled.
```
