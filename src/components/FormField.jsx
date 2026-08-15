import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import { cn } from '@/helpers/cn'

export default function FormField({
  id,
  label,
  className,
  inputClassName,
  ...inputProps
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className={inputClassName} {...inputProps} />
    </div>
  )
}
