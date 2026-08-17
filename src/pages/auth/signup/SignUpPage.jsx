import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Building2, ArrowLeft, User } from 'lucide-react'
import { registerImage } from '@/assets/authImages'
import AuthHeroImage from '@/components/auth/AuthHeroImage'
import Logo from '@/components/Logo'
import { cn } from '@/helpers/cn'

const ROLES = [
  {
    id: 'customer',
    title: "I'm a Customer",
    description: 'Find and connect with businesses.',
    icon: User,
  },
  {
    id: 'tradesman',
    title: "I'm a Tradesman",
    description: 'Grow your business and reach more customers',
    icon: Building2,
  },
]

export default function SignUpPage() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('customer')

  const handleContinue = (roleId) => {
    setSelectedRole(roleId)
    navigate(`/auth/register?role=${roleId}`)
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
      <AuthHeroImage src={registerImage} />

      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-[420px]">
          <div className="flex flex-col items-center text-center">
            <Logo className="justify-center" />
            <p className="mt-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
              <span className="h-px w-8 bg-[#CBD5E1]" />
              We make it happen
              <span className="h-px w-8 bg-[#CBD5E1]" />
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {ROLES.map((role) => {
              const Icon = role.icon
              const isSelected = selectedRole === role.id

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleContinue(role.id)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-colors sm:p-6',
                    isSelected
                      ? 'border-btn-primary bg-[#EAF2FE]'
                      : 'border-[#E5E7EB] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]',
                  )}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-btn-primary text-white">
                    <Icon className="size-5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        'block text-base font-bold sm:text-lg',
                        isSelected ? 'text-btn-primary' : 'text-[#111827]',
                      )}
                    >
                      {role.title}
                    </span>
                    <span
                      className={cn(
                        'mt-1 block text-sm leading-6',
                        isSelected ? 'text-[#2563EB]/80' : 'text-[#64748B]',
                      )}
                    >
                      {role.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

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
