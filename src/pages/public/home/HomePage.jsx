import BrowseByTrade from '@/pages/public/home/sections/BrowseByTrade'
import Cta from '@/pages/public/home/sections/Cta'
import CustomerTestimonials from '@/pages/public/home/sections/CustomerTestimonials'
import Faq from '@/pages/public/home/sections/Faq'
import Hero from '@/pages/public/home/sections/Hero'
import HowItWorks from '@/pages/public/home/sections/HowItWorks'
import MarketplaceMetrics from '@/pages/public/home/sections/MarketplaceMetrics'
import RecentJobs from '@/pages/public/home/sections/RecentJobs'
import WhyPreferTradeTrust from '@/pages/public/home/sections/WhyPreferTradeTrust'

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarketplaceMetrics />
      <BrowseByTrade />
      <HowItWorks />
      <WhyPreferTradeTrust />
      <RecentJobs />
      <CustomerTestimonials />
      <Faq />
      <Cta />
    </>
  )
}
