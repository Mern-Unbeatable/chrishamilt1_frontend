import { ArrowLeft, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/helpers/cn'

function UserAvatar({ chat, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'size-9 text-xs' : 'size-11 text-sm'

  if (chat?.avatar) {
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
      {chat?.initials}
    </div>
  )
}

export default function ChatArea({
  activeChat,
  messages = [],
  onBack,
  onSendMessage,
  isSending = false,
  placeholder = 'Type a message...',
  sendLabel = 'SMS',
}) {
  const [inputText, setInputText] = useState('')
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    setInputText('')
  }, [activeChat?.id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!inputText.trim() || isSending) return

    const text = inputText
    setInputText('')
    await onSendMessage?.(text)
  }

  if (!activeChat) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#F8F8F8] px-6 text-center">
        <h3 className="text-lg font-semibold text-[var(--primary-text)]">Your Messages</h3>
        <p className="max-w-sm text-sm text-[var(--secondary-text)]">
          Select a conversation from the sidebar to start chatting.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-[#E5E7EB] bg-[#F5F5F5] px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md p-1.5 text-[var(--primary-text)] hover:bg-white/70 md:hidden"
          aria-label="Back to inbox"
        >
          <ArrowLeft className="size-5" />
        </button>

        <UserAvatar chat={activeChat} />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-[var(--primary-text)] sm:text-base">
            {activeChat.name}
          </h2>
          <p className="inline-flex items-center gap-1.5 text-xs text-[var(--secondary-text)]">
            <span className="size-2 rounded-full bg-emerald-500" />
            {activeChat.online ? 'Active' : 'Offline'}
          </p>
        </div>
      </div>

      <div ref={messagesContainerRef} className="flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC] px-4 py-5">
        {messages.map((message) => {
          if (message.type === 'date') {
            return (
              <div key={message.id} className="flex justify-center py-1">
                <span className="text-xs text-[#94A3B8]">{message.label}</span>
              </div>
            )
          }

          const isMine = message.sender === 'me'

          return (
            <div
              key={message.id}
              className={cn('flex items-end gap-2', isMine ? 'justify-end' : 'justify-start')}
            >
              {!isMine ? <UserAvatar chat={activeChat} size="sm" /> : null}
              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-6',
                  isMine
                    ? 'rounded-br-md bg-[#64748B] text-white'
                    : 'rounded-bl-md bg-[#E2E8F0] text-[var(--primary-text)]',
                )}
              >
                {message.text}
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-[#E5E7EB] bg-white px-4 py-4">
        <div className="flex items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-4 py-2">
          <input
            type="text"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--primary-text)] outline-none placeholder:text-[#94A3B8]"
          />

          <button
            type="submit"
            disabled={isSending}
            className="flex shrink-0 flex-col items-center justify-center text-[var(--secondary-text)] transition-colors hover:text-btn-primary disabled:opacity-50"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#F1F5F9]">
              <Send className="size-4" />
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase">{sendLabel}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
