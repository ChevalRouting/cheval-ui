# Shared component patterns

Import these components from `@chevalrouting/cheval-ui`. They accept presentation data and
callbacks; applications keep API calls, routes, status mappings, and persistence policy.
Open **Shared components** in the showcase for working examples. Existing consumers may keep
their `cheval-ui` dependency alias when it points to this package through a local file dependency.

## Preference forms

`ChoiceRow` combines the shared select and preference row. Choices have `value`, `label`,
and optional `disabled`. An empty string is a supported choice value. Use `help` for field
instructions and `stacked` when a vertically arranged label is needed.

`IntegerEntryRow` accepts a numeric `value`, required `min`, optional `max`, and
`onValueChange`. It preserves raw text while editing and emits only safe whole numbers in
range. A negative minimum permits a leading minus sign. Empty text, decimals, exponent
notation, unsafe integers, and trailing characters are invalid. A negative-capable field
uses a text keyboard so a minus sign is available.

```tsx
import { ChoiceRow, IntegerEntryRow, PreferencesGroup } from '@chevalrouting/cheval-ui'

<PreferencesGroup title="Execution">
  <ChoiceRow title="Strategy" value={strategy} onChange={setStrategy}
    choices={[{ value: '', label: 'Automatic' }, { value: 'manual', label: 'Manual' }]} />
  <IntegerEntryRow title="Workers" value={workers} min={1} max={16}
    onValueChange={setWorkers} help="Between 1 and 16 workers" />
</PreferencesGroup>
```

`EntryRow` connects `help` and `error` to its input and sets native custom validity from
`error`. Use a real form and a submit button to block invalid submissions. Applications
that submit from a click handler must call the form's `reportValidity()` first. Server-side
validation remains the application's responsibility. Forwarded refs reach the native input.

Changing the numeric `value` to a different external value updates the draft. To discard an
invalid draft while the numeric value is unchanged, remount the field with a changed `key`.
Preference inputs, selects, and switches share a 20rem desktop control column and stack on mobile.

`VariablePickerInput` combines free text with an unfiltered list of variable tokens. Pass
`vars`, `value`, `onChange`, and optionally `prefix` (defaults to `$`). `label` names the input
for assistive technology; supply a field-specific label. Choosing a token replaces the value.
Use `id` to associate a visible label. Arrow keys choose a suggestion, Enter accepts it, and
Escape closes the list without changing the text.

## Actions and feedback

- `ActionButton`: `label`, `icon`, optional `busy`, plus native button props. Busy disables
  duplicate activation and exposes `aria-busy`. The default style is a neutral icon action.
- `SplitButton`: `label`, `onClick`, and optional `actions` with labels, icons, callbacks,
  and disabled states. `disabled` or `busy` blocks both buttons. `variant` controls emphasis.
  The alternate-action menu supports arrows, Home, End, single-character selection, Escape,
  and focus restoration. Its `menuLabel` defaults to "More actions".
- `BackLink`: the visual back link accepts React Router link props and children. The consumer
  resolves history origins and supplies the destination and label.
- `ResourceNotice`: pass `name`, `loading`, `error`, and `onRetry`. Loading renders status;
  an error renders a stale-information notice, retry action, and expandable detail. A ready
  state renders nothing. The component does not fetch or schedule retries.

## Data display

- `StatCard`: `icon`, `label`, `value`, optional `caption`, `meta`, `pct`, `warn`, and `barLabel`.
  Applications calculate resource totals and warning thresholds.
- `Meter`: `value` is a percentage, `label` is its accessible name. Values are clamped to
  0 through 100; non-finite values display as zero. `warn` selects the warning token.
- `BreakdownRow`: accepts `label`, `count`, `total`, and optional `colorClass`; displays a
  shared meter, count, and bounded percentage. Non-positive totals yield zero percent.
- `ChartLegend`: pass `items` containing `label` and CSS `color`. It is independent of Recharts.
- `ValueNode`: recursively displays `val`, with `depth`, `maxDepth` (default 12), and
  `hideNullValues` (default false). The depth limit bounds recursive and circular input.
- `SectionCard`: a named, collapsible value viewer accepting `name`, `value`, `defaultOpen`,
  `hideNullValues`, and `maxDepth`. Consumers decide section order.
- `DiffCard`: accepts `file`, `status` (`added`, `removed`, `modified`), raw `DiffLine[]`, and
  `defaultOpen`. It composes `DiffView` with collapsed unchanged context. The consumer loads
  the diff and owns any apply action.

## Verification

Run `npm run check`, then `npm run test:browser`. Install the browser once with
`npx playwright install chromium`, or use an installed Chrome with
`PLAYWRIGHT_CHROMIUM_CHANNEL=chrome npm run test:browser`.

Browser checks cover numeric validity, empty and disabled choices, menu focus, variable
selection, retry states, light/dark themes, and mobile overflow. Consumer builds also need
to use the built library or its packed archive; importing library source alone does not
verify the distribution boundary.
