import { useState } from 'react'
import FaqItem from '@/pages/public/home/components/FaqItem'
import { FAQ_ITEMS } from '@/pages/public/home/components/faq.constants'

export default function FaqSection() {
  const [openId, setOpenId] = useState(null)

  const handleToggle = (id) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <section className="bg-primary py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-[#64748B] sm:text-lg">
            Everything you need to know about TradesMarket
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-4">
          {FAQ_ITEMS.map((item) => (
            <FaqItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
