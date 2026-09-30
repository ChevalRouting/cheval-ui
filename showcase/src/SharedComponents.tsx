import { SharedFormExamples } from './SharedFormExamples'
import { SharedActionExamples } from './SharedActionExamples'
import { SharedDisplayExamples } from './SharedDisplayExamples'

export function SharedComponents() {
  return (
    <div className="space-y-8">
      <SharedFormExamples />
      <div className="grid gap-8 lg:grid-cols-2">
        <SharedActionExamples />
        <SharedDisplayExamples />
      </div>
    </div>
  )
}
