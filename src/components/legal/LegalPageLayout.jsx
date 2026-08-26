import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CalendarDays, Clock3 } from 'lucide-react'
import { cn } from '@/helpers/cn'
import { LEGAL_COMPANY, LEGAL_RELATED_LINKS } from '@/data/legalContent'

function LegalHero({ legalDocument }) {
  return (
    <section
      className="relative -mt-[72px] border-b border-[#E5E7EB]/80 pb-10 pt-[88px] lg:pb-12 lg:pt-[96px]"
      style={{
        background:
          'linear-gradient(180deg, #EAF2FE 0%, #F4F8FE 45%, #FAFCFF 72%, #FFFFFF 100%)',
      }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-[#64748B]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="transition-colors hover:text-btn-primary">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-[#111827]">{legalDocument.title}</li>
          </ol>
        </nav>

        <div className="mx-auto mt-8 max-w-3xl text-center lg:mt-10">
          <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 text-xs font-semibold text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:text-sm">
            {legalDocument.badge}
          </span>

          <h1 className="mt-5 text-[2rem] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:text-4xl lg:text-[2.75rem]">
            {legalDocument.title.includes(legalDocument.heroHighlight) ? (
              <>
                {legalDocument.title.split(legalDocument.heroHighlight)[0]}
                <span className="text-btn-primary">{legalDocument.heroHighlight}</span>
                {legalDocument.title.split(legalDocument.heroHighlight)[1]}
              </>
            ) : (
              legalDocument.title
            )}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#64748B] sm:text-base">
            {legalDocument.summary}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#64748B] sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-btn-primary" strokeWidth={2} />
              Last updated {legalDocument.lastUpdated}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4 text-btn-primary" strokeWidth={2} />
              {legalDocument.readMinutes} min read
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function TableOfContents({ sections, activeId, onNavigate, className = '' }) {
  return (
    <nav aria-label="Table of contents" className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
        On this page
      </p>
      <ul className="mt-3 space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={() => onNavigate?.(section.id)}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm transition-colors',
                activeId === section.id
                  ? 'bg-[#EFF6FF] font-semibold text-btn-primary'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827]',
              )}
            >
              {section.title.replace(/^\d+\.\s*/, '')}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function LegalTable({ table }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-[#E5E7EB]">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
            {table.headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold text-[#111827]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0]} className="border-b border-[#F1F5F9] last:border-0">
              {row.map((cell) => (
                <td key={cell} className="px-4 py-3 align-top text-[#64748B]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LegalSectionBlock({ section }) {
  return (
    <section id={section.id} className="scroll-mt-28 border-b border-[#F1F5F9] pb-10 last:border-0">
      <h2 className="text-xl font-bold tracking-tight text-[#111827] sm:text-2xl">
        {section.title}
      </h2>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-4 text-sm leading-7 text-[#64748B] sm:text-base">
          {paragraph}
        </p>
      ))}

      {section.list ? (
        <ul className="mt-4 space-y-2.5">
          {section.list.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-7 text-[#64748B] sm:text-base"
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-btn-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {section.subsections?.map((subsection) => (
        <div key={subsection.title} className="mt-6">
          <h3 className="text-base font-semibold text-[#111827]">{subsection.title}</h3>
          {subsection.list ? (
            <ul className="mt-3 space-y-2.5">
              {subsection.list.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-7 text-[#64748B] sm:text-base"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#CBD5E1]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}

      {section.table ? <LegalTable table={section.table} /> : null}

      {section.note ? (
        <div className="mt-5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3.5 text-sm leading-6 text-[#1E40AF]">
          {section.note}
        </div>
      ) : null}
    </section>
  )
}

function RelatedLegalLinks({ currentPath }) {
  return (
    <aside className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-6 sm:p-8">
      <h2 className="text-lg font-bold text-[#111827]">Related documents</h2>
      <p className="mt-2 text-sm leading-6 text-[#64748B]">
        Review our other legal pages for a complete picture of how{' '}
        {LEGAL_COMPANY.brand} works.
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {LEGAL_RELATED_LINKS.filter((link) => link.to !== currentPath).map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="inline-flex rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#374151] transition-colors hover:border-btn-primary hover:text-btn-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default function LegalPageLayout({ legalDocument }) {
  const [activeId, setActiveId] = useState(legalDocument.sections[0]?.id ?? '')

  useEffect(() => {
    const sectionIds = legalDocument.sections.map((section) => section.id)
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [legalDocument.sections])

  const currentPath = `/${legalDocument.slug}`

  return (
    <>
      <LegalHero legalDocument={legalDocument} />

      <div className="bg-white py-10 lg:py-14">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {legalDocument.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    'shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors',
                    activeId === section.id
                      ? 'border-btn-primary bg-[#EFF6FF] text-btn-primary'
                      : 'border-[#E5E7EB] bg-white text-[#64748B]',
                  )}
                >
                  {section.title.replace(/^\d+\.\s*/, '')}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-10 lg:mt-0 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents
                  sections={legalDocument.sections}
                  activeId={activeId}
                  onNavigate={setActiveId}
                />
              </div>
            </div>

            <article className="min-w-0 space-y-10">
              {legalDocument.sections.map((section) => (
                <LegalSectionBlock key={section.id} section={section} />
              ))}
            </article>

            <div className="hidden xl:block">
              <div className="sticky top-28">
                <RelatedLegalLinks currentPath={currentPath} />
              </div>
            </div>
          </div>

          <div className="mt-12 xl:hidden">
            <RelatedLegalLinks currentPath={currentPath} />
          </div>
        </div>
      </div>
    </>
  )
}
