import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'

export function isUserReviewsApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function validateReviewPayload({ jobId, rating, comment } = {}) {
  if (!jobId) {
    return 'Job is required to submit a review.'
  }

  const ratingValue = Number(rating)
  if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    return 'Please choose a rating between 1 and 5 stars.'
  }

  const text = String(comment ?? '').trim()
  if (text.length < 10) {
    return 'Please write at least 10 characters about your experience.'
  }

  if (text.length > 2000) {
    return 'Review comment must be 2000 characters or fewer.'
  }

  return ''
}

/**
 * Resolve whether the current customer already reviewed this job.
 * Works with newer APIs (`/job/:id/me`) and falls back to public tradesman reviews.
 */
export async function checkJobReviewed({
  jobId,
  tradesmanId,
  reviewerId,
} = {}) {
  if (!jobId) return false

  try {
    const payload = await apiRequest(
      `/api/reviews/job/${encodeURIComponent(jobId)}/me`,
      { token: getAccessToken() },
    )
    const data = payload?.data ?? payload
    if (typeof data?.hasReviewed === 'boolean') {
      return data.hasReviewed
    }
  } catch {
    // Older backends may not expose this route yet.
  }

  if (!tradesmanId) return false

  try {
    const payload = await apiRequest(
      `/api/reviews/tradesman/${encodeURIComponent(tradesmanId)}?page=1&limit=50`,
    )
    const reviews = payload?.data?.reviews ?? []
    return reviews.some((review) => {
      const sameJob =
        review.jobId === jobId ||
        review.job?.id === jobId
      if (!sameJob) return false

      if (!reviewerId) return true

      return (
        review.reviewerId === reviewerId ||
        review.reviewer?.id === reviewerId
      )
    })
  } catch {
    return false
  }
}

export async function submitJobReview({ jobId, rating, comment }) {
  const validationError = validateReviewPayload({ jobId, rating, comment })
  if (validationError) {
    throw new Error(validationError)
  }

  const payload = await apiRequest('/api/reviews', {
    method: 'POST',
    token: getAccessToken(),
    body: {
      jobId,
      rating: Number(rating),
      comment: String(comment ?? '').trim(),
    },
  })

  const review = payload?.data ?? payload
  if (!review?.id) {
    throw new Error('Review was not saved. Please try again.')
  }

  return review
}
