import { io } from 'socket.io-client'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { getAccessToken } from '@/auth/authService'

export const CHAT_SOCKET_EVENTS = {
  JOIN: 'conversation:join',
  LEAVE: 'conversation:leave',
  SEND: 'message:send',
  READ: 'message:read',
  NEW_MESSAGE: 'message:new',
  CONVERSATION_UPDATED: 'conversation:updated',
  ERROR: 'chat:error',
}

const INCOMING_MESSAGE_EVENTS = [CHAT_SOCKET_EVENTS.NEW_MESSAGE]

let socket = null
let activeToken = null
const listeners = new Set()

function notify(event, payload) {
  listeners.forEach((listener) => {
    try {
      listener(event, payload)
    } catch {
      // Ignore listener failures so one bad handler cannot break others.
    }
  })
}

function attachIncomingListeners(instance) {
  INCOMING_MESSAGE_EVENTS.forEach((eventName) => {
    instance.on(eventName, (payload) => {
      notify(CHAT_SOCKET_EVENTS.NEW_MESSAGE, payload)
    })
  })

  instance.on(CHAT_SOCKET_EVENTS.CONVERSATION_UPDATED, (payload) => {
    notify(CHAT_SOCKET_EVENTS.CONVERSATION_UPDATED, payload)
  })

  instance.on(CHAT_SOCKET_EVENTS.ERROR, (payload) => {
    notify(CHAT_SOCKET_EVENTS.ERROR, payload)
  })

  instance.on('connect', () => {
    notify('connect', { connected: true })
  })

  instance.on('disconnect', () => {
    notify('disconnect', { connected: false })
  })

  instance.on('connect_error', (error) => {
    notify('connect_error', { message: error?.message ?? 'Connection failed' })
  })
}

export function subscribeChatSocket(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getChatSocket() {
  return socket
}

export function isChatSocketConnected() {
  return Boolean(socket?.connected)
}

export function connectChatSocket() {
  if (!AUTH_CONFIG.apiBaseUrl) return null

  const token = getAccessToken()
  if (!token) return null

  if (socket && activeToken === token) {
    if (!socket.connected) socket.connect()
    return socket
  }

  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }

  activeToken = token
  socket = io(AUTH_CONFIG.apiBaseUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 1000,
    timeout: 10000,
  })

  attachIncomingListeners(socket)
  return socket
}

export function disconnectChatSocket() {
  if (!socket) return

  socket.removeAllListeners()
  socket.disconnect()
  socket = null
  activeToken = null
}

export function joinConversationRoom(conversationId) {
  if (!conversationId || !socket?.connected) return

  socket.emit(CHAT_SOCKET_EVENTS.JOIN, { conversationId })
}

export function leaveConversationRoom(conversationId) {
  if (!conversationId || !socket?.connected) return

  socket.emit(CHAT_SOCKET_EVENTS.LEAVE, { conversationId })
}

export function sendChatSocketMessage(conversationId, content) {
  const value = String(content ?? '').trim()
  if (!conversationId || !value || !socket?.connected) {
    return Promise.resolve(null)
  }

  const payload = { conversationId, content: value }

  return new Promise((resolve) => {
    socket.timeout(4000).emit(CHAT_SOCKET_EVENTS.SEND, payload, (error, response) => {
      if (error) {
        resolve(null)
        return
      }

      resolve(response?.data ?? response ?? null)
    })
  })
}
