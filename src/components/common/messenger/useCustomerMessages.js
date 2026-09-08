import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getSession } from '@/auth/authService'
import useMessages from '@/components/common/messenger/useMessages'
import {
  CHAT_SOCKET_EVENTS,
  connectChatSocket,
  disconnectChatSocket,
  joinConversationRoom,
  leaveConversationRoom,
  subscribeChatSocket,
} from '@/services/chatSocket'
import {
  createCustomerConversation,
  fetchConversation,
  fetchConversationMessages,
  fetchConversations,
  findCustomerConversationMatch,
  formatConversationListTime,
  formatMessageTime,
  isConversationsApiEnabled,
  mapApiConversationToCustomerChat,
  mapApiMessageToUi,
  markConversationRead,
  sendConversationMessage,
} from '@/services/conversationsApi'

function upsertMessage(list, message) {
  if (!message?.id) return list
  if (list.some((item) => item.id === message.id)) return list
  return [...list, message]
}

function mergeConfirmedMessage(list, { optimisticId = null, message }) {
  if (!message?.text) return list

  const withoutDuplicates = list.filter((item) => {
    if (optimisticId && item.id === optimisticId) return false
    if (
      item.pending &&
      item.sender === 'me' &&
      item.text === message.text
    ) {
      return false
    }
    return true
  })

  if (!message.id) {
    return sortMessages([...withoutDuplicates, message])
  }

  return sortMessages(upsertMessage(withoutDuplicates, message))
}

function sortMessages(messages) {
  return [...messages].sort((left, right) => {
    const leftTime = new Date(left.createdAt ?? 0).getTime()
    const rightTime = new Date(right.createdAt ?? 0).getTime()
    return leftTime - rightTime
  })
}

function buildOptimisticMessage({ text, currentUserId }) {
  const now = new Date().toISOString()

  return {
    id: `local-${Date.now()}`,
    sender: 'me',
    text,
    time: formatMessageTime(now),
    read: true,
    senderId: currentUserId,
    createdAt: now,
    pending: true,
  }
}

export default function useCustomerMessages({
  initialTradesmanId = null,
  initialJobId = null,
} = {}) {
  const useApi = isConversationsApiEnabled()
  const demoState = useMessages({ defaultActiveId: null })

  const session = getSession()
  const currentUserId = session?.id ?? null

  const [chats, setChats] = useState([])
  const [messagesByChat, setMessagesByChat] = useState({})
  const [activePartnerId, setActivePartnerId] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [loadingInbox, setLoadingInbox] = useState(useApi)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState('')
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  const rawConversationsRef = useRef([])
  const pendingTargetRef = useRef(
    initialTradesmanId
      ? { tradesmanId: initialTradesmanId, jobId: initialJobId ?? null }
      : null,
  )
  const activePartnerIdRef = useRef(null)

  useEffect(() => {
    activePartnerIdRef.current = activePartnerId
  }, [activePartnerId])

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activePartnerId) || null,
    [chats, activePartnerId],
  )

  const messages = messagesByChat[activePartnerId] || []

  const refreshInbox = useCallback(async () => {
    const result = await fetchConversations()
    rawConversationsRef.current = result.conversations
    setChats(result.conversations.map(mapApiConversationToCustomerChat))
    return result.conversations
  }, [])

  const loadMessages = useCallback(
    async (conversationId) => {
      if (!conversationId) return

      setLoadingMessages(true)

      try {
        const result = await fetchConversationMessages(conversationId)
        const mapped = sortMessages(
          result.messages.map((message) => mapApiMessageToUi(message, currentUserId)),
        )

        setMessagesByChat((current) => ({
          ...current,
          [conversationId]: mapped,
        }))
      } catch (err) {
        setError(err?.message || 'Unable to load messages.')
      } finally {
        setLoadingMessages(false)
      }
    },
    [currentUserId],
  )

  const syncConversationDetails = useCallback(async (conversationId) => {
    if (!conversationId) return null

    try {
      const conversation = await fetchConversation(conversationId)

      rawConversationsRef.current = [
        conversation,
        ...rawConversationsRef.current.filter((item) => item.id !== conversationId),
      ]

      const mapped = mapApiConversationToCustomerChat(conversation)

      setChats((current) => {
        const exists = current.some((chat) => chat.id === conversationId)
        if (!exists) return [{ ...mapped, unreadCount: 0 }, ...current]

        return current.map((chat) =>
          chat.id === conversationId ? { ...mapped, unreadCount: 0 } : chat,
        )
      })

      return conversation
    } catch (err) {
      setError(err?.message || 'Unable to load conversation.')
      return null
    }
  }, [])

  const openConversation = useCallback(
    async (conversationId) => {
      if (!conversationId) return

      setActivePartnerId(conversationId)
      joinConversationRoom(conversationId)

      setChats((current) =>
        current.map((chat) =>
          chat.id === conversationId ? { ...chat, unreadCount: 0 } : chat,
        ),
      )

      await Promise.all([
        loadMessages(conversationId),
        syncConversationDetails(conversationId),
        markConversationRead(conversationId).catch(() => null),
      ])
    },
    [loadMessages, syncConversationDetails],
  )

  const resolvePendingTarget = useCallback(
    async (conversations) => {
      const target = pendingTargetRef.current
      if (!target?.tradesmanId) return

      pendingTargetRef.current = null

      const existing = findCustomerConversationMatch(conversations, target)
      if (existing?.id) {
        await openConversation(existing.id)
        return
      }

      try {
        const created = await createCustomerConversation(target)
        rawConversationsRef.current = [created, ...rawConversationsRef.current]
        setChats((current) => [mapApiConversationToCustomerChat(created), ...current])
        await openConversation(created.id)
      } catch (err) {
        setError(err?.message || 'Unable to start conversation.')
      }
    },
    [openConversation],
  )

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function bootstrap() {
      setLoadingInbox(true)
      setError('')

      try {
        connectChatSocket()
        const conversations = await refreshInbox()
        if (cancelled) return
        await resolvePendingTarget(conversations)
      } catch (err) {
        if (!cancelled) {
          setChats([])
          setError(err?.message || 'Unable to load conversations.')
        }
      } finally {
        if (!cancelled) setLoadingInbox(false)
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [refreshInbox, resolvePendingTarget, useApi])

  useEffect(() => {
    if (!useApi) return undefined

    return subscribeChatSocket((event, payload) => {
      if (event === 'connect') {
        setIsSocketConnected(true)
        if (activePartnerIdRef.current) {
          joinConversationRoom(activePartnerIdRef.current)
        }
        return
      }

      if (event === 'disconnect' || event === 'connect_error') {
        setIsSocketConnected(false)
        return
      }

      if (event === CHAT_SOCKET_EVENTS.NEW_MESSAGE) {
        const message = payload?.message ?? payload?.data ?? payload
        const conversationId =
          message?.conversationId ??
          payload?.conversationId ??
          message?.conversation?.id ??
          null

        if (!message?.id || !conversationId) return

        const mapped = mapApiMessageToUi(message, currentUserId)

        setMessagesByChat((current) => {
          const existing = current[conversationId] ?? []

          return {
            ...current,
            [conversationId]: mergeConfirmedMessage(existing, { message: mapped }),
          }
        })

        setChats((current) => {
          const next = current.map((chat) => {
            if (chat.id !== conversationId) return chat

            return {
              ...chat,
              lastMessage: mapped.text,
              time: formatConversationListTime(message.createdAt),
              lastMessageAt: message.createdAt ?? chat.lastMessageAt,
              unreadCount:
                activePartnerIdRef.current === conversationId
                  ? 0
                  : (chat.unreadCount ?? 0) + (mapped.sender === 'them' ? 1 : 0),
            }
          })

          return [...next].sort((left, right) => {
            const leftTime = new Date(left.lastMessageAt ?? 0).getTime()
            const rightTime = new Date(right.lastMessageAt ?? 0).getTime()
            return rightTime - leftTime
          })
        })

        if (
          mapped.sender === 'them' &&
          activePartnerIdRef.current === conversationId
        ) {
          markConversationRead(conversationId).catch(() => null)
        }

        return
      }

      if (event === CHAT_SOCKET_EVENTS.CONVERSATION_UPDATED) {
        refreshInbox().catch(() => null)
      }
    })
  }, [currentUserId, refreshInbox, useApi])

  useEffect(() => {
    if (!useApi) return undefined

    return () => {
      disconnectChatSocket()
    }
  }, [useApi])

  const selectChat = useCallback(
    async (conversationId) => {
      if (!conversationId) {
        if (activePartnerIdRef.current) {
          leaveConversationRoom(activePartnerIdRef.current)
        }
        setActivePartnerId(null)
        return
      }

      if (activePartnerIdRef.current && activePartnerIdRef.current !== conversationId) {
        leaveConversationRoom(activePartnerIdRef.current)
      }

      await openConversation(conversationId)
    },
    [openConversation],
  )

  const sendMessage = useCallback(
    async (text) => {
      const value = String(text || '').trim()
      if (!value || !activePartnerId) return false

      if (!useApi) {
        return demoState.onSend(value)
      }

      const optimistic = buildOptimisticMessage({ text: value, currentUserId })

      setIsSending(true)
      setMessagesByChat((current) => ({
        ...current,
        [activePartnerId]: [...(current[activePartnerId] || []), optimistic],
      }))
      setChats((current) =>
        current.map((chat) =>
          chat.id === activePartnerId
            ? {
                ...chat,
                lastMessage: value,
                time: formatConversationListTime(new Date().toISOString()),
                lastMessageAt: new Date().toISOString(),
                unreadCount: 0,
              }
            : chat,
        ),
      )

      try {
        const saved = await sendConversationMessage(activePartnerId, value)
        const mapped = mapApiMessageToUi(saved, currentUserId)

        setMessagesByChat((current) => ({
          ...current,
          [activePartnerId]: mergeConfirmedMessage(current[activePartnerId] || [], {
            optimisticId: optimistic.id,
            message: mapped.id ? mapped : { ...optimistic, pending: false },
          }),
        }))

        return true
      } catch (err) {
        setMessagesByChat((current) => ({
          ...current,
          [activePartnerId]: (current[activePartnerId] || []).filter(
            (item) => item.id !== optimistic.id,
          ),
        }))
        setError(err?.message || 'Unable to send message.')
        return false
      } finally {
        setIsSending(false)
      }
    },
    [activePartnerId, currentUserId, demoState, useApi],
  )

  if (!useApi) {
    return {
      ...demoState,
      loadingInbox: false,
      loadingMessages: false,
      error: '',
      isSocketConnected: false,
    }
  }

  return {
    chats,
    messages,
    activePartnerId,
    activeChat,
    isSending,
    loadingInbox,
    loadingMessages,
    error,
    isSocketConnected,
    onSelectChat: selectChat,
    onSend: sendMessage,
  }
}
