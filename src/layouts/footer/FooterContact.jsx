import { Mail, MapPin, Phone } from 'lucide-react'
import { CONTACT_ITEMS } from '@/layouts/footer/footer.constants'

const icons = {
  map: MapPin,
  phone: Phone,
  mail: Mail,
}

export default function FooterContact() {
  return (
    <div>
      <h3 className="text-base font-semibold text-[#111827]">Contact Us</h3>
      <ul className="mt-5 space-y-4">
        {CONTACT_ITEMS.map((item) => {
          const Icon = icons[item.icon]

          return (
            <li key={item.text} className="flex gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-btn-primary">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <span className="text-sm leading-6 text-[#374151]">{item.text}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
