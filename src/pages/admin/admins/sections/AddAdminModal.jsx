import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Eye, EyeOff, Loader2, ShieldCheck, X } from 'lucide-react'

export default function AddAdminModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    setForm({
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
    })
    setShowPassword(false)
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
  }, [open, onClose])

  if (!open) return null

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.fullName.trim()) {
      setError('Please provide a full name.')
      return
    }

    if (!form.email.trim() || !form.email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (!form.phoneNumber.trim()) {
      setError('Please provide a contact phone number.')
      return
    }

    if (!form.address.trim()) {
      setError('Please provide an address or location.')
      return
    }

    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const result = await onSave?.({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        password: form.password,
        role: 'ADMIN',
      })

      if (result?.ok) {
        onClose?.()
        return
      }

      setError(result?.error || 'Unable to create admin account.')
    } catch (err) {
      setError(err?.message || 'Unable to create admin account.')
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close admin dialog"
        className="absolute inset-0 bg-[#111827]/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-admin-modal-title"
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-btn-primary">
              <ShieldCheck className="size-5" />
            </span>
            <h2 id="add-admin-modal-title" className="text-lg font-semibold text-[#111827]">
              Create New Admin
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-4">
          {error ? (
            <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
              {error}
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Full Name <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={handleChange('fullName')}
              placeholder="e.g. Second Admin"
              className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Email Address <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange('email')}
              placeholder="e.g. admin2@tradersinloop.co.uk"
              className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Phone Number <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.phoneNumber}
              onChange={handleChange('phoneNumber')}
              placeholder="e.g. +44 7700 111333"
              className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Address <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.address}
              onChange={handleChange('address')}
              placeholder="e.g. London, UK"
              className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Password <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={handleChange('password')}
                placeholder="At least 6 characters"
                className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pr-10 pl-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#94A3B8] hover:text-[#111827]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827]">Role</label>
            <div className="mt-1.5 flex h-11 w-full items-center rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 text-sm font-semibold text-btn-primary">
              ADMIN (Full Administrative Access)
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-btn-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Admin'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
