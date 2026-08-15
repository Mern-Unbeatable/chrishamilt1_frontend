import HeroBadge from '@/pages/public/home/components/HeroBadge'
import HeroHeading from '@/pages/public/home/components/HeroHeading'
import HeroIllustrations from '@/pages/public/home/components/HeroIllustrations'
import HeroSearchBar from '@/pages/public/home/components/HeroSearchBar'

export default function HeroSection() {
  return (
    <section
      className="relative -mt-[72px] min-h-[852px] overflow-hidden pt-[72px]"
      style={{
        background:
          'linear-gradient(180deg, #EAF2FE 0%, #F4F8FE 42%, #FAFCFF 68%, #FFFFFF 100%)',
      }}
    >
      <HeroIllustrations />

      <div className="container relative z-10 mx-auto flex max-w-[920px] flex-col items-center px-6 pb-24 pt-16 text-center lg:px-8 lg:pt-20">
        <HeroBadge />
        <HeroHeading />
        <HeroSearchBar />
      </div>
    </section>
  )
}
