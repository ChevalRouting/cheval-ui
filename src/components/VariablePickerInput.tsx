import { AutocompleteInput } from '@/components/ui/autocomplete-input'
import { cn } from '@/lib/utils'

export interface VariablePickerInputProps {
  value: string
  onChange: (value: string) => void
  vars: string[]
  placeholder?: string
  mono?: boolean
  className?: string
  wrapperClassName?: string
  prefix?: string
  label?: string
  disabled?: boolean
  id?: string
}

export function VariablePickerInput({ value, onChange, vars, placeholder, mono, className,
  wrapperClassName, prefix = '$', label = 'Available variables', disabled, id }: VariablePickerInputProps) {
  return (
    <div className={wrapperClassName}>
      <AutocompleteInput value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        options={Array.from(new Set(vars)).map(name => ({ value: prefix + name, label: prefix + name }))}
        filterOptions={false} maxOptions={vars.length} emptyMessage="No variables available. Enter a value manually."
        className={cn(mono && 'font-mono', className)} inputProps={{ id, 'aria-label': label }} />
    </div>
  )
}
