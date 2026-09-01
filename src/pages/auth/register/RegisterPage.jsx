import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { registerImage } from '@/assets/authImages'
import AuthHeroImage from '@/components/auth/AuthHeroImage'
import { useAuth } from '@/auth/AuthProvider'
import { resolvePostAuthPath } from '@/auth/postAuthRedirect'

const VALID_ROLES = new Set(['customer', 'tradesman'])

const INPUT_CLASS =
  'h-12 w-full rounded-lg border-0 bg-[#EBF2FF] px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:ring-2 focus:ring-btn-primary/20'

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role')

  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!role || !VALID_ROLES.has(role)) {
    return <Navigate to="/auth/signup" replace />
  }

  const roleLabel = role === 'tradesman' ? 'Tradesman' : 'Customer'

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await register({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phone,
        address: form.address,
        password: form.password,
        role,
      })

      if (result.autoLogin && result.session) {
        navigate(resolvePostAuthPath(result.session), { replace: true })
        return
      }

      navigate('/auth/login', {
        replace: true,
        state: { registered: true, email: form.email.trim() },
      })
    } catch (err) {
      setError(err?.message || 'Unable to create your account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <Link
        to="/auth/signup"
        className="fixed top-5 right-6 z-50 flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <AuthHeroImage src={registerImage} />

      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-[400px]">
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:text-[2rem]">
            Create your Account
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">Signing up as {roleLabel}</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error ? (
              <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {error}
              </p>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-[#374151]">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={setField('fullName')}
                placeholder="Enter your full name"
                required
                className={INPUT_CLASS}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#374151]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={setField('email')}
                placeholder="Enter your email"
                required
                className={INPUT_CLASS}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-[#374151]">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={setField('phone')}
                placeholder="Enter your phone number"
                required
                className={INPUT_CLASS}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-[#374151]">
                Address
              </label>
              <input
                id="address"
                type="text"
                autoComplete="street-address"
                value={form.address}
                onChange={setField('address')}
                placeholder="Enter your address"
                required
                className={INPUT_CLASS}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#374151]">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={setField('password')}
                placeholder="Write a strong password"
                required
                minLength={6}
                className={INPUT_CLASS}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="!mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-btn-primary text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#64748B]">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-semibold text-btn-primary hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
