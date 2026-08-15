import { useCallback, useMemo, useState } from 'react'
import {
  DEMO_MESSENGER_CHATS,
  DEMO_MESSENGER_MESSAGES,
} from '@/data/demoData'

function formatNow() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

/**
 * Frontend-only chat state. Swap internals later for API.
 */
export default function useMessages({ defaultActiveId = 'ope' } = {}) {
  const [chats, setChats] = useState(DEMO_MESSENGER_CHATS)
  const [messagesByChat, setMessagesByChat] = useState(DEMO_MESSENGER_MESSAGES)
  const [activePartnerId, setActivePartnerId] = useState(defaultActiveId)
  const [isSending, setIsSending] = useState(false)

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activePartnerId) || null,
    [chats, activePartnerId],
  )

  const messages = messagesByChat[activePartnerId] || []

  const selectChat = useCallback((id) => {
    setActivePartnerId(id)
  }, [])

  const sendMessage = useCallback(
    async (text) => {
      const value = String(text || '').trim()
      if (!value || !activePartnerId) return false

      setIsSending(true)
      await new Promise((resolve) => setTimeout(resolve, 200))

      const next = {
        id: `local-${Date.now()}`,
        sender: 'me',
        text: value,
      }

      setMessagesByChat((current) => ({
        ...current,
        [activePartnerId]: [...(current[activePartnerId] || []), next],
      }))

      setChats((current) =>
        current.map((chat) =>
          chat.id === activePartnerId
            ? { ...chat, lastMessage: value, time: formatNow() }
            : chat,
        ),
      )

      setIsSending(false)
      return true
    },
    [activePartnerId],
  )

  return {
    chats,
    messages,
    activePartnerId,
    activeChat,
    isSending,
    onSelectChat: selectChat,
    onSend: sendMessage,
  }
}
