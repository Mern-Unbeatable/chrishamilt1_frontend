import { cn } from '@/helpers/cn'

export default function UserAvatar({ chat, size = 'md', className = '' }) {
  const sizeClass =
    size === 'sm' ? 'size-9 text-[11px]' : size === 'lg' ? 'size-11 text-sm' : 'size-10 text-xs'

  if (chat?.avatar) {
    return (
      <img
        src={chat.avatar}
        alt={chat?.name || ''}
        className={cn('rounded-full object-cover', sizeClass, className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-[#EAF2FE] font-semibold text-btn-primary',
        sizeClass,
        className,
      )}
    >
      {chat?.initials}
    </div>
  )
}
