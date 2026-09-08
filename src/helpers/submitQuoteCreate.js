import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  submitJobQuote,
  validateQuoteForm,
} from '@/services/tradesmanQuotesApi'
import { showApiErrorFromError, showErrorAlert, showSuccessAlert } from '@/helpers/showAppAlert'

export async function submitQuoteCreate(jobId, form) {
  const validationError = validateQuoteForm(form)

  if (validationError) {
    await showErrorAlert({
      title: 'Invalid quote',
      text: validationError,
    })
    return null
  }

  if (!AUTH_CONFIG.apiBaseUrl) {
    await showSuccessAlert({
      title: 'Quote submitted',
      text: 'Quote submission is simulated in demo mode.',
    })

    return { id: `demo-quote-${Date.now()}` }
  }

  try {
    const created = await submitJobQuote(jobId, form)

    await showSuccessAlert({
      title: 'Quote submitted',
      text: 'Your quote has been sent to the customer.',
    })

    return created
  } catch (err) {
    await showApiErrorFromError(err, 'Unable to submit quote')
    return null
  }
}
