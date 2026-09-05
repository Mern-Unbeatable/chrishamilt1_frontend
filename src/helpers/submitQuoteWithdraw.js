import { AUTH_CONFIG } from '@/auth/authConfig'
import { withdrawQuote } from '@/services/tradesmanQuotesApi'
import {
  showApiErrorFromError,
  showConfirmAlert,
  showSuccessAlert,
} from '@/helpers/showAppAlert'

export async function submitQuoteWithdraw(quoteId, { existingQuote } = {}) {
  const confirmation = await showConfirmAlert({
    title: 'Withdraw quote?',
    text: 'This quote will no longer be visible to the customer.',
    confirmButtonText: 'Withdraw',
  })

  if (!confirmation.isConfirmed) return null

  if (!AUTH_CONFIG.apiBaseUrl) {
    await showSuccessAlert({
      title: 'Quote withdrawn',
      text: 'Quote withdrawal is simulated in demo mode.',
    })

    if (!existingQuote) {
      return { id: quoteId, status: 'Withdrawn', statusVariant: 'withdrawn' }
    }

    return {
      ...existingQuote,
      status: 'Withdrawn',
      statusVariant: 'withdrawn',
    }
  }

  try {
    const updated = await withdrawQuote(quoteId)

    await showSuccessAlert({
      title: 'Quote withdrawn',
      text: 'Your quote has been withdrawn successfully.',
    })

    return existingQuote
      ? { ...existingQuote, ...updated }
      : updated
  } catch (err) {
    await showApiErrorFromError(err, 'Unable to withdraw quote')
    return null
  }
}
