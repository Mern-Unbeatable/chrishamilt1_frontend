import { useState } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  Briefcase,
  FileText,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react'
import { cn } from '@/helpers/cn'

const TABS = [
  { id: 'homeowners', label: 'For Homeowners' },
  { id: 'tradesmen', label: 'For Tradesmen' },
]

const AUDIENCES = {
  homeowners: {
    cta: { label: 'Post Your Job for Free', to: '/auth/signup' },
    steps: [
      {
        step: '01',
        icon: User,
        iconClassName: 'bg-[#EFF6FF] text-[#2563EB]',
        title: 'Register Free',
        description:
          'Sign up in 30 seconds with your email or Google account. No credit card required.',
      },
      {
        step: '02',
        icon: FileText,
        iconClassName: 'bg-[#ECFDF5] text-[#059669]',
        title: 'Post Your Job',
        description:
          'Describe your project, add photos, set your budget and target completion date.',
      },
      {
        step: '03',
        icon: ShieldCheck,
        iconClassName: 'bg-[#EFF6FF] text-[#2563EB]',
        title: 'Hire the Best Tradesman',
        description:
          'Receive up to 4 quotes from Gas Safe & NICEIC verified local pros. Compare reviews and hire with confidence.',
      },
    ],
  },
  tradesmen: {
    cta: { label: 'Post Your Job for Free', to: '/auth/signup' },
    steps: [
      {
        step: '01',
        icon: Shield,
        iconClassName: 'bg-[#EFF6FF] text-[#2563EB]',
        title: 'Register & Get Verified',
        description:
          'Upload your ID, Public Liability Insurance ($2M+), and official UK trade certifications.',
      },
      {
        step: '02',
        icon: Briefcase,
        iconClassName: 'bg-[#ECFDF5] text-[#059669]',
        title: 'Purchase Quality Job Leads',
        description:
          'Browse targeted local leads in your postcode area. Purchase leads using flexible Lead Tokens.',
      },
      {
        step: '03',
        icon: Send,
        iconClassName: 'bg-[#EFF6FF] text-[#2563EB]',
        title: 'Send Quotes & Win Work',
        description:
          'Connect directly with homeowners, provide tailored estimates, win jobs, and collect 5-star reviews.',
      },
    ],
  },
}

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('homeowners')
  const content = AUDIENCES[activeTab]

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

          <div className="mt-8 inline-flex rounded-full bg-white p-1 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-full px-6 py-2.5 text-sm font-medium transition-colors sm:px-8',
                  activeTab === tab.id
                    ? 'bg-btn-primary text-white'
                    : 'text-[#64748B] hover:text-[#111827]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {content.steps.map((step, index) => {
            const Icon = step.icon

            return (
              <article
                key={`${activeTab}-${step.title}`}
                className="relative rounded-3xl bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-lg',
                      step.iconClassName,
                    )}
                  >
                    <Icon className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-5xl font-bold leading-none text-[#E8ECF0]">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-[#111827]">{step.title}</h3>
                <p className="mt-3 text-base leading-7 text-[#64748B]">
                  {step.description}
                </p>
                <p className="mt-6 text-sm font-medium text-btn-primary">
                  {`Step ${index + 1} of 3 →`}
                </p>
              </article>
            )
          })}
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
