import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/PageHeader'
import { Tabs } from '@/components/ui/tabs'

type View = 'status' | 'config'

interface FeaturePageProps {
  title: string
  description?: string
  statusLabel?: string
  configLabel?: string
  defaultView?: View
  renderStatus: React.ReactNode
  renderConfig: (setAction: (a: React.ReactNode) => void) => React.ReactNode
}

export function FeaturePage({
  title,
  description,
  statusLabel = 'Status',
  configLabel = 'Configuration',
  defaultView = 'status',
  renderStatus,
  renderConfig,
}: FeaturePageProps) {
  const [view, setView] = useState<View>(defaultView)
  const [configAction, setConfigAction] = useState<React.ReactNode>(null)

  const tabs = [
    { key: 'status' as View, label: statusLabel },
    { key: 'config' as View, label: configLabel },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} action={view === 'config' ? configAction : null} />
      <Tabs tabs={tabs} active={view} onChange={setView} />

      <div className={cn(view !== 'status' && 'hidden')}>{renderStatus}</div>
      <div className={cn(view !== 'config' && 'hidden')}>{renderConfig(setConfigAction)}</div>
    </div>
  )
}
