export interface ChartLegendProps {
  items: { color: string; label: string }[]
}

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <ul aria-label="Chart legend" className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
