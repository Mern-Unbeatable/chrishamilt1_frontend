import { Link } from 'react-router'
import { LEGAL_LINKS } from '@/layouts/footer/footer.constants'

export default function FooterBottom() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex flex-col items-start justify-between gap-4 pt-8 md:flex-row md:items-center">
      <p className="text-sm text-[#4B5563]">
        © {currentYear} TradesMarket Ltd. All rights reserved. Registered in
        England &amp; Wales.
      </p>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {LEGAL_LINKS.map((link) => (
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
