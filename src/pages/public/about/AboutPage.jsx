import AboutHero from '@/pages/public/about/sections/AboutHero'
import AboutStory from '@/pages/public/about/sections/AboutStory'
import AboutPurpose from '@/pages/public/about/sections/AboutPurpose'
import AboutPlatformFeatures from '@/pages/public/about/sections/AboutPlatformFeatures'
import AboutMarketplaceAdvantage from '@/pages/public/about/sections/AboutMarketplaceAdvantage'
import MarketplaceMetrics from '@/pages/public/home/sections/MarketplaceMetrics'
import Cta from '@/pages/public/home/sections/Cta'

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutPurpose />
      <AboutPlatformFeatures />
      <AboutMarketplaceAdvantage />
      {/* <MarketplaceMetrics /> */}
      <Cta />
    </>
  )
}
