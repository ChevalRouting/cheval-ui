export interface ValueNodeProps {
  val: unknown
  depth?: number
  maxDepth?: number
  hideNullValues?: boolean
}

export function ValueNode({ val, depth = 0, maxDepth = 12, hideNullValues = false }: ValueNodeProps) {
  if (val == null) return <span className="italic text-muted-foreground">{String(val)}</span>
  if (typeof val !== 'object') {
    return <span className="break-all font-mono text-foreground">{val === '' ? 'empty' : String(val)}</span>
  }
  if (depth >= maxDepth) return <span className="text-muted-foreground">Maximum depth reached</span>

  const array = Array.isArray(val)
  const entries = Object.entries(val).filter(([, value]) => !hideNullValues || value != null)
  if (!entries.length) return <span className="font-mono text-muted-foreground">{array ? '[]' : '{}'}</span>

  return (
    <details open={depth < 2}>
      <summary className="cursor-pointer rounded text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {entries.length} {array ? 'item' : 'field'}{entries.length === 1 ? '' : 's'}
      </summary>
      <div className="mt-1 space-y-1.5 border-l border-border pl-4">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-wrap items-start gap-2 text-sm">
            <span className="break-all font-medium">{key}:</span>
            <ValueNode val={value} depth={depth + 1} maxDepth={maxDepth} hideNullValues={hideNullValues} />
          </div>
        ))}
      </div>
    </details>
  )
}
