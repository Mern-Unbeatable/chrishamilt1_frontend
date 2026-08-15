import { ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import HowItWorksAudienceToggle from '@/pages/public/home/components/HowItWorksAudienceToggle'
import HowItWorksStepCard from '@/pages/public/home/components/HowItWorksStepCard'
import { HOW_IT_WORKS_AUDIENCES } from '@/pages/public/home/components/howItWorks.constants'

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState('homeowners')
  const content = HOW_IT_WORKS_AUDIENCES[activeTab]

  return (
    <section className="bg-secondary py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-btn-primary">
            <Sparkles className="size-3.5" />
            Seamless Marketplace Flow
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            How TradeTrust UK Works
          </h2>

          <p className="mt-4 text-base leading-7 text-[#64748B] sm:text-lg">
            Designed for complete simplicity, trust, and speed for both homeowners
            and professional tradesmen.
          </p>

          <div className="mt-8">
            <HowItWorksAudienceToggle
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {content.steps.map((step, index) => (
            <HowItWorksStepCard
              key={`${activeTab}-${step.title}`}
              {...step}
              stepLabel={`Step ${index + 1} of 3 →`}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to={content.cta.to}
            className="inline-flex items-center gap-2 rounded-full bg-btn-primary px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
          >
            {content.cta.label}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
