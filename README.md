# cheval-ui

Adwaita-inspired React + Tailwind design system with reusable components,
application layouts, and login UI.

## Install

```sh
npm install cheval-ui
# peers:
npm install react react-dom react-router-dom tailwindcss
```

The charts and terminal entry points have their own optional peers (`recharts`, `@xterm/xterm`,
`@xterm/addon-fit`), only install them if you import those.

## Wire up Tailwind + the theme

```js
// tailwind.config.js
module.exports = {
  presets: [require('cheval-ui/tailwind-preset')],  // also sets darkMode: ['class']
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/cheval-ui/dist/**/*.js',
  ],
}
```

```ts
// your app entry (e.g. main.tsx)
import 'cheval-ui/styles.css'   // :root / .dark HSL tokens + base styles
```

Dark mode is the `.dark` class on `<html>`. Wrap your app in `ThemeProvider` and toggle with
`useTheme()` (the `AppShell` footer already includes a light/dark toggle):

```tsx
import { ThemeProvider } from 'cheval-ui'

<ThemeProvider>
  <App />
</ThemeProvider>
```

## Use it

```tsx
import { Button, Card, Tabs, Badge } from 'cheval-ui'
```

### App shell (sidebar layout)

```tsx
import { AppShell, type NavGroup } from 'cheval-ui'
import { LayoutDashboard, Network } from 'lucide-react'

const nav: NavGroup[] = [
  { items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true }] },
  { label: 'Network', items: [{ to: '/interfaces', label: 'Interfaces', icon: Network }] },
]

// as a react-router layout route (renders <Outlet/>):
<Route element={<AppShell nav={nav} title="My App" />}>
  <Route path="/" element={<Dashboard />} />
</Route>
```

`AppShell` props include `nav`, `title`, `logo`, `brand`, `banners`, `sidebarTop`,
`sidebarFooter`, `mobileNavigation`, `mobileOverlay`, `showMobileHeader`, `showThemeToggle`,
`collapsedStorageKey`, and `children` (falls back to `<Outlet/>`). Sidebar slots can be render
functions receiving the collapsed state.

### Login

```tsx
import { LoginScreen, LoginForm } from 'cheval-ui'

<LoginScreen title="My App" subtitle="Sign in to continue" logo={MyLogo}>
  <LoginForm onSubmit={async (username, password) => { await myAuth(username, password) }} />
</LoginScreen>
```

`LoginForm` is auth-agnostic: it owns the field state, loading flag, and inline error; you provide
`onSubmit`. Rejecting the promise shows its message.

### Optional entry points

```tsx
import { TimeSeriesChart } from 'cheval-ui/charts'    // needs recharts
import { TerminalPane } from 'cheval-ui/terminal'     // needs @xterm/xterm + @xterm/addon-fit
```

## What's inside

- **Primitives**: Button, Input, AutocompleteInput, Textarea, NumberInput, Label, Card, Badge, Switch,
  Select, Tabs, Table, Dialog, Sheet, Separator, SectionNav, Segmented, StatusChip, Toaster (sonner).
- **Composites**: PageHeader, EmptyState, Pagination (+ usePagination), SaveButton, SectionLabel,
  Spinner, CopyButton, ReloadButton, TagInput, FeaturePage, AccordionList, ConfirmationBar, DiffView,
  NoticeBanner, and preference rows/groups.
- **Layout**: AppShell.
- **Login**: LoginScreen, LoginForm.
- **Hooks/utils**: cn, useTheme/useThemeState/ThemeProvider, useClipboard, useTabState, fmt\*.
- **Optional**: cheval-ui/charts (TimeSeriesChart), cheval-ui/terminal (TerminalPane).

## Component workbench

For component development with hot reload, build the Docker development image and start the
source-linked showcase:

```sh
make dev
```

Open `http://localhost:6006`. Imports still use the public `cheval-ui` entry points, while Vite
resolves them to `src/` during development so component edits appear immediately.

Run the same auto-reloading development loop in Docker:

```sh
docker compose up --build
```

Open `http://localhost:6006`. Set `CHEVAL_UI_PORT` to expose another host port. Changes under
`src/` or `showcase/src/` reload the browser without rebuilding the container. Run
`make showcase-build` to verify the independent production image served by nginx.

See [docs/README.md](docs/README.md) for architecture, development, workbench,
and code-style documentation.

## Develop

```sh
make check      # style, types, package, showcase, and archive verification
make archive    # build and keep cheval-ui-<version>.tgz
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution and release process.

## Shared component patterns

See [shared components](docs/shared-components.md) for validated preference rows,
variable pickers, action buttons, split menus, statistics, meters, and structured data viewers.
Try their interactive examples in the showcase under **Shared components**.
