import { useState } from 'react'
import { Button, ChoiceRow, EntryRow, IntegerEntryRow, PreferencesGroup, SwitchRow, VariablePickerInput } from '@chevalrouting/cheval-ui'

export function SharedFormExamples() {
  const [choice, setChoice] = useState('')
  const [count, setCount] = useState(2)
  const [variable, setVariable] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [submitted, setSubmitted] = useState('Not submitted')
  const [generation, setGeneration] = useState(0)

  return (
    <form aria-label="Shared form controls" className="space-y-4" onSubmit={event => {
      event.preventDefault()
      setSubmitted(`Saved ${count} workers`)
    }}>
      <PreferencesGroup title="Shared form controls" description="Raw numeric input, empty choices, help, and native validity.">
        <ChoiceRow title="Strategy" value={choice} onChange={setChoice} help="An empty value means automatic."
          choices={[{ value: '', label: 'Automatic' }, { value: 'manual', label: 'Manual' }, { value: 'unavailable', label: 'Unavailable', disabled: true }]} />
        <ChoiceRow title="Disabled choice" disabled value="" onChange={() => undefined} choices={[]} />
        <IntegerEntryRow key={generation} title="Workers" value={count} min={1} max={16} onValueChange={setCount}
          help="Enter 1 to 16. Try blank, 2.5, 2abc, or 17 before submitting." />
        <EntryRow title="Access key" type="password" defaultValue="example" help="Password visibility and shared label alignment." />
        <SwitchRow title="Enabled" checked={enabled} onCheckedChange={setEnabled} />
      </PreferencesGroup>
      <div className="space-y-1.5">
        <label htmlFor="variable-example" className="text-sm font-medium">Variable or literal value</label>
        <VariablePickerInput id="variable-example" label="Variable or literal value" value={variable} onChange={setVariable}
          vars={['hostname', 'region', 'instance']} prefix="$" mono placeholder="Enter text or choose a variable" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="suggested">Save example</Button>
        <Button type="button" onClick={() => { setCount(2); setGeneration(value => value + 1); setSubmitted('Not submitted') }}>Reset example</Button>
      </div>
      <p role="status" className="text-sm text-muted-foreground">{submitted}</p>
    </form>
  )
}
