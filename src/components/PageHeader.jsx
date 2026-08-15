import { cn } from '@/helpers/cn'

export default function PageHeader({ title, description, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description ? (
        <p className="text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
