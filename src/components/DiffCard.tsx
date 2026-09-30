import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { DiffView, collapseDiffContext, type DiffLine } from '@/components/DiffView'

export interface DiffCardProps {
  file: string
  status: 'added' | 'removed' | 'modified'
  lines: DiffLine[]
  defaultOpen?: boolean
}

export function DiffCard({ file, status, lines, defaultOpen }: DiffCardProps) {
  return (
    <Card>
      <details open={defaultOpen}>
        <summary className="cursor-pointer rounded px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="break-all font-mono">{file}</span>
          <Badge variant={status === 'removed' ? 'destructive' : status === 'added' ? 'success' : 'secondary'} className="ml-2">{status}</Badge>
        </summary>
        <div className="m-2 mt-0 max-h-[40dvh] overflow-auto rounded bg-muted/30 p-3">
          <DiffView lines={collapseDiffContext(lines)} />
        </div>
      </details>
    </Card>
  )
}
