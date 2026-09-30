import { Meter } from '@/components/Meter'

export interface BreakdownRowProps {
  label: string
  count: number
  total: number
  colorClass?: string
}

export function BreakdownRow({ label, count, total, colorClass }: BreakdownRowProps) {
  const percentage = Number.isFinite(count) && Number.isFinite(total) && total > 0
    ? Math.max(0, Math.min(100, count / total * 100)) : 0
  return (
    <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_2fr_minmax(0,1fr)]">
      <span className="truncate text-xs font-medium">{label}</span>
      <Meter value={percentage} label={label} colorClass={colorClass} />
      <span className="text-xs text-muted-foreground tabular-nums sm:text-right">
        {Number.isFinite(count) ? count.toLocaleString() : '0'} ({percentage.toFixed(1)}%)
      </span>
    </div>
  )
}
