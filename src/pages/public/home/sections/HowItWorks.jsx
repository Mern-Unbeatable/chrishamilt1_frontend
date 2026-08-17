import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import hiringIllustration from '@/assets/hiring.svg'
import jobsLeadsIllustration from '@/assets/jobsleads.svg'
import postsIllustration from '@/assets/posts.svg'
import registerVerifiedIllustration from '@/assets/registerverified.svg'
import signupIllustration from '@/assets/signup.svg'
import winJobsIllustration from '@/assets/winjobs.svg'
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
        image: signupIllustration,
        imageAlt: 'Register for a free account',
        title: 'Register Free',
        description:
          'Sign up in 30 seconds with your email or Google account. No credit card required.',
      },
      {
        image: postsIllustration,
        imageAlt: 'Post your job details',
        title: 'Post Your Job',
        description:
          'Describe your project, add photos, set your budget and target completion date.',
      },
      {
        image: hiringIllustration,
        imageAlt: 'Hire a verified tradesman',
        title: 'Hire the Best Tradesman',
        description:
          'Receive up to 4 quotes from Gas Safe & NICEIC verified local pros. Compare reviews and hire with confidence.',
      },
    ],
  },
  tradesmen: {
    cta: { label: 'Join as Tradesman', to: '/auth/signup' },
    steps: [
      {
        image: registerVerifiedIllustration,
        imageAlt: 'Register and get verified',
        title: 'Register & Get Verified',
        description:
          'Upload your ID, Public Liability Insurance ($2M+), and official UK trade certifications.',
      },
      {
        image: jobsLeadsIllustration,
        imageAlt: 'Browse and purchase job leads',
        title: 'Purchase Quality Job Leads',
        description:
          'Browse targeted local leads in your postcode area. Purchase leads using flexible Lead Tokens.',
      },
      {
        image: winJobsIllustration,
        imageAlt: 'Send quotes and win work',
        title: 'Send Quotes & Win Work',
        description:
          'Connect directly with homeowners, provide tailored estimates, win jobs, and collect 5-star reviews.',
      },
    ],
  },
}

function StepColumn({ step, index, total }) {
  return (
    <article data-scroll-item className="relative flex flex-col items-center text-center">
      <div className="relative z-10 flex size-11 items-center justify-center rounded-full border-4 border-secondary bg-white text-sm font-bold text-[#111827] shadow-sm">
        {index + 1}
      </div>

      <div className="mt-8 flex w-full items-center justify-center px-2">
        <img
          src={step.image}
          alt={step.imageAlt ?? step.title}
          className="h-36 w-full max-w-[220px] object-contain sm:h-40"
        />
      </div>

      <h3 className="mt-6 text-lg font-bold text-[#111827]">{step.title}</h3>
      <p className="mt-3 max-w-xs text-[15px] font-medium leading-6 text-[#64748B]">{step.description}</p>

      {index < total - 1 ? (
        <span
          aria-hidden="true"
          className="absolute left-[calc(50%+1.75rem)] top-[1.375rem] hidden h-px w-[calc(100%-3.5rem)] bg-[#CBD5E1] lg:block"
        />
      ) : null}
    </article>
  )
}

function StepRowMobile({ step, index, total }) {
  return (
    <article data-scroll-item className="relative flex gap-5 pb-10 last:pb-0">
      <div className="flex flex-col items-center">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#111827] shadow-sm ring-1 ring-[#E5E7EB]">
          {index + 1}
        </div>
        {index < total - 1 ? (
          <span aria-hidden="true" className="mt-2 w-px flex-1 bg-[#CBD5E1]" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 pb-2">
        <div className="flex items-center justify-center rounded-2xl bg-white p-6 ring-1 ring-[#E5E7EB]">
          <img
            src={step.image}
            alt={step.imageAlt ?? step.title}
            className="h-32 w-full max-w-[200px] object-contain"
          />
        </div>
        <h3 className="mt-5 text-lg font-bold text-[#111827]">{step.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#64748B]">{step.description}</p>
      </div>
    </article>
  )
}

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('homeowners')
  const content = AUDIENCES[activeTab]

  return (
    <section data-scroll-section className="bg-secondary py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div data-scroll-header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            How TradeTrust UK Works
          </h2>
          <p className="mt-4 text-base text-[#64748B] sm:text-lg">
            Three simple steps — whether you&apos;re posting a job or winning new work
          </p>

          <div className="mt-8 inline-flex rounded-full bg-white p-1 ring-1 ring-[#E5E7EB]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-medium transition-colors sm:px-7',
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

        <div className="mt-14 hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {content.steps.map((step, index) => (
            <StepColumn
              key={`${activeTab}-${step.title}`}
              step={step}
              index={index}
              total={content.steps.length}
            />
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-lg lg:hidden">
          {content.steps.map((step, index) => (
            <StepRowMobile
              key={`${activeTab}-${step.title}`}
              step={step}
              index={index}
              total={content.steps.length}
            />
          ))}
        </div>

        <div data-scroll-item className="mt-12 flex justify-center lg:mt-14">
          <Link
            to={content.cta.to}
            className="inline-flex items-center gap-2 rounded-full bg-btn-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
          >
            {content.cta.label}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
