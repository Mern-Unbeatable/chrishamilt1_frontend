import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'
import {
  activateTradesmanSubscription,
  getTradesmanHomePath,
  hasTradesmanSubscription,
} from '@/auth/tradesmanSubscription'
import PricingHero from '@/pages/public/pricing/sections/PricingHero'
import PricingPlans from '@/pages/public/pricing/sections/PricingPlans'

export default function TradesmanChoosePlanPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const email = session?.email ?? ''

  useEffect(() => {
    if (hasTradesmanSubscription(email)) {
      navigate(getTradesmanHomePath(email), { replace: true })
    }
  }, [email, navigate])

  const handleSelectPlan = (plan) => {
    activateTradesmanSubscription(email, plan.id)
    navigate('/tradesman/dashboard', { replace: true })
  }

  return (
    <>
      <Link
        to="/"
        className="fixed top-5 left-6 z-50 flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <PricingHero />
      <PricingPlans onSelectPlan={handleSelectPlan} />
    </>
  )
}
