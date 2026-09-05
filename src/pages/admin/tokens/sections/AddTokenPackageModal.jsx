import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { formatTokenRate } from '@/data/adminTokenData'

const EMPTY_FORM = {
  planName: '',
  price: '',
  tokens: '',
  description: '',
  featured: false,
  badgeLabel: 'Most popular',
  stripePriceId: '',
}

const STRIPE_PRICE_ID_PATTERN = /^price_[A-Za-z0-9]+$/

function sanitizePriceInput(value = '') {
  const cleaned = String(value).replace(/[^\d.]/g, '')
  const [whole = '', ...rest] = cleaned.split('.')
  if (!rest.length) return whole

  return `${whole}.${rest.join('').slice(0, 2)}`
}

function normalizePriceForForm(value = '') {
  return sanitizePriceInput(String(value).replace(/£/g, ''))
}

export default function AddTokenPackageModal({
  open,
  onClose,
  onSave,
  initialPackage = null,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const isEditing = Boolean(initialPackage)

  useEffect(() => {
    if (!open) return undefined

    setForm(
      initialPackage
        ? {
            planName: initialPackage.planName,
            price: normalizePriceForForm(initialPackage.price),
            tokens: String(initialPackage.tokens),
            description: initialPackage.description,
            featured: Boolean(initialPackage.featured),
            badgeLabel: initialPackage.badgeLabel || 'Most popular',
            stripePriceId: initialPackage.stripePriceId ?? '',
          }
        : EMPTY_FORM,
    )
    setError('')
    setSaving(false)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose, initialPackage])

  if (!open) return null

  const canSave =
    form.planName.trim() &&
    form.price.trim() &&
    Number(form.price) > 0 &&
    form.tokens.trim() &&
    form.description.trim()

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    if (error) setError('')
  }

  const handlePriceChange = (event) => {
    setForm((current) => ({ ...current, price: sanitizePriceInput(event.target.value) }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const tokens = Number(form.tokens)
    if (!Number.isFinite(tokens) || tokens <= 0) {
      setError('Token quantity must be a positive number.')
      return
    }

    const priceValue = Number(form.price)
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      setError('Price must be a positive number.')
      return
    }

    const stripePriceId = form.stripePriceId.trim()
    if (stripePriceId && !STRIPE_PRICE_ID_PATTERN.test(stripePriceId)) {
      setError('Stripe Price ID must look like price_1UBSnvPc4Do23EYoZc37LZnO.')
      return
    }

    const price = `£${priceValue}`

    setSaving(true)

    try {
      const result = await onSave?.({
        planName: form.planName.trim(),
        price,
        tokens,
        description: form.description.trim(),
        featured: form.featured,
        badgeLabel: form.featured ? form.badgeLabel.trim() || 'Most popular' : undefined,
        stripePriceId,
        rateLabel: formatTokenRate(price, tokens),
      })

      if (result?.ok) {
        onClose?.()
        return
      }

      setError(result?.error ?? 'Unable to save package.')
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close package dialog"
        className="absolute inset-0 bg-[#111827]/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="token-package-title"
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl"
      >
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#EF4444]">
                Package configuration
              </p>
              <h2 id="token-package-title" className="mt-1 text-lg font-semibold text-[#111827]">
                {isEditing ? 'Edit Package' : 'Add Packages'}
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Update the required details for this format.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-[#111827]">
                Package name<span className="text-[#EF4444]">*</span>
              </span>
              <input
                type="text"
                value={form.planName}
                onChange={handleChange('planName')}
                placeholder="Professional"
                className="mt-2 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#111827]">
                Price<span className="text-[#EF4444]">*</span>
              </span>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-[#64748B]">
                  £
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.price}
                  onChange={handlePriceChange}
                  placeholder="120"
                  className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white py-0 pr-4 pl-8 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                />
              </div>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-[#111827]">
              Token Quantity<span className="text-[#EF4444]">*</span>
            </span>
            <input
              type="number"
              min="1"
              value={form.tokens}
              onChange={handleChange('tokens')}
              placeholder="500"
              className="mt-2 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-[#111827]">
              Description<span className="text-[#EF4444]">*</span>
            </span>
            <textarea
              value={form.description}
              onChange={handleChange('description')}
              rows={4}
              placeholder="Best choice for growing businesses purchasing leads regularly."
              className="mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-[#111827]">Stripe Price ID</span>
            <input
              type="text"
              value={form.stripePriceId}
              onChange={handleChange('stripePriceId')}
              placeholder="price_1UBSnvPc4Do23EYoZc37LZnO"
              pattern="price_[A-Za-z0-9]+"
              className="mt-2 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
            <span className="mt-1 block text-xs text-[#64748B]">
              Optional. Must start with <code className="text-[#111827]">price_</code> when provided.
            </span>
          </label>

          <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => {
                  setForm((current) => ({ ...current, featured: event.target.checked }))
                  if (error) setError('')
                }}
                className="mt-0.5 size-4 rounded border-[#CBD5E1] text-btn-primary focus:ring-btn-primary/20"
              />
              <span>
                <span className="block text-sm font-medium text-[#111827]">
                  Mark as popular package
                </span>
                <span className="mt-1 block text-xs text-[#64748B]">
                  Highlights this card with a badge for tradesmen on the wallet page.
                </span>
              </span>
            </label>

            {form.featured ? (
              <label className="mt-4 block">
                <span className="text-sm font-medium text-[#111827]">Popular badge label</span>
                <input
                  type="text"
                  value={form.badgeLabel}
                  onChange={handleChange('badgeLabel')}
                  placeholder="Most popular"
                  className="mt-2 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                />
              </label>
            ) : null}
          </div>

          {error ? <p className="mt-4 text-sm text-[#DC2626]">{error}</p> : null}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave || saving}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-btn-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
