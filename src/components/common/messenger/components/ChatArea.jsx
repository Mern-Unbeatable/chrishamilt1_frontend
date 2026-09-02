import {
  ArrowLeft,
  CheckCheck,
  Image,
  Mic,
  Paperclip,
  Send,
  Smile,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/helpers/cn'
import UserAvatar from '@/components/common/messenger/components/UserAvatar'

const COMPOSER_ACTIONS = [
  { icon: Paperclip, label: 'Attach file' },
  { icon: Image, label: 'Attach image' },
  { icon: Mic, label: 'Voice message' },
  { icon: Smile, label: 'Emoji' },
]

export default function ChatArea({
  activeChat,
  messages = [],
  onBack,
  onSendMessage,
  isSending = false,
  placeholder = 'Write a message...',
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
      <div className="flex h-full min-h-80 flex-col items-center justify-center gap-2 bg-white px-6 py-10 text-center">
        <h3 className="text-lg font-semibold text-[#111827]">Your Messages</h3>
        <p className="max-w-sm text-sm leading-6 text-[#64748B]">
          Select a conversation from the sidebar to start chatting.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex shrink-0 items-center gap-3 border-b border-[#E5E7EB] bg-white px-4 py-3 sm:px-5 sm:py-3.5">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md p-1.5 text-[#111827] hover:bg-[#F8FAFC] md:hidden"
          aria-label="Back to inbox"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div className="relative shrink-0">
          <UserAvatar chat={activeChat} size="lg" />
          {activeChat.online ? (
            <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-[#22C55E]" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-[#111827]">{activeChat.name}</h2>
          <p
            className={cn(
              'text-xs font-medium',
              activeChat.online ? 'text-[#16A34A]' : 'text-[#64748B]',
            )}
          >
            {activeChat.online ? 'Online now' : 'Offline'}
          </p>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC] px-3 py-4 sm:space-y-4 sm:px-5 sm:py-5"
      >
        {messages.map((message) => {
          if (message.type === 'date') {
            return (
              <div key={message.id} className="flex justify-center py-1">
                <span className="text-xs font-medium text-[#94A3B8]">{message.label}</span>
              </div>
            )
          }

          const isMine = message.sender === 'me'

          return (
            <div
              key={message.id}
              className={cn('flex', isMine ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[88%] rounded-lg px-3.5 py-2.5 text-sm leading-6 sm:max-w-[min(100%,480px)] sm:px-4 sm:py-3',
                  isMine
                    ? 'bg-btn-primary text-white'
                    : 'border border-[#E5E7EB] bg-white text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
                )}
              >
                <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
                <div
                  className={cn(
                    'mt-1.5 flex items-center justify-end gap-1 text-[10px] leading-none',
                    isMine ? 'text-white/75' : 'text-[#94A3B8]',
                  )}
                >
                  <span>{message.time}</span>
                  {isMine && message.read !== false ? (
                    <CheckCheck className="size-3.5" strokeWidth={2.25} />
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-[#E5E7EB] bg-white px-3 pt-3 pb-4 sm:px-5 sm:pt-4 sm:pb-5"
      >
        <div className="flex items-end gap-2 sm:items-center sm:gap-3">
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            {COMPOSER_ACTIONS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex size-8 items-center justify-center rounded-md text-[#94A3B8] transition-colors hover:bg-[#F8FAFC] hover:text-[#64748B] sm:size-9"
                aria-label={label}
              >
                <Icon className="size-4.25 sm:size-4.5" strokeWidth={1.75} />
              </button>
            ))}
          </div>

          <div className="flex min-w-0 flex-1 items-center rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2.5 sm:px-4">
            <input
              type="text"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#94A3B8]"
            />
          </div>

          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-btn-primary text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-45 sm:size-11"
            aria-label="Send message"
          >
            <Send className="size-4.25 sm:size-4.5" strokeWidth={2} />
          </button>
        </div>
      </form>
    </div>
  )
}
