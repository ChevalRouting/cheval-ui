# Cheval UI documentation

Cheval UI is a reusable React and Tailwind design system. It contains visual
primitives, application-level components, theme tokens, and layout helpers.
Product logos, business workflows, API clients, and feature-specific screens
stay in consuming applications.

## How it fits together

- **Tokens** define the semantic color system for light and dark themes.
- **Primitives** provide buttons, fields, dialogs, tables, tabs, and status UI.
- **Composites** combine primitives into common application patterns.
- **Layouts** provide configurable shells without owning product behavior.
- **Workbench** imports the built package as an external application and
  renders interactive component examples.

## Documentation index

| Page | Purpose |
|------|---------|
| [architecture.md](architecture.md) | package boundaries, exports, and repository layout |
| [development.md](development.md) | package and workbench development workflow |
| [workbench.md](workbench.md) | Docker Compose usage and adding component examples |
| [shared-components.md](shared-components.md) | reusable form, action, and display components |
| [code-style.md](code-style.md) | frontend, documentation, and commit conventions |
| [release-checklist.md](release-checklist.md) | pre-tag and post-release verification |
