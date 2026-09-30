import { useMemo, useState } from 'react'
import {
  AutocompleteInput,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfirmationBar,
  DiffView,
  NoticeBanner,
  collapseDiffContext,
  type AutocompleteOption,
  type DiffLine,
} from '@chevalrouting/cheval-ui'
import { Info } from 'lucide-react'

const options: AutocompleteOption[] = [
  { value: 'edge-router', label: 'Edge router', description: 'Public network boundary', meta: 'Router', keywords: ['gateway'] },
  { value: 'core-router', label: 'Core router', description: 'Internal routing fabric', meta: 'Router' },
  { value: 'dns-primary', label: 'Primary DNS', description: 'Authoritative resolver', meta: 'Service' },
]

const rawDiff: DiffLine[] = [
  { type: 'same', text: 'service enabled' },
  { type: 'same', text: 'mode automatic' },
  { type: 'remove', text: 'timeout 30' },
  { type: 'add', text: 'timeout 60' },
  { type: 'same', text: 'logging info' },
  { type: 'same', text: 'save on-exit' },
]

function ComponentExample({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function ApplicationPatternComponents() {
  const [value, setValue] = useState('')
  const [noticeVisible, setNoticeVisible] = useState(true)
  const lines = useMemo(() => collapseDiffContext(rawDiff, 1), [])

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ComponentExample title="Autocomplete input" description="Free entry with searchable, keyboard-accessible suggestions.">
        <AutocompleteInput value={value} options={options} onChange={setValue} placeholder="Search components" />
      </ComponentExample>
      <ComponentExample title="Diff view" description="Semantic added, removed, unchanged, and collapsed lines.">
        <DiffView lines={lines} />
      </ComponentExample>
      <ComponentExample title="Confirmation bar" description="Controlled confirmation presentation without application polling or timers.">
        <ConfirmationBar
          title="Changes need confirmation"
          description="Confirm before the application rolls them back."
          remainingSeconds={42}
          actionLabel="Keep changes"
          onConfirm={() => undefined}
        />
      </ComponentExample>
      <ComponentExample title="Notice banner" description="Controlled intent, content, icon, and dismissal behavior.">
        {noticeVisible ? (
          <NoticeBanner intent="info" icon={<Info className="h-4 w-4" />} onDismiss={() => setNoticeVisible(false)}>
            A reusable informational notice from the application.
          </NoticeBanner>
        ) : (
          <button type="button" className="text-sm text-primary hover:underline" onClick={() => setNoticeVisible(true)}>
            Restore notice
          </button>
        )}
      </ComponentExample>
    </div>
  )
}
