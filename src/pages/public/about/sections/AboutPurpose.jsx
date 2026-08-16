import { Check, Compass, Link2, Target } from 'lucide-react'
import { DEMO_ABOUT_PURPOSE } from '@/data/demoData'

const PURPOSE_ICONS = {
  mission: Target,
  vision: Compass,
}

export default function AboutPurpose() {
  return (
    <section data-scroll-section className="bg-secondary py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div data-scroll-header className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C7DCFE] bg-[#EAF2FE] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-btn-primary">
            <Link2 className="size-3.5" strokeWidth={2.25} />
            Purpose &amp; Direction
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Our Purpose &amp; Ambition
          </h2>
          <p className="mt-4 text-base leading-7 text-[#64748B] sm:text-lg">
            Guiding how we empower UK homeowners and trade professionals every single day.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {DEMO_ABOUT_PURPOSE.map((item) => {
            const Icon = PURPOSE_ICONS[item.id]

            return (
              <article
                key={item.id}
                data-scroll-item
                className="relative overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white p-7 shadow-[0_10px_40px_-16px_rgba(15,23,42,0.12)] sm:p-9"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[#EAF2FE]/90"
                />

                <div className="relative flex size-12 items-center justify-center rounded-2xl bg-btn-primary text-white shadow-[0_8px_20px_-8px_rgba(1,96,242,0.55)]">
                  <Icon className="size-6" strokeWidth={2} />
                </div>

                <p className="relative mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B9BFD]">
                  {item.eyebrow}
                </p>
                <h3 className="relative mt-2 text-[1.65rem] font-bold leading-tight text-[#111827] sm:text-[1.75rem]">
                  {item.title}
                </h3>
                <p className="relative mt-4 text-sm leading-7 text-[#64748B] sm:text-[16px]">
                  {item.description}
                </p>

                <ul className="relative mt-7 space-y-3.5 border-t border-[#EEF2F7] pt-6">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm font-medium text-[#111827]"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-btn-primary"
                        strokeWidth={2.75}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
