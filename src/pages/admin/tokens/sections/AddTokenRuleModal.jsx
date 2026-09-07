import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const EMPTY_FORM = {
  label: '',
  minBudget: '',
  maxBudget: '',
  tokenCost: '',
  isActive: true,
}

export default function AddTokenRuleModal({ open, onClose, onSave, initialRule = null }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEditing = Boolean(initialRule)

  useEffect(() => {
    if (!open) return undefined

    setForm(
      initialRule
        ? {
            label: initialRule.label || initialRule.name || '',
            minBudget: String(initialRule.minBudget ?? ''),
            maxBudget:
              initialRule.maxBudget === null || initialRule.maxBudget === undefined
                ? ''
                : String(initialRule.maxBudget),
            tokenCost: String(initialRule.tokenCost ?? ''),
            isActive: initialRule.isActive ?? (initialRule.status !== 'Inactive'),
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
  }, [open, onClose, initialRule])

  if (!open) return null

  const canSave = form.label.trim() && form.minBudget.trim() !== '' && form.tokenCost.trim()

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const minBudget = Number(form.minBudget)
    const maxBudget = form.maxBudget.trim() === '' ? null : Number(form.maxBudget)
    const tokenCost = Number(form.tokenCost)

    if (!Number.isFinite(minBudget) || minBudget < 0) {
      setError('Min budget must be zero or greater.')
      return
    }

    if (maxBudget !== null && (!Number.isFinite(maxBudget) || maxBudget < minBudget)) {
      setError('Max budget must be greater than or equal to min budget.')
      return
    }

    if (!Number.isFinite(tokenCost) || tokenCost <= 0) {
      setError('Token cost must be a positive number.')
      return
    }

    setSaving(true)

    try {
      const result = await onSave?.({
        name: form.label.trim(),
        label: form.label.trim(),
        minBudget,
        maxBudget,
        tokenCost,
        isActive: form.isActive,
        status: form.isActive ? 'Active' : 'Inactive',
      })

      if (result?.ok) {
        onClose?.()
        return
      }

      setError(result?.error ?? 'Unable to save rule.')
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close token rule dialog"
        className="absolute inset-0 bg-[#111827]/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="token-rule-title"
        className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2 id="token-rule-title" className="text-lg font-semibold text-[#111827]">
            {isEditing ? 'Edit Token Rule' : 'Create Token Rule'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Label
            </span>
            <input
              type="text"
              value={form.label}
              onChange={handleChange('label')}
              placeholder="Under £1,000"
              className="mt-2 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Min budget (£)
            </span>
            <input
              type="number"
              min="0"
              value={form.minBudget}
              onChange={handleChange('minBudget')}
              placeholder="0"
              className="mt-2 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Max budget (£)
            </span>
            <input
              type="number"
              min="0"
              value={form.maxBudget}
              onChange={handleChange('maxBudget')}
              placeholder="999 (leave blank for unlimited)"
              className="mt-2 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Token cost
            </span>
            <input
              type="number"
              min="1"
              value={form.tokenCost}
              onChange={handleChange('tokenCost')}
              placeholder="10"
              className="mt-2 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
          </label>

          {isEditing ? (
            <label className="mt-4 flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
              <div>
                <span className="text-sm font-semibold text-[#111827]">Active Rule</span>
                <p className="text-xs text-[#64748B]">Enable or disable this token rule</p>
              </div>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((current) => ({ ...current, isActive: e.target.checked }))
                }
                className="size-5 rounded border-[#CBD5E1] text-btn-primary focus:ring-btn-primary/20"
              />
            </label>
          ) : null}

          {error ? <p className="mt-4 text-sm text-[#DC2626]">{error}</p> : null}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-5 text-sm font-semibold text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave || saving}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-btn-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
