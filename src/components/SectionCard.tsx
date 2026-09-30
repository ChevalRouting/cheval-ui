import { Card, CardContent } from '@/components/ui/card'
import { ValueNode } from '@/components/ValueNode'

export interface SectionCardProps {
  name: string
  value: unknown
  defaultOpen?: boolean
  hideNullValues?: boolean
  maxDepth?: number
}

export function SectionCard({ name, value, defaultOpen = true, hideNullValues, maxDepth }: SectionCardProps) {
  return (
    <Card>
      <details open={defaultOpen}>
        <summary className="cursor-pointer rounded px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{name}</summary>
        <CardContent className="px-4 pb-4 pt-0">
          <ValueNode val={value} depth={1} hideNullValues={hideNullValues} maxDepth={maxDepth} />
        </CardContent>
      </details>
    </Card>
  )
}
