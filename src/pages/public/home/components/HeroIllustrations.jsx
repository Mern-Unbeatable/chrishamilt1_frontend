import leftHero from '@/assets/lefthero.png'
import rightHero from '@/assets/righthero.png'

export default function HeroIllustrations() {
  return (
    <>
      <img
        src={leftHero}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 bottom-0 z-0 hidden h-[500px] w-auto select-none object-contain object-bottom mix-blend-multiply lg:block xl:h-[560px]"
      />
      <img
        src={rightHero}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 bottom-0 z-0 hidden h-[500px] w-auto select-none object-contain object-bottom mix-blend-multiply lg:block xl:h-[560px]"
      />
    </>
  )
}
