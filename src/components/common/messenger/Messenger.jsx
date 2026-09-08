import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import { cn } from '@/helpers/cn'

/**
 * Common messenger shell — inbox + conversation.
 * Pass state/handlers from the page (e.g. useMessages()).
 */
export default function Messenger({
  chats = [],
  messages = [],
  activePartnerId = null,
  activeChat = null,
  onSelectChat,
  onSend,
  isSending = false,
  loadingInbox = false,
  loadingMessages = false,
  error = '',
  sidebarTitle = 'Messages',
  placeholder = 'Write a message...',
  className = '',
}) {
  const showInbox = !activePartnerId
  const showChat = Boolean(activePartnerId)

  return (
    <div
      className={cn(
        'relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] md:flex-row',
        className,
      )}
    >
      {error ? (
        <div className="border-b border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-sm text-[#B91C1C] md:absolute md:top-3 md:right-3 md:left-auto md:z-10 md:max-w-sm md:rounded-lg md:border md:shadow-sm">
          {error}
        </div>
      ) : null}

      <div
        className={cn(
          'flex h-full min-h-0 w-full shrink-0 flex-col md:w-75 lg:w-85',
          showInbox ? 'flex' : 'hidden md:flex',
        )}
      >
        {loadingInbox ? (
          <div className="flex h-full items-center justify-center px-6 text-sm text-[#64748B]">
            Loading conversations…
          </div>
        ) : (
          <Sidebar
            chats={chats}
            activeChatId={activePartnerId}
            onSelectChat={onSelectChat}
            title={sidebarTitle}
          />
        )}
      </div>

      <div
        className={cn(
          'relative flex h-full min-h-0 min-w-0 flex-1 flex-col',
          showChat ? 'flex' : 'hidden md:flex',
        )}
      >
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center px-6 text-sm text-[#64748B]">
            Loading messages…
          </div>
        ) : (
          <ChatArea
            activeChat={activeChat}
            messages={messages}
            onBack={() => onSelectChat?.(null)}
            onSendMessage={onSend}
            isSending={isSending}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  )
}
