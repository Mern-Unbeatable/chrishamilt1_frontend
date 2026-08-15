import FooterBottom from '@/layouts/footer/FooterBottom'
import FooterBrand from '@/layouts/footer/FooterBrand'
import FooterContact from '@/layouts/footer/FooterContact'
import FooterLinkColumn from '@/layouts/footer/FooterLinkColumn'
import {
  CUSTOMER_LINKS,
  TRADESMAN_LINKS,
} from '@/layouts/footer/footer.constants'

export default function PublicFooter() {
  return (
    <footer className="bg-[#EBF2FF]">
      <div className="container mx-auto px-6 py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <FooterBrand />
          <FooterLinkColumn title="For Customers" links={CUSTOMER_LINKS} />
          <FooterLinkColumn title="For Tradesmen" links={TRADESMAN_LINKS} />
          <FooterContact />
        </div>

        <div className="mt-12 border-t border-[#D1D5DB]/70">
          <FooterBottom />
        </div>
      </div>
    </footer>
  )
}
