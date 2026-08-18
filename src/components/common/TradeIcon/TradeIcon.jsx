import { Wrench } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic.mjs'
import { cn } from '@/helpers/cn'
import { pascalToKebab } from '@/lib/tradeIconUtils'

export default function TradeIcon({
  name = 'Wrench',
  className = '',
  strokeWidth = 2,
  ...props
}) {
  const kebabName = pascalToKebab(name)

  return (
    <DynamicIcon
      name={kebabName}
      fallback={Wrench}
      className={cn('shrink-0', className)}
      strokeWidth={strokeWidth}
      {...props}
    />
  )
}
