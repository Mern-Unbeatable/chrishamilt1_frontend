import { Link } from 'react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import Logo from '@/components/Logo'

const CUSTOMER_LINKS = [
  { label: 'Post a Job', to: '/auth/signup' },
  { label: 'Browse Jobs', to: '/jobs' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Safety & Trust', to: '/about' },
  { label: 'Customer Reviews', to: '/about' },
]

const TRADESMAN_LINKS = [
  { label: 'Join as a Tradesman', to: '/auth/signup' },
  { label: 'How Leads Work', to: '/how-it-works' },
  { label: 'Token Packages', to: '/pricing' },
  { label: 'Verification Process', to: '/about' },
  { label: 'Success Stories', to: '/about' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
]

const CONTACT_ITEMS = [
  { icon: MapPin, text: '123 Trade House, London EC2A 4AB, United Kingdom' },
  { icon: Phone, text: '0800 123 4567' },
  { icon: Mail, text: 'hello@tradesmarket.co.uk' },
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com', Icon: FaFacebookF },
  { label: 'Twitter', href: 'https://twitter.com', Icon: FaTwitter },
  { label: 'Instagram', href: 'https://instagram.com', Icon: FaInstagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: FaLinkedinIn },
]

function FooterLinkColumn({ title, links }) {
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

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#EBF2FF]">
      <div className="container mx-auto px-6 py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="max-w-[280px]">
            <Logo />
            <p className="mt-5 text-sm leading-6 text-[#4B5563]">
              The UK&apos;s trusted marketplace connecting customers with verified
              tradesmen. Free to post, quality guaranteed.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full bg-btn-primary text-sm text-white transition-colors hover:bg-[#0150CC]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <FooterLinkColumn title="For Customers" links={CUSTOMER_LINKS} />
          <FooterLinkColumn title="For Tradesmen" links={TRADESMAN_LINKS} />

          <div>
            <h3 className="text-base font-semibold text-[#111827]">Contact Us</h3>
            <ul className="mt-5 space-y-4">
              {CONTACT_ITEMS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-btn-primary">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="text-sm leading-6 text-[#374151]">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#D1D5DB]/70">
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
        </div>
      </div>
    </footer>
  )
}
