import Logo from '@/components/Logo'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import { SOCIAL_LINKS } from '@/layouts/footer/footer.constants'

const socialIcons = {
  Facebook: FaFacebookF,
  Twitter: FaTwitter,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
}

export default function FooterBrand() {
  return (
    <div className="max-w-[280px]">
      <Logo />
      <p className="mt-5 text-sm leading-6 text-[#4B5563]">
        The UK&apos;s trusted marketplace connecting customers with verified
        tradesmen. Free to post, quality guaranteed.
      </p>
      <div className="mt-6 flex items-center gap-3">
        {SOCIAL_LINKS.map((social) => {
          const Icon = socialIcons[social.label]

          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex size-9 items-center justify-center rounded-full bg-btn-primary text-sm text-white transition-colors hover:bg-[#0150CC]"
            >
              <Icon />
            </a>
          )
        })}
      </div>
    </div>
  )
}
