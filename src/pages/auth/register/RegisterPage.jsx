import { Link, Navigate, useSearchParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { registerImage } from '@/assets/authImages'
import AuthHeroImage from '@/components/auth/AuthHeroImage'

const VALID_ROLES = new Set(['customer', 'tradesman'])

const INPUT_CLASS =
  'h-12 w-full rounded-lg border-0 bg-[#EBF2FF] px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:ring-2 focus:ring-btn-primary/20'

const FIELDS = [
  {
    id: 'fullName',
    label: 'Full Name',
    type: 'text',
    autoComplete: 'name',
    placeholder: 'Enter your full name',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'Enter your email..',
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: 'tel',
    autoComplete: 'tel',
    placeholder: 'Enter your Phone number..',
  },
  {
    id: 'address',
    label: 'Address',
    type: 'text',
    autoComplete: 'street-address',
    placeholder: 'Enter your Phone number..',
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'new-password',
    placeholder: 'write a strong password',
  },
]

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role')

  if (!role || !VALID_ROLES.has(role)) {
    return <Navigate to="/auth/signup" replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const roleLabel = role === 'tradesman' ? 'Tradesman' : 'Customer'

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <Link
        to="/"
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
            {FIELDS.map((field) => (
              <div key={field.id} className="space-y-2">
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-[#374151]"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  className={INPUT_CLASS}
                />
              </div>
            ))}

            <button
              type="submit"
              className="!mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-btn-primary text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#0150CC]"
            >
              Sign UP
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#64748B]">
            Already Have an account{' '}
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
