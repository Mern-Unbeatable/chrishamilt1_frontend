import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, ArrowRight, Mail, CheckCircle2, KeyRound, Lock, Eye, EyeOff } from 'lucide-react'
import { loginImage } from '@/assets/authImages'
import AuthHeroImage from '@/components/auth/AuthHeroImage'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Reset Password, 4: Success
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSendEmail = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (!response.ok) {
        throw new Error('Failed to send reset email. Please try again.')
      }
      
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      
      if (!response.ok) {
        throw new Error('Invalid OTP. Please check your email and try again.')
      }
      
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, confirmPassword })
      })
      
      if (!response.ok) {
        throw new Error('Failed to reset password. Please try again.')
      }
      
      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <Link
        to="/auth/login"
        className="fixed top-5 right-6 z-50 flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ArrowLeft className="size-4" />
        Back to Login
      </Link>
      <AuthHeroImage src={loginImage} />

      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-[400px]">
          
          {error && (
            <div className="mb-6 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div className="text-center">
                <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:text-[2.125rem]">
                  Forgot Password?
                </h1>
                <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-[#64748B] sm:text-[15px]">
                  No worries, we'll send you an OTP to reset your password.
                </p>
              </div>

              <form className="mt-10 space-y-5" onSubmit={handleSendEmail}>
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
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="h-12 w-full rounded-lg border border-[#E2E8F0] bg-white pr-4 pl-11 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending OTP…' : 'Send OTP'}
                  <ArrowRight className="size-4" strokeWidth={2.25} />
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50 mb-4">
                  <KeyRound className="size-6 text-btn-primary" />
                </div>
                <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:text-[2.125rem]">
                  Enter OTP
                </h1>
                <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-[#64748B] sm:text-[15px]">
                  We sent a code to <span className="font-medium text-[#111827]">{email}</span>.
                </p>
              </div>

              <form className="mt-10 space-y-5" onSubmit={handleVerifyOtp}>
                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-sm font-medium text-[#64748B]">
                    Verification Code
                  </label>
                  <div className="relative">
                    <input
                      id="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
                      placeholder="Enter OTP"
                      className="h-12 w-full text-center tracking-widest text-xl rounded-lg border border-[#E2E8F0] bg-white px-4 text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] placeholder:tracking-normal placeholder:text-sm focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !otp}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Verifying…' : 'Verify Code'}
                  <ArrowRight className="size-4" strokeWidth={2.25} />
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-sm font-medium text-btn-primary hover:underline"
                >
                  Change email
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center">
                <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:text-[2.125rem]">
                  Set New Password
                </h1>
                <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-[#64748B] sm:text-[15px]">
                  Your new password must be different from previous used passwords.
                </p>
              </div>

              <form className="mt-10 space-y-5" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-[#64748B]">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#94A3B8]"
                      strokeWidth={1.75}
                    />
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="••••••••"
                      className="h-12 w-full rounded-lg border border-[#E2E8F0] bg-white pr-11 pl-11 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#64748B]"
                    >
                      {showPassword ? (
                        <EyeOff className="size-[18px]" strokeWidth={1.75} />
                      ) : (
                        <Eye className="size-[18px]" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#64748B]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#94A3B8]"
                      strokeWidth={1.75}
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="••••••••"
                      className="h-12 w-full rounded-lg border border-[#E2E8F0] bg-white pr-11 pl-11 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#64748B]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-[18px]" strokeWidth={1.75} />
                      ) : (
                        <Eye className="size-[18px]" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !newPassword || !confirmPassword}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Resetting…' : 'Reset Password'}
                  <ArrowRight className="size-4" strokeWidth={2.25} />
                </button>
              </form>
            </>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:text-[2.125rem]">
                Password Reset
              </h1>
              <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-[#64748B] sm:text-[15px]">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Link
                to="/auth/login"
                className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
              >
                Go to Log In
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
