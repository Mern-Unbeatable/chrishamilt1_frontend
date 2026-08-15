import { cn } from '@/helpers/cn'

function UserAvatar({ chat, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'size-9 text-xs' : 'size-11 text-sm'

  if (chat.avatar) {
    return (
      <img
        src={chat.avatar}
        alt={chat.name}
        className={cn('rounded-full object-cover', sizeClass)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary font-semibold text-btn-primary',
        sizeClass,
      )}
    >
      {chat.initials}
    </div>
  )
}

export default function Sidebar({
  chats = [],
  activeChatId,
  onSelectChat,
  title = 'Recent Messages',
}) {
  return (
    <div className="flex h-full flex-col border-r border-[#E5E7EB] bg-[#F5F5F5]">
      <div className="border-b border-[#E5E7EB] px-4 py-5">
        <h2 className="text-base font-bold text-[var(--primary-text)]">{title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-1">
          {chats.map((chat) => {
            const isActive = activeChatId === chat.id

            return (
              <li key={chat.id}>
                <button
                  type="button"
                  onClick={() => onSelectChat?.(chat.id)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                    isActive ? 'bg-[#ECECEC]' : 'hover:bg-white/80',
                  )}
                >
                  <div className="relative shrink-0">
                    <UserAvatar chat={chat} />
                    {chat.online ? (
                      <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-[#F5F5F5] bg-emerald-500" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-[var(--primary-text)]">
                        {chat.name}
                      </p>
                      <span className="shrink-0 text-[10px] text-[var(--secondary-text)]">
                        {chat.time}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[var(--secondary-text)]">
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
