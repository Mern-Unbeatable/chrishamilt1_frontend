import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  updateQuote,
  validateQuoteUpdateForm,
} from '@/services/tradesmanQuotesApi'
import { showApiErrorFromError, showErrorAlert, showSuccessAlert } from '@/helpers/showAppAlert'

export async function submitQuoteUpdate(quoteId, form, { existingQuote } = {}) {
  const validationError = validateQuoteUpdateForm(form)

  if (validationError) {
    await showErrorAlert({
      title: 'Invalid quote',
      text: validationError,
    })
    return null
  }

  if (!AUTH_CONFIG.apiBaseUrl) {
    await showSuccessAlert({
      title: 'Quote updated',
      text: 'Quote update is simulated in demo mode.',
    })

    if (!existingQuote) return { id: quoteId }

    const amount = Number(form.quoteAmount)

    return {
      ...existingQuote,
      amount: `£${amount.toLocaleString('en-GB')}`,
      amountValue: amount,
      duration: form.duration?.trim() ?? existingQuote.duration,
      startDateInput: form.startDate ?? existingQuote.startDateInput,
      materialsIncluded: Boolean(form.materialsIncluded),
      warranty: form.warranty?.trim() ?? '',
      description: form.proposal?.trim() ?? '',
      fullProposal: form.proposal?.trim() ?? '',
    }
  }

  try {
    const updated = await updateQuote(quoteId, form)

    await showSuccessAlert({
      title: 'Quote updated',
      text: 'Your quote has been saved.',
    })

    return updated
  } catch (err) {
    await showApiErrorFromError(err, 'Unable to update quote')
    return null
  }
}
