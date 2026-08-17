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
  sidebarTitle = 'Messages',
  placeholder = 'Write a message...',
  className = '',
}) {
  const showInbox = !activePartnerId
  const showChat = Boolean(activePartnerId)

  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] md:flex-row',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-full min-h-0 w-full shrink-0 flex-col md:w-[300px] lg:w-[340px]',
          showInbox ? 'flex' : 'hidden md:flex',
        )}
      >
        <Sidebar
          chats={chats}
          activeChatId={activePartnerId}
          onSelectChat={onSelectChat}
          title={sidebarTitle}
        />
      </div>

      <div
        className={cn(
          'flex h-full min-h-0 min-w-0 flex-1 flex-col',
          showChat ? 'flex' : 'hidden md:flex',
        )}
      >
        <ChatArea
          activeChat={activeChat}
          messages={messages}
          onBack={() => onSelectChat?.(null)}
          onSendMessage={onSend}
          isSending={isSending}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
