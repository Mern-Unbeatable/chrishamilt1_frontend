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
  sidebarTitle = 'Recent Messages',
  placeholder = 'Type a message...',
  sendLabel = 'SMS',
  className = '',
}) {
  return (
    <div
      className={cn(
        'flex h-full w-full min-h-[480px] flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white sm:min-h-[560px] md:flex-row',
        className,
      )}
    >
      <div
        className={cn(
          'w-full shrink-0 md:w-80 lg:w-96',
          activePartnerId ? 'hidden md:block' : 'block',
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
          'min-h-[360px] min-w-0 flex-1 md:min-h-0',
          !activePartnerId ? 'hidden md:block' : 'block',
        )}
      >
        <ChatArea
          activeChat={activeChat}
          messages={messages}
          onBack={() => onSelectChat?.(null)}
          onSendMessage={onSend}
          isSending={isSending}
          placeholder={placeholder}
          sendLabel={sendLabel}
        />
      </div>
    </div>
  )
}
