import { Link } from 'react-router'

export default function Cta() {
  return (
    <section data-scroll-section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div
          data-scroll-item
          className="rounded-3xl bg-btn-primary px-6 py-14 text-center sm:px-10 lg:py-16"
        >
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
            Whether you&apos;re looking for a trusted tradesman or new job
            opportunities, join today.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/auth/signup"
              className="inline-flex min-w-[180px] items-center justify-center rounded-lg border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Post a Job
            </Link>
            <Link
              to="/auth/signup"
              className="inline-flex min-w-[180px] items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-btn-primary transition-colors hover:bg-[#F8FAFC]"
            >
              Join as Tradesman
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
