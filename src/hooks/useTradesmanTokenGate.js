import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { showApiErrorFromError, showBuyTokensRequiredAlert } from '@/helpers/showAppAlert'
import {
  fetchTradesmanAvailableTokens,
  resolveQuoteTokenCost,
} from '@/services/tradesmanWalletApi'

/**
 * Gates new-work actions (send quote) behind wallet balance.
 * Assigned-job status updates should not use this hook.
 */
export default function useTradesmanTokenGate() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(false)

  const promptBuyTokens = useCallback(
    async (available = 0, required = 1) => {
      const result = await showBuyTokensRequiredAlert({
        availableTokens: available,
        requiredTokens: required,
      })

      if (result.isConfirmed) {
        navigate('/tradesman/wallet')
      }
    },
    [navigate],
  )

  const requireTokensForAction = useCallback(
    async (jobOrCost = 1) => {
      const required = resolveQuoteTokenCost(jobOrCost)
      setChecking(true)

      try {
        const available = await fetchTradesmanAvailableTokens()
        if (available >= required) {
          return true
        }

        await promptBuyTokens(available, required)
        return false
      } catch (err) {
        await showApiErrorFromError(err, 'Unable to check token balance')
        return false
      } finally {
        setChecking(false)
      }
    },
    [promptBuyTokens],
  )

  return {
    checking,
    requireTokensForAction,
    promptBuyTokens,
  }
}
