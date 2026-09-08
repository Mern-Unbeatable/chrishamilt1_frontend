import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'

export const CONVERSATIONS_PAGE_SIZE = 20
export const MESSAGES_PAGE_SIZE = 50

function normalizePagination(payload, { page, limit, rowsLength }) {
  const raw = payload?.pagination ?? payload?.meta ?? {}
  const total = payload?.total ?? raw.total ?? raw.totalCount ?? rowsLength
  const pageLimit = raw.limit ?? raw.pageSize ?? limit
  const currentPage = raw.page ?? raw.currentPage ?? page
  const totalPages =
    raw.totalPages ??
    raw.pageCount ??
    Math.max(1, Math.ceil(Number(total) / Number(pageLimit)))

  return {
    page: Number(currentPage),
    limit: Number(pageLimit),
    total: Number(total),
    totalPages: Number(totalPages),
  }
}

export function isConversationsApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function buildInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function formatConversationListTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return 'YESTERDAY'
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
  if (diffDays < 7) {
    return date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()
  }

  return date
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    .toUpperCase()
}

export function formatMessageTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function mapApiConversationToChat(conversation) {
  const customer = conversation.customer ?? {}
  const job = conversation.job ?? null
  const lastMessage = conversation.lastMessage ?? null

  return {
    id: conversation.id,
    conversationId: conversation.id,
    customerId: conversation.customerId ?? customer.id ?? null,
    jobId: conversation.jobId ?? job?.id ?? null,
    name: customer.fullName || customer.firstName || 'Customer',
    subject: job?.title || job?.jobCode || null,
    lastMessage: lastMessage?.content ?? '',
    time: formatConversationListTime(
      conversation.lastMessageAt ?? conversation.createdAt,
    ),
    unreadCount: conversation.unreadCount ?? 0,
    initials: buildInitials(customer.fullName || customer.firstName || 'Customer'),
    avatar: customer.profileImage ?? null,
    online: false,
    lastMessageAt: conversation.lastMessageAt ?? conversation.createdAt ?? null,
  }
}

export function mapApiConversationToCustomerChat(conversation) {
  const tradesman = conversation.tradesman ?? conversation.otherParty ?? {}
  const profile = tradesman.tradesmanProfile ?? {}
  const job = conversation.job ?? null
  const lastMessage = conversation.lastMessage ?? null
  const name =
    tradesman.fullName ||
    profile.businessName ||
    tradesman.firstName ||
    'Tradesman'

  return {
    id: conversation.id,
    conversationId: conversation.id,
    tradesmanId: conversation.tradesmanId ?? tradesman.id ?? null,
    jobId: conversation.jobId ?? job?.id ?? null,
    name,
    subject: job?.title || job?.jobCode || null,
    lastMessage: lastMessage?.content ?? '',
    time: formatConversationListTime(
      conversation.lastMessageAt ?? conversation.createdAt,
    ),
    unreadCount: conversation.unreadCount ?? 0,
    initials: buildInitials(name),
    avatar: tradesman.profileImage ?? null,
    online: false,
    lastMessageAt: conversation.lastMessageAt ?? conversation.createdAt ?? null,
  }
}

export function mapApiMessageToUi(message, currentUserId) {
  const senderId = message.senderId ?? message.sender?.id ?? null

  return {
    id: message.id,
    sender: senderId && currentUserId && senderId === currentUserId ? 'me' : 'them',
    text: message.content ?? message.text ?? '',
    time: formatMessageTime(message.createdAt),
    read: message.isRead ?? senderId === currentUserId,
    senderId,
    createdAt: message.createdAt ?? null,
  }
}

export function findConversationMatch(conversations, { customerId, jobId } = {}) {
  if (!customerId) return null

  const matches = conversations.filter(
    (conversation) => conversation.customerId === customerId,
  )

  if (!matches.length) return null

  if (jobId) {
    const jobMatch = matches.find((conversation) => conversation.jobId === jobId)
    if (jobMatch) return jobMatch
  }

  return [...matches].sort((left, right) => {
    const leftTime = new Date(left.lastMessageAt ?? left.createdAt ?? 0).getTime()
    const rightTime = new Date(right.lastMessageAt ?? right.createdAt ?? 0).getTime()
    return rightTime - leftTime
  })[0]
}

export function findCustomerConversationMatch(conversations, { tradesmanId, jobId } = {}) {
  if (!tradesmanId) return null

  const matches = conversations.filter(
    (conversation) => conversation.tradesmanId === tradesmanId,
  )

  if (!matches.length) return null

  if (jobId) {
    const jobMatch = matches.find((conversation) => conversation.jobId === jobId)
    if (jobMatch) return jobMatch
  }

  return [...matches].sort((left, right) => {
    const leftTime = new Date(left.lastMessageAt ?? left.createdAt ?? 0).getTime()
    const rightTime = new Date(right.lastMessageAt ?? right.createdAt ?? 0).getTime()
    return rightTime - leftTime
  })[0]
}

export async function fetchConversations({
  page = 1,
  limit = CONVERSATIONS_PAGE_SIZE,
} = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/conversations?${params.toString()}`, {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []
  const pagination = normalizePagination(payload, { page, limit, rowsLength: rows.length })

  return {
    conversations: rows,
    pagination,
  }
}

export async function createConversation({ customerId, jobId = null }) {
  if (!customerId) {
    throw new Error('Customer is required to start a conversation.')
  }

  const body = { customerId }
  if (jobId) body.jobId = jobId

  const payload = await apiRequest('/api/conversations', {
    method: 'POST',
    body,
    token: getAccessToken(),
  })

  const conversation = payload?.data ?? payload
  if (!conversation?.id) {
    throw new Error('Unable to start conversation.')
  }

  return conversation
}

export async function createCustomerConversation({ tradesmanId, jobId = null }) {
  if (!tradesmanId) {
    throw new Error('Tradesman is required to start a conversation.')
  }

  const body = { tradesmanId }
  if (jobId) body.jobId = jobId

  const payload = await apiRequest('/api/conversations', {
    method: 'POST',
    body,
    token: getAccessToken(),
  })

  const conversation = payload?.data ?? payload
  if (!conversation?.id) {
    throw new Error('Unable to start conversation.')
  }

  return conversation
}

export async function fetchConversation(conversationId) {
  if (!conversationId) {
    throw new Error('Conversation not found.')
  }

  const payload = await apiRequest(
    `/api/conversations/${encodeURIComponent(conversationId)}`,
    { token: getAccessToken() },
  )

  const conversation = payload?.data ?? payload
  if (!conversation?.id) {
    throw new Error('Conversation not found.')
  }

  return conversation
}

export async function fetchConversationMessages(
  conversationId,
  { page = 1, limit = MESSAGES_PAGE_SIZE } = {},
) {
  if (!conversationId) {
    throw new Error('Conversation not found.')
  }

  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(
    `/api/conversations/${encodeURIComponent(conversationId)}/messages?${params.toString()}`,
    { token: getAccessToken() },
  )

  const rows = payload?.data ?? []
  const pagination = normalizePagination(payload, { page, limit, rowsLength: rows.length })

  return {
    messages: rows,
    pagination,
  }
}

export async function sendConversationMessage(conversationId, content) {
  const value = String(content ?? '').trim()
  if (!conversationId) {
    throw new Error('Conversation not found.')
  }
  if (!value) {
    throw new Error('Message cannot be empty.')
  }

  const payload = await apiRequest(
    `/api/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: 'POST',
      body: { content: value },
      token: getAccessToken(),
    },
  )

  const message = payload?.data ?? payload
  if (!message?.id && !message?.content) {
    throw new Error('Unable to send message.')
  }

  return message
}

export async function markConversationRead(conversationId) {
  if (!conversationId) return null

  const payload = await apiRequest(
    `/api/conversations/${encodeURIComponent(conversationId)}/read`,
    {
      method: 'PATCH',
      token: getAccessToken(),
    },
  )

  return payload?.data ?? payload
}
