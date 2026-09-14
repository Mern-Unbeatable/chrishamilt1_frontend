import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const THEME = {
  primary: '#0160F2',
  primaryHover: '#0150CC',
  text: '#111827',
  muted: '#64748B',
}

const FIELD_LABELS = {
  categoryId: 'Job category',
  title: 'Title',
  description: 'Description',
  location: 'Location',
  city: 'City',
  budgetMin: 'Minimum budget',
  budgetMax: 'Maximum budget',
  urgency: 'Urgency',
  preferredStart: 'Preferred start',
  completionBy: 'Completion by',
  specialNotes: 'Special notes',
  requirements: 'Requirements',
  images: 'Photos',
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatFieldLabel(field) {
  if (!field) return 'Field'
  return FIELD_LABELS[field] ?? field.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())
}

export function formatApiValidationErrors(errors = []) {
  if (!Array.isArray(errors) || !errors.length) return ''

  const items = errors.map((item) => {
    if (typeof item === 'string') return `<li>${escapeHtml(item)}</li>`

    const label = formatFieldLabel(item.field)
    const message = item.message || item.msg || 'Invalid value'

    return `<li><span style="color:${THEME.text};font-weight:600;">${escapeHtml(label)}</span><br /><span style="color:${THEME.muted};">${escapeHtml(message)}</span></li>`
  })

  return `<ul style="margin:0;padding-left:1.1rem;text-align:left;">${items.join('')}</ul>`
}

export function getApiErrorContent(payload, fallbackTitle = 'Something went wrong') {
  if (!payload || typeof payload !== 'string' && typeof payload !== 'object') {
    return { title: fallbackTitle, html: escapeHtml(fallbackTitle) }
  }

  if (typeof payload === 'string') {
    return { title: fallbackTitle, html: escapeHtml(payload) }
  }

  const title = payload.message || payload.error || fallbackTitle
  const validationHtml = formatApiValidationErrors(payload.errors)

  if (validationHtml) {
    return { title, html: validationHtml }
  }

  return {
    title,
    html: escapeHtml(
      payload.detail ||
        payload.errors?.[0]?.message ||
        title,
    ),
  }
}

function fireThemedAlert({ icon, title, html, text, confirmButtonText = 'OK' }) {
  return Swal.fire({
    icon,
    title,
    html,
    text: html ? undefined : text,
    confirmButtonText,
    confirmButtonColor: THEME.primary,
    buttonsStyling: true,
    customClass: {
      popup: 'app-swal-popup',
      title: 'app-swal-title',
      htmlContainer: 'app-swal-html',
      confirmButton: 'app-swal-confirm',
    },
  })
}

export function showErrorAlert({ title = 'Something went wrong', text, html }) {
  return fireThemedAlert({ icon: 'error', title, text, html })
}

export function showSuccessAlert({ title = 'Success', text, html, confirmButtonText = 'OK' }) {
  return fireThemedAlert({ icon: 'success', title, text, html, confirmButtonText })
}

export function showConfirmAlert({
  title,
  text,
  html,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  icon = 'warning',
}) {
  return Swal.fire({
    icon,
    title,
    text,
    html,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: THEME.primary,
    cancelButtonColor: '#94A3B8',
    reverseButtons: true,
    customClass: {
      popup: 'app-swal-popup',
      title: 'app-swal-title',
      htmlContainer: 'app-swal-html',
      confirmButton: 'app-swal-confirm',
      cancelButton: 'app-swal-cancel',
    },
  })
}

export function showBuyTokensRequiredAlert({
  availableTokens = 0,
  requiredTokens = 1,
} = {}) {
  return Swal.fire({
    icon: 'warning',
    title: 'Tokens required',
    html: `
      <p style="margin:0 0 1rem;color:#1F2937;font-size:0.95rem;line-height:1.55;font-weight:500;">
        You need more tokens before you can submit a new quote.
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin:0 0 1rem;">
        <div style="padding:0.85rem 0.75rem;border-radius:0.75rem;background:#F3F4F6;border:1px solid #E5E7EB;text-align:center;">
          <div style="font-size:0.75rem;font-weight:600;letter-spacing:0.02em;text-transform:uppercase;color:#4B5563;">Available</div>
          <div style="margin-top:0.35rem;font-size:1.5rem;font-weight:700;color:#111827;line-height:1;">${escapeHtml(String(availableTokens))}</div>
        </div>
        <div style="padding:0.85rem 0.75rem;border-radius:0.75rem;background:#EFF6FF;border:1px solid #BFDBFE;text-align:center;">
          <div style="font-size:0.75rem;font-weight:600;letter-spacing:0.02em;text-transform:uppercase;color:#1D4ED8;">Required</div>
          <div style="margin-top:0.35rem;font-size:1.5rem;font-weight:700;color:#0160F2;line-height:1;">${escapeHtml(String(requiredTokens))}</div>
        </div>
      </div>
      <p style="margin:0;color:#374151;font-size:0.875rem;line-height:1.55;">
        Existing jobs stay available — you can still update their status. Only new quotes are locked.
      </p>
    `,
    showCancelButton: true,
    confirmButtonText: 'Buy tokens',
    cancelButtonText: 'Not now',
    confirmButtonColor: THEME.primary,
    reverseButtons: true,
    focusConfirm: true,
    customClass: {
      popup: 'app-swal-popup app-swal-popup--tokens',
      title: 'app-swal-title',
      htmlContainer: 'app-swal-html app-swal-html--tokens',
      confirmButton: 'app-swal-confirm',
      cancelButton: 'app-swal-cancel app-swal-cancel--outline',
      actions: 'app-swal-actions',
    },
  })
}

export function showApiErrorAlert(payload, fallbackTitle = 'Request failed') {
  const content = getApiErrorContent(payload, fallbackTitle)
  return showErrorAlert(content)
}

export function showApiErrorFromError(error, fallbackTitle = 'Request failed') {
  if (error?.payload) {
    return showApiErrorAlert(error.payload, fallbackTitle)
  }

  return showErrorAlert({
    title: fallbackTitle,
    text: error?.message || 'Something went wrong. Please try again.',
  })
}
