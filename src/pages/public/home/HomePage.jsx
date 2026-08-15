import BrowseByTradeSection from '@/pages/public/home/components/BrowseByTradeSection'
import CtaSection from '@/pages/public/home/components/CtaSection'
import CustomerTestimonialsSection from '@/pages/public/home/components/CustomerTestimonialsSection'
import FaqSection from '@/pages/public/home/components/FaqSection'
import HeroSection from '@/pages/public/home/components/HeroSection'
import HowItWorksSection from '@/pages/public/home/components/HowItWorksSection'
import MarketplaceMetricsSection from '@/pages/public/home/components/MarketplaceMetricsSection'
import RecentJobsSection from '@/pages/public/home/components/RecentJobsSection'
import WhyPreferTradeTrustSection from '@/pages/public/home/components/WhyPreferTradeTrustSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarketplaceMetricsSection />
      <BrowseByTradeSection />
      <HowItWorksSection />
      <WhyPreferTradeTrustSection />
      <RecentJobsSection />
      <CustomerTestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
