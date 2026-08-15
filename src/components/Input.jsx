import { cn } from '@/helpers/cn'

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/20 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
