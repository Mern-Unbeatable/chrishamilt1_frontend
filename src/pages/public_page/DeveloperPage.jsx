import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Check, Copy, Search } from 'lucide-react'
import ComponentPreview from '@/developer/ComponentPreview'
import {
  COMPONENT_DOCS,
  DOC_CATEGORIES,
  filterComponentDocs,
  getComponentDoc,
} from '@/developer/catalog'

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-slate-100 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function PropTable({ props = [], required }) {
  const rows = props.filter((prop) => Boolean(prop.required) === required)

  if (!rows.length) {
    return (
      <p className="text-sm text-[var(--secondary-text)]">
        {required ? 'No required props.' : 'No optional props.'}
      </p>
    )
  }

  return (
    <div className="min-w-0 overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-3 py-2.5 font-semibold">Prop</th>
            <th className="px-3 py-2.5 font-semibold">Type</th>
            {!required ? <th className="px-3 py-2.5 font-semibold">Default</th> : null}
            <th className="px-3 py-2.5 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((prop) => (
            <tr key={prop.name} className="border-b border-gray-100 last:border-0">
              <td className="px-3 py-2.5 font-mono text-xs text-[var(--active)] sm:text-sm">
                {prop.name}
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-[var(--primary-text)]">
                {prop.type}
              </td>
              {!required ? (
                <td className="px-3 py-2.5 font-mono text-xs text-[var(--secondary-text)]">
                  {prop.defaultValue ?? '—'}
                </td>
              ) : null}
              <td className="px-3 py-2.5 text-[var(--secondary-text)]">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CallbackTable({ props = [] }) {
  const rows = props.filter((prop) => prop.name.startsWith('on'))

  if (!rows.length) return null

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-bold text-[var(--primary-text)]">Callbacks (prop drill)</h2>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          UI only fires these handlers — pass them from the parent page.
        </p>
      </div>
      <PropTable props={rows} required={false} />
    </section>
  )
}

function DocPanel({ doc }) {
  if (!doc) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm text-[var(--secondary-text)]">
          Select a component from the sidebar.
        </p>
      </div>
    )
  }

  return (
    <article className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--active)]">
          {doc.category}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {doc.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--secondary-text)] sm:text-base">{doc.summary}</p>
        <p className="mt-3 inline-flex rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-xs text-[var(--primary-text)]">
          {doc.path}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">Import</h2>
        <CodeBlock label="Import" code={doc.importExample} />
        <p className="text-xs text-[var(--secondary-text)]">
          Demo payloads live in <code className="rounded bg-gray-100 px-1 py-0.5">src/data/demoData.js</code>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">Required props</h2>
        <PropTable props={doc.props} required />
        <CodeBlock label="JSX" code={doc.requiredExample} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">Optional props</h2>
        <PropTable props={doc.props} required={false} />
        <CodeBlock label="JSX" code={doc.optionalExample} />
      </section>

      <CallbackTable props={doc.props} />

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">Live preview</h2>
        <p className="text-xs text-[var(--secondary-text)]">
          Preview renders at site container width (same as public pages).
        </p>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#F8FAFC] py-4 sm:py-6">
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
            <ComponentPreview previewId={doc.previewId} />
          </div>
        </div>
      </section>
    </article>
  )
}

/** /developer — component documentation for the team. */
export default function DeveloperPage() {
  const { componentId } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => filterComponentDocs({ category: 'all', query }),
    [query],
  )

  const selected = useMemo(() => {
    const match = filtered.find((doc) => doc.id === componentId)
    if (match) return match
    if (componentId) {
      const fromAll = getComponentDoc(componentId)
      if (fromAll && !query.trim()) return fromAll
    }
    return filtered[0] || null
  }, [filtered, componentId, query])

  useEffect(() => {
    if (!componentId && filtered[0]) {
      navigate(`/developer/${filtered[0].id}`, { replace: true })
    }
  }, [componentId, filtered, navigate])

  const groups = DOC_CATEGORIES.filter((cat) => cat.id !== 'all').map((cat) => ({
    ...cat,
    items: filtered.filter((doc) => doc.category === cat.id),
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--active)]">
              Traders In Loop UI
            </p>
            <h1 className="text-xl font-bold text-[var(--primary-text)] sm:text-2xl">
              Developer — Shared Components
            </h1>
          </div>

          <label className="relative block w-full max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search components…"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm outline-none focus:border-[var(--active)]"
            />
          </label>
        </div>
      </header>

      <div className="container mx-auto grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="rounded-xl border border-gray-200 bg-white p-4">
          <nav className="space-y-4">
            {groups.map((group) => (
              <div key={group.id}>
                <p className="px-2 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
                  {group.label}
                </p>
                <ul className="mt-2 space-y-1">
                  {group.items.map((doc) => (
                    <li key={doc.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/developer/${doc.id}`)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selected?.id === doc.id
                            ? 'bg-primary font-semibold text-[var(--active)]'
                            : 'text-[var(--primary-text)] hover:bg-gray-50'
                        }`}
                      >
                        {doc.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8">
          <DocPanel doc={selected} />
        </main>
      </div>
    </div>
  )
}
