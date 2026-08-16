import { Star } from 'lucide-react'
import billieAvatar from '@/assets/testimonials/billie.webp'
import snoopAvatar from '@/assets/testimonials/snoop.jpg'
import pitbullAvatar from '@/assets/testimonials/pitbull.jpg'

const TESTIMONIALS = [
  {
    id: '1',
    quote:
      'Found an amazing plumber through TradesMarket within 24 hours. Got 4 quotes in a day, picked the best value, and the job was done perfectly. Saves so much time versus ringing around!',
    name: 'Sarah Nichols',
    location: 'Brighton',
    service: 'Plumbing',
    avatar: billieAvatar,
  },
  {
    id: '2',
    quote:
      'I was worried about finding a trustworthy tradesman after a bad experience. All the tradesmen here are verified. My kitchen renovation was done on time and on budget.',
    name: 'Marcus Williams',
    location: 'Newcastle',
    service: 'Kitchen Fitting',
    avatar: snoopAvatar,
  },
  {
    id: '3',
    quote:
      'The process was so simple. Posted my job, had 6 quotes within 48 hours, and hired a fantastic electrician. The messaging system made everything easy.',
    name: 'Priya Sharma',
    location: 'Leicester',
    service: 'Electrical',
    avatar: pitbullAvatar,
  },
]

export default function CustomerTestimonials() {
  return (
    <section data-scroll-section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div data-scroll-header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-base text-[#64748B] sm:text-lg">
            Real reviews from real homeowners across the UK
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              data-scroll-item
              className="flex h-full flex-col rounded-xl border border-[#E5E7EB] bg-white p-8"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-[#FBBF24] text-[#FBBF24]"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-base font-semibold italic text-gray-500">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt=""
                  className="size-10 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{item.name}</p>
                  <p className="text-xs text-[#64748B]">
                    {item.location} · {item.service}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
