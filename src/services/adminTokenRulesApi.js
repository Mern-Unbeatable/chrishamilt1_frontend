import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { DEMO_ADMIN_TOKEN_RULES } from '@/data/adminTokenData'

export function isAdminTokenRulesApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

function unwrapRule(data) {
  const payload = data?.data ?? data
  return payload?.rule ?? payload
}

export function buildTokenRulePayload(
  {
    name,
    label,
    minBudget,
    maxBudget,
    tokenCost,
    isActive = true,
    status = 'Active',
  },
  isEdit = false,
) {
  const min = Number(minBudget ?? 0)
  const max =
    maxBudget === null || maxBudget === '' || maxBudget === undefined
      ? null
      : Number(maxBudget)

  const ruleName = (name || label || '').trim()

  const payload = {
    name: ruleName,
    minBudget: min,
    maxBudget: max,
    tokenCost: Number(tokenCost),
  }

  if (isEdit) {
    payload.isActive = Boolean(isActive ?? status === 'Active')
  }

  return payload
}

export function mapApiTokenRule(rule = {}) {
  const label = rule.label || rule.name || rule.budgetRange || 'Unnamed Rule'
  const min = Number(rule.minBudget ?? 0)
  const max =
    rule.maxBudget !== null && rule.maxBudget !== undefined && rule.maxBudget !== ''
      ? Number(rule.maxBudget)
      : null

  return {
    id: rule.id,
    label,
    name: rule.name || label,
    budgetRange: rule.budgetRange || label,
    minBudget: min,
    maxBudget: max,
    tokenCost: Number(rule.tokenCost ?? 0),
    description: rule.description || '',
    isActive: rule.isActive ?? true,
    status: rule.status || (rule.isActive ? 'Active' : 'Inactive'),
    createdAt: rule.createdAt,
    updatedAt: rule.updatedAt,
  }
}

export function getDemoAdminTokenRules() {
  return DEMO_ADMIN_TOKEN_RULES.map((rule) => ({ ...rule }))
}

export async function fetchAdminTokenRules() {
  const payload = await apiRequest('/api/admin/token-rules', {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []

  return {
    rules: rows.map(mapApiTokenRule),
    total: payload?.total ?? rows.length,
  }
}

export async function createAdminTokenRule(body) {
  const payload = await apiRequest('/api/admin/token-rules', {
    method: 'POST',
    body,
    token: getAccessToken(),
  })

  return mapApiTokenRule(unwrapRule(payload))
}

export async function updateAdminTokenRule(ruleId, body) {
  if (!ruleId) {
    throw new Error('Rule not found.')
  }

  const payload = await apiRequest(
    `/api/admin/token-rules/${encodeURIComponent(ruleId)}`,
    {
      method: 'PUT',
      body,
      token: getAccessToken(),
    },
  )

  return mapApiTokenRule(unwrapRule(payload))
}

export async function deleteAdminTokenRule(ruleId) {
  if (!ruleId) {
    throw new Error('Rule not found.')
  }

  await apiRequest(`/api/admin/token-rules/${encodeURIComponent(ruleId)}`, {
    method: 'DELETE',
    token: getAccessToken(),
  })
}

