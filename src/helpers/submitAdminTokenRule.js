import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  buildTokenRulePayload,
  createAdminTokenRule,
  deleteAdminTokenRule,
  fetchAdminTokenRules,
  updateAdminTokenRule,
} from '@/services/adminTokenRulesApi'
import {
  showApiErrorFromError,
  showConfirmAlert,
  showSuccessAlert,
} from '@/helpers/showAppAlert'

export async function submitAdminTokenRuleSave(values, { ruleId } = {}) {
  const payload = buildTokenRulePayload(values, Boolean(ruleId))

  try {
    if (ruleId) {
      await updateAdminTokenRule(ruleId, payload)
    } else {
      await createAdminTokenRule(payload)
    }

    const result = await fetchAdminTokenRules()

    await showSuccessAlert({
      title: ruleId ? 'Rule updated' : 'Rule created',
      text: ruleId
        ? 'Token rule details have been saved.'
        : 'The new token rule is now active.',
    })

    return { ok: true, rules: result.rules }
  } catch (err) {
    await showApiErrorFromError(
      err,
      ruleId ? 'Unable to update rule' : 'Unable to create rule',
    )
    return { ok: false, error: err?.message || 'Unable to save rule.' }
  }
}

export async function submitAdminTokenRuleDelete(ruleId, ruleLabel) {
  const confirmation = await showConfirmAlert({
    title: 'Delete rule?',
    text: `"${ruleLabel}" rule will be permanently removed.`,
    confirmButtonText: 'Delete rule',
    cancelButtonText: 'Keep rule',
  })

  if (!confirmation.isConfirmed) {
    return { ok: false, cancelled: true }
  }

  if (AUTH_CONFIG.useDemoAuth) {
    return { ok: true, rules: null }
  }

  try {
    await deleteAdminTokenRule(ruleId)
    const result = await fetchAdminTokenRules()

    await showSuccessAlert({
      title: 'Rule deleted',
      text: 'The token rule has been removed.',
    })

    return { ok: true, rules: result.rules }
  } catch (err) {
    await showApiErrorFromError(err, 'Unable to delete rule')
    return { ok: false, error: err?.message || 'Unable to delete rule.' }
  }
}

