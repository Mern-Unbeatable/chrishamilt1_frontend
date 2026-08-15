import TestimonialCard from '@/pages/public/home/components/TestimonialCard'
import { CUSTOMER_TESTIMONIALS } from '@/pages/public/home/components/customerTestimonials.constants'

export default function CustomerTestimonialsSection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-base text-[#64748B] sm:text-lg">
            Real reviews from real homeowners across the UK
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CUSTOMER_TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
