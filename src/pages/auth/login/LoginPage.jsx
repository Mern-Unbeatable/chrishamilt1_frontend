import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ArrowRight, ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { loginImage } from '@/assets/authImages'
import AuthHeroImage from '@/components/auth/AuthHeroImage'
import { useAuth } from '@/auth/AuthProvider'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { getRememberMePreference } from '@/auth/authStorage'
import { getDashboardHome } from '@/auth/authService'
import { getTradesmanHomePath, hasTradesmanSubscription } from '@/auth/tradesmanSubscription'
import { DEMO_CREDENTIALS } from '@/auth/demoAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState(() =>
    AUTH_CONFIG.useDemoAuth ? DEMO_CREDENTIALS.user.email : '',
  )
  const [password, setPassword] = useState(() =>
    AUTH_CONFIG.useDemoAuth ? DEMO_CREDENTIALS.user.password : '',
  )
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(() => getRememberMePreference())
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loginAs = async (nextEmail, nextPassword) => {
    setIsSubmitting(true)
    setError('')

    try {
      const user = await login(nextEmail, nextPassword, { rememberMe })

      if (user.role === 'user') {
        const redirectTo = location.state?.from || '/'
        navigate(redirectTo, { replace: true })
        return
      }

      if (user.role === 'tradesman') {
        if (!hasTradesmanSubscription(user.email)) {
          navigate('/tradesman/choose-plan', { replace: true })
          return
        }

        const fallback = getTradesmanHomePath(user.email)
        const redirectTo = location.state?.from || fallback
        navigate(redirectTo.startsWith('/tradesman') ? redirectTo : fallback, {
          replace: true,
        })
        return
      }

      const fallback = getDashboardHome(user.role)
      const redirectTo = location.state?.from || fallback
      navigate(redirectTo.startsWith(`/${user.role}`) ? redirectTo : fallback, {
        replace: true,
      })
    } catch (err) {
      setError(
        err?.message ||
          (AUTH_CONFIG.useDemoAuth
            ? 'Invalid email or password. Use the demo credentials below.'
            : 'Invalid email or password.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await loginAs(email, password)
  }

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <Link
        to="/"
        className="fixed top-5 right-6 z-50 flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <AuthHeroImage src={loginImage} />

      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-[400px]">
          <div className="text-center">
            <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:text-[2.125rem]">
              Welcome Back
            </h1>
            <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-[#64748B] sm:text-[15px]">
              Sign in to post jobs, message tradesmen, or access your dashboard.
            </p>
          </div>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            {error ? (
              <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {error}
              </p>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#64748B]">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#94A3B8]"
                  strokeWidth={1.75}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="h-12 w-full rounded-lg border border-[#E2E8F0] bg-white pr-4 pl-11 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className="block text-sm font-medium text-[#64748B]">
                  Password
                </label>
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-btn-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#94A3B8]"
                  strokeWidth={1.75}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-lg border border-[#E2E8F0] bg-white pr-11 pl-11 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#64748B]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="size-[18px]" strokeWidth={1.75} />
                  ) : (
                    <Eye className="size-[18px]" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="size-4 rounded border-[#CBD5E1] text-btn-primary focus:ring-btn-primary/20"
              />
              <span className="text-sm text-[#64748B]">Remember me for 30 days</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </button>
          </form>

          {/* <div className="mt-8 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Demo login
            </p>
            <p className="mt-2 text-xs leading-5 text-[#64748B]">
              Password for all demo accounts: <strong>{DEMO_CREDENTIALS.user.password}</strong>
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {Object.values(DEMO_USERS).map((user) => (
                <button
                  key={user.role}
                  type="button"
                  onClick={() => loginAs(user.email, DEMO_CREDENTIALS[user.role].password)}
                  className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-left text-sm text-[#111827] transition-colors hover:border-btn-primary hover:text-btn-primary"
                >
                  {user.roleLabel}: {user.email}
                </button>
              ))}
            </div>
          </div> */}

          <p className="mt-8 text-center text-sm text-[#64748B]">
            Don&apos;t have an account?{' '}
            <Link
              to="/auth/signup"
              className="font-semibold text-btn-primary hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
