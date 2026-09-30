import { cn } from '@/lib/utils'

export interface DiffLine {
  type: 'same' | 'add' | 'remove'
  text: string
}

export interface DiffHunk {
  type: 'hunk'
  text: string
}

export type DiffViewLine = DiffLine | DiffHunk

export function collapseDiffContext(raw: DiffLine[], context = 4): DiffViewLine[] {
  const visible = new Array(raw.length).fill(false) as boolean[]
  raw.forEach((line, index) => {
    if (line.type === 'same') return
    const first = Math.max(0, index - context)
    const last = Math.min(raw.length - 1, index + context)
    for (let cursor = first; cursor <= last; cursor++) visible[cursor] = true
  })

  const result: DiffViewLine[] = []
  let index = 0
  while (index < raw.length) {
    if (visible[index]) {
      result.push(raw[index])
      index++
      continue
    }
    let skipped = 0
    while (index < raw.length && !visible[index]) {
      skipped++
      index++
    }
    result.push({ type: 'hunk', text: `${skipped} unchanged line${skipped === 1 ? '' : 's'}` })
  }
  return result
}

export function DiffView({ lines, className }: { lines: DiffViewLine[]; className?: string }) {
  return (
    <div className={cn('font-mono text-xs leading-relaxed', className)}>
      {lines.map((line, index) => {
        if (line.type === 'hunk') {
          return <div key={index} className="select-none py-0.5 text-muted-foreground/60">··· {line.text} ···</div>
        }
        const marker = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '
        return (
          <div
            key={index}
            className={cn(
              'whitespace-pre-wrap break-all',
              line.type === 'same' && 'text-muted-foreground',
              line.type === 'add' && 'bg-success/10 text-success',
              line.type === 'remove' && 'bg-danger/10 text-danger',
            )}
          >
            <span className="mr-1 select-none">{marker}</span>
            {line.text}
          </div>
        )
      })}
    </div>
  )
}
