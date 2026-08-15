import { Link } from 'react-router'

export default function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
      <ul className="mt-5 space-y-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-sm text-[#374151] transition-colors hover:text-btn-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
