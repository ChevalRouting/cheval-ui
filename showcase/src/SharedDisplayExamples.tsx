import { BreakdownRow, ChartLegend, DiffCard, Meter, SectionCard, StatCard } from '@chevalrouting/cheval-ui'
import { HardDrive } from 'lucide-react'

export function SharedDisplayExamples() {
  return (
    <section aria-label="Shared data display" className="space-y-5">
      <h2 className="text-sm font-semibold">Shared data display</h2>
      <StatCard icon={HardDrive} label="Storage" value="42 GiB free" caption="100 GiB total capacity"
        pct={58} meta="Example values" barLabel="Storage used" />
      <ChartLegend items={[{ label: 'Reads', color: 'hsl(var(--primary))' }, { label: 'Writes', color: 'hsl(var(--warning))' }]} />
      <BreakdownRow label="Reads" count={72} total={100} />
      <BreakdownRow label="Writes" count={28} total={100} colorClass="bg-warning" />
      <div className="space-y-1.5"><p className="text-xs">Clamped meter (125%)</p><Meter label="Clamped example" value={125} warn /></div>
      <SectionCard name="Configuration example" value={{ name: 'Example', enabled: true, fallback: null, retries: 3, regions: ['east', 'west'] }} />
      <SectionCard name="Empty object" value={{}} defaultOpen={false} />
      <DiffCard file="settings.json" status="modified" defaultOpen lines={[
        { type: 'same', text: '{' }, { type: 'remove', text: '  "workers": 2' },
        { type: 'add', text: '  "workers": 4' }, { type: 'same', text: '}' },
      ]} />
    </section>
  )
}
