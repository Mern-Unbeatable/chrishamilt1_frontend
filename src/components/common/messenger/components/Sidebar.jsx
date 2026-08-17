import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/helpers/cn'
import UserAvatar from '@/components/common/messenger/components/UserAvatar'

function unreadConversationCount(chats) {
  return chats.filter((chat) => (chat.unreadCount ?? 0) > 0).length
}

export default function Sidebar({
  chats = [],
  activeChatId,
  onSelectChat,
  title = 'Messages',
}) {
  const [query, setQuery] = useState('')
  const unreadCount = unreadConversationCount(chats)

  const filteredChats = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return chats

    return chats.filter((chat) => {
      const haystack = `${chat.name} ${chat.subject || ''} ${chat.lastMessage || ''}`.toLowerCase()
      return haystack.includes(value)
    })
  }, [chats, query])

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F9FAFB] md:border-r md:border-[#E5E7EB]">
      <div className="shrink-0 border-b border-[#E5E7EB] px-4 pb-4 pt-4 sm:px-5 sm:pt-5">
        <h2 className="text-lg font-bold tracking-[-0.02em] text-[#111827] sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          {unreadCount} unread {unreadCount === 1 ? 'conversation' : 'conversations'}
        </p>

        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]"
            strokeWidth={2}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            className="h-10 w-full rounded-lg border border-[#E5E7EB] bg-white pr-4 pl-9 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/10"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:px-3 sm:py-3">
        {filteredChats.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-[#64748B]">No conversations found.</p>
        ) : (
          <ul className="space-y-1 pb-2">
            {filteredChats.map((chat) => {
              const isActive = activeChatId === chat.id
              const unread = chat.unreadCount ?? 0

              return (
                <li key={chat.id}>
                  <button
                    type="button"
                    onClick={() => onSelectChat?.(chat.id)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                      isActive
                        ? 'bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]'
                        : 'hover:bg-white/80',
                    )}
                  >
                    <div className="relative shrink-0">
                      <UserAvatar chat={chat} size="lg" />
                      {chat.online ? (
                        <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-[#F9FAFB] bg-[#22C55E]" />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#111827]">{chat.name}</p>

                      {chat.subject ? (
                        <p className="mt-0.5 truncate text-xs font-medium text-btn-primary">
                          {chat.subject}
                        </p>
                      ) : null}

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#64748B] sm:line-clamp-1">
                        {chat.lastMessage}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
                      <span className="text-[10px] font-medium tracking-[0.02em] text-[#94A3B8] uppercase">
                        {chat.time}
                      </span>
                      {unread > 0 ? (
                        <span className="inline-flex min-w-5 items-center justify-center rounded-md bg-btn-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                          {unread}
                        </span>
                      ) : (
                        <span className="size-5" aria-hidden="true" />
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
