import { useState } from 'react'
import { ActionButton, BackLink, Button, Dialog, EntryRow, ResourceNotice, SplitButton, VariablePickerInput } from '@chevalrouting/cheval-ui'
import { Copy, Download, RefreshCw } from 'lucide-react'

export function SharedActionExamples() {
  const [action, setAction] = useState('No action selected')
  const [state, setState] = useState<'error' | 'loading' | 'ready'>('error')
  const [open, setOpen] = useState(false)
  const [variable, setVariable] = useState('')
  return (
    <section aria-label="Shared actions" className="space-y-4">
      <h2 className="text-sm font-semibold">Shared actions</h2>
      <div className="flex flex-wrap items-center gap-3">
        <SplitButton label="Create example" onClick={() => setAction('Created')}
          actions={[{ label: 'Clone example', icon: Copy, onClick: () => setAction('Cloned') },
            { label: 'Unavailable action', disabled: true, onClick: () => setAction('Unexpected') },
            { label: 'Import example', icon: Download, onClick: () => setAction('Imported') },
            { label: 'Configure example', onClick: () => setOpen(true) }]} />
        <ActionButton label="Refresh example" icon={RefreshCw} onClick={() => setAction('Refreshed')} />
        <ActionButton label="Busy example" icon={RefreshCw} busy />
        <ActionButton label="Disabled example" icon={RefreshCw} disabled />
      </div>
      <p role="status" className="text-sm text-muted-foreground">{action}</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setState('loading')}>Show loading</Button>
        <Button onClick={() => setState('error')}>Show error</Button>
        <Button onClick={() => setState('ready')}>Show ready</Button>
      </div>
      <ResourceNotice name="examples" loading={state === 'loading'} error={state === 'error' ? 'The example request timed out.' : null}
        onRetry={() => setState('ready')} />
      {state === 'ready' && <p role="status">Examples are up to date.</p>}
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={() => setOpen(true)}>Show dialog controls</Button>
        <BackLink to="/">Back to workbench</BackLink>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title="Configure example" description="Focus returns to the split button.">
        <div className="space-y-4">
          <EntryRow title="Example name" defaultValue="New example" />
          <VariablePickerInput label="Dialog variable" value={variable} onChange={setVariable} vars={['region', 'name']} />
          <SplitButton label="Dialog action" menuLabel="Dialog alternate actions" onClick={() => setAction('Dialog primary')}
            actions={[{ label: 'Dialog alternate', onClick: () => setAction('Dialog alternate selected') }]} />
        </div>
      </Dialog>
    </section>
  )
}
