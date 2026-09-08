import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'

export function isUserReviewsApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export async function submitJobReview({ jobId, rating, comment }) {
  if (!jobId) {
    throw new Error('Job is required to submit a review.')
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

  return payload?.data ?? payload
}
