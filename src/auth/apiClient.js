import { AUTH_CONFIG } from '@/auth/authConfig'

export class ApiError extends Error {
  constructor(message, { status = 0, payload = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export function buildApiUrl(path) {
  const base = AUTH_CONFIG.apiBaseUrl.replace(/\/$/, '')
  const endpoint = path.startsWith('/') ? path : `/${path}`
  return `${base}${endpoint}`
}

export async function parseJsonResponse(response) {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function getErrorMessage(payload, fallback = 'Something went wrong. Please try again.') {
  if (!payload) return fallback

  if (typeof payload === 'string') return payload

  if (Array.isArray(payload.errors) && payload.errors.length) {
    const details = payload.errors
      .map((item) => {
        if (typeof item === 'string') return item
        const field = item.field ? `${item.field}: ` : ''
        return `${field}${item.message || item.msg || 'Invalid value'}`
      })
      .join(' ')

    if (details) {
      return payload.message ? `${payload.message}. ${details}` : details
    }
  }

  return (
    payload.message ||
    payload.error ||
    payload.detail ||
    payload.errors?.[0]?.message ||
    fallback
  )
}

export async function apiRequest(path, { method = 'GET', body, token, headers = {} } = {}) {
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  const config = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  }

  if (body !== undefined) {
    if (body instanceof FormData) {
      config.body = body
    } else {
      requestHeaders['Content-Type'] = 'application/json'
      config.body = JSON.stringify(body)
    }
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(buildApiUrl(path), config)
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection and try again.')
  }

  const payload = await parseJsonResponse(response)

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload, 'Request failed. Please try again.'), {
      status: response.status,
      payload,
    })
  }

  return payload
}
