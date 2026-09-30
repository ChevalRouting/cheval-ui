# Code style

These conventions apply to new and changed library code, scripts, and showcase examples.

## Structure

- Keep primitives under `src/components/ui/`, composites under `src/components/`, and
  shared hooks and utilities under `src/lib/`.
- Keep showcase pages thin: layout, example state, and wiring. Move sizeable examples into
  named components, with one component per file when it exceeds a screenful.
- Group related small components only when they belong to the same component or feature.
- Use named props and data types, and named handlers for multi-step actions. Short callbacks
  that capture component state are acceptable.
- Group statements by intent. Separate logical blocks with a blank line.

## Comments

Code is the documentation, and it carries no comments. This applies to handwritten
TypeScript, TSX, JavaScript, CSS, and scripts. Naming and structure must make intent clear;
if a fragment cannot be understood without prose, restructure it until it can.

The only allowed comment lines are required tooling directives, such as
`/// <reference ... />`, `@ts-expect-error`, and narrowly scoped `eslint-disable-*`.
Shell scripts keep their shebang. Do not add section-marker comments, commented-out code,
TODOs, or JSDoc that repeats a type signature. Public usage and design explanations belong
under `docs/` and in executable showcase examples.

Generated code and distribution files keep their generator headers and source-map directives.
Do not hand-edit them or use that exception for handwritten source. A directive must have a
specific tooling purpose; do not use one to suppress a problem that should be fixed.

## TypeScript and reusable components

- Design each export around a reusable UI capability. It must work with consumer-supplied
  data without importing an application's API models, store, route table, or configuration.
- Define and export named `ComponentNameProps` interfaces for public components and named
  types for options, items, and callback payloads. Keep implementation-only types private.
- Use `unknown` for untrusted values and narrow before use. Avoid `any`, unsafe assertions,
  and non-null assertions that conceal missing data. Keep strict typechecking enabled.
- Extend native React prop types where appropriate. Use `Omit` to resolve deliberate API
  differences, forward refs for focusable controls, and preserve native accessibility,
  disabled, form, and event behavior. Do not expose props the implementation ignores.
- Prefer composition of existing primitives to copying markup. Use children, typed render
  slots, and callbacks for consumer variation; avoid product-specific flags and growing
  collections of boolean props. Use discriminated unions for mutually exclusive modes.
- Use generics only when they preserve a meaningful relation between supplied values and
  callbacks. Prefer a small concrete API over a generic abstraction with one use case.
- Keep business state and side effects in the application. Components accept values and
  notify changes; keep local state for transient UI such as focus, menus, and draft text.
  Do not embed fetch calls, endpoints, persistence keys, job polling, or authentication policy.
- Document controlled/default values and reset behavior. Do not silently replace a user's
  draft on unrelated renders. Clean up listeners and timers, and access browser globals
  only when the component is running in the browser.
- Use named handlers for multi-step actions and extract reusable pure transformations.
  Short callbacks that capture local state are fine. Handle rejected promises explicitly.
- Use `import type` for type-only dependencies. Internal code imports its defining module,
  not the package's own barrel. Export the supported API through the public entry points.
- Keep color, spacing, disabled, loading, error, keyboard, and responsive behavior in the
  shared component. Consumers provide domain labels, status mappings, and action callbacks.
- A backport is complete when the public export, consumer documentation, showcase states,
  interaction checks, and consuming applications use the shared implementation. Thin
  application adapters may translate domain data; they must not duplicate the UI.

## Package boundary

- Keep product logos, API clients, application routes, authentication policy, and business
  workflows in consuming applications. Accept data, labels, render slots, and callbacks.
- Use public `@chevalrouting/cheval-ui` entry points in the showcase and consuming applications.
  Existing consumer dependency aliases may use those same exports; never import library source paths.
- Check existing exports before adding a component. Extend an existing primitive when the
  missing behavior fits its purpose, instead of creating a competing implementation.
- Keep chart and terminal dependencies in their optional entry points.

## Forms and layout

- Follow Adwaita and GNOME interaction patterns using existing primitives and semantic tokens.
- Build configuration forms with `PreferencesGroup`, `EntryRow`, `ComboRow`, and `SwitchRow`.
  Use shared `Select` controls, `Dialog` for creation flows, and `AlertDialog` for destructive
  confirmation. Do not recreate controls inside composites or showcase examples.
- Keep preference controls aligned in a shared desktop column and full-width on mobile.
  Use a 20rem column when standardizing preference rows; migrate related rows together.
- Hand-built field stacks use at least `space-y-1.5` between a label and its control.
  Denser spacing is for tables and non-form status lists.
- Numeric controls preserve raw text during editing. Validate the complete value and field
  limits, show inline errors, and prevent invalid form submission. Convert to numbers only
  after validation. Do not accept a valid numeric prefix of otherwise invalid text.
- Keep generic cards, preference groups, dialogs, and sheets borderless. Use spacing and
  shadow for elevation; add separators where content structure requires them.
- Keep global element defaults in Tailwind's base layer so component utilities can override them.

## Actions and accessibility

- Each view has at most one suggested or destructive primary action. Routine and table
  actions use neutral buttons; destructive confirmation uses the destructive variant.
- Icon actions have an accessible name and a tooltip. Decorative icons are hidden from
  assistive technology.
- Associate labels, help, and errors with their controls. Preserve visible keyboard focus,
  keyboard navigation, and focus restoration when an overlay closes.
- Use semantic palette tokens in light and dark themes. Status indicators include text;
  color alone must not convey state. Applications supply domain-specific state mappings.
- Show pending and disabled states for asynchronous actions and prevent duplicate submission.

## Text and commits

- Do not use em dashes in code, UI strings, or documentation; use commas, colons, or parentheses.
- Use a lowercase imperative commit subject, optionally prefixed by the touched area
  (`ui: ...`, `showcase: ...`). No conventional-commit prefixes or trailers.
- Prefer a concise, subject-only commit message for routine changes.

## Verification

- Run `make check` before release. With local dependencies installed, `npm run check` runs
  style checks, typechecking, package and showcase builds, and archive validation.
- Run `npm run test:browser` for shared-control interaction changes after installing the
  Playwright Chromium browser with `npx playwright install chromium`. To use an installed
  Chrome locally, set `PLAYWRIGHT_CHROMIUM_CHANNEL=chrome`.
- Run `npm run check:commits` for the latest commit, or pass a base and head to check a range.
- Review changed interactions with keyboard input, at mobile and desktop widths, and in
  light and dark themes. Include relevant disabled, empty, loading, and error states.
- Add meaningful showcase examples and update public exports and consumer docs for new APIs.
- Automated style checks cover only part of this guide; passing them does not replace review.
