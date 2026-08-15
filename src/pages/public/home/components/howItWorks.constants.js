import {
  Briefcase,
  FileText,
  Send,
  Shield,
  ShieldCheck,
  User,
} from 'lucide-react'

export const HOW_IT_WORKS_AUDIENCES = {
  homeowners: {
    cta: {
      label: 'Post Your Job for Free',
      to: '/auth/register',
    },
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
    cta: {
      label: 'Post Your Job for Free',
      to: '/auth/register',
    },
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

export const HOW_IT_WORKS_TABS = [
  { id: 'homeowners', label: 'For Homeowners' },
  { id: 'tradesmen', label: 'For Tradesmen' },
]
