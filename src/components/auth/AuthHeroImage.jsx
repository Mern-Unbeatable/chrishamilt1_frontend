export default function AuthHeroImage({ src, alt = '' }) {
  return (
    <div className="relative hidden min-h-[280px] bg-[#E2E8F0] lg:block">
      <img
        src={src}
        alt={alt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  )
}
