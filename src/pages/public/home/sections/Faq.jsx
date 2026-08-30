import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/helpers/cn'

const FAQ_ITEMS = [
  {
    id: '1',
    question: 'How much does it cost for customers to post a job?',
    answer:
      'Posting a job on Traders In Loop is completely free for homeowners. You can describe your project, upload photos, and receive quotes from verified tradesmen without any upfront fees.',
  },
  {
    id: '2',
    question: 'How do I know the tradesmen are trustworthy?',
    answer:
      'Every tradesman is verified with photo ID, Public Liability Insurance (£2M+), and relevant trade accreditations such as Gas Safe, NICEIC, and NFRC before they can quote on jobs.',
  },
  {
    id: '3',
    question: 'How long does it take to receive quotes?',
    answer:
      'Most jobs receive their first quote within 15–30 minutes. You can typically expect up to 4 competitive quotes within 24–48 hours depending on your location and trade category.',
  },
  {
    id: '4',
    question: 'What happens after I hire a tradesman?',
    answer:
      'Once you hire a tradesman, you can communicate securely through our in-app messaging, agree on milestones, and leave a verified review after the job is completed.',
  },
  {
    id: '5',
    question: 'How does the token system work for tradesmen?',
    answer:
      'Tradesmen purchase Lead Tokens to unlock job leads in their postcode area. Each lead is capped at 3–4 tradesmen, so you only pay for quality opportunities with a real chance of winning the work.',
  },
  {
    id: '6',
    question: 'What areas does Traders In Loop cover?',
    answer:
      'Traders In Loop covers over 250 cities across the United Kingdom, from London and Manchester to Edinburgh and Cardiff, with new areas added regularly.',
  },
]

export default function Faq() {
  const [openId, setOpenId] = useState(null)

  return (
    <section data-scroll-section className="bg-primary py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div data-scroll-header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-[#64748B] sm:text-lg">
            Everything you need to know about Traders In Loop
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id

            return (
              <div
                key={item.id}
                data-scroll-item
                className="overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenId((current) => (current === item.id ? null : item.id))}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-medium text-[#111827] sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'size-5 shrink-0 text-[#94A3B8] transition-transform duration-200',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-200 ease-in-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-7 text-[#64748B]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
