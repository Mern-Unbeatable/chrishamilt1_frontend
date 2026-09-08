import { useLocation } from 'react-router'
import Messenger from '@/components/common/messenger/Messenger'
import useTradesmanMessages from '@/components/common/messenger/useTradesmanMessages'

export default function TradesmanMessagesPage() {
  const location = useLocation()
  const target = location.state ?? {}

  const state = useTradesmanMessages({
    initialCustomerId: target.customerId ?? null,
    initialJobId: target.jobId ?? null,
  })

  return (
    <div className="flex h-[calc(100dvh-72px-2rem)] min-h-[520px] flex-col sm:h-[calc(100dvh-72px-3rem)] lg:h-[calc(100dvh-72px-4rem)]">
      <Messenger {...state} placeholder="Write a message..." className="min-h-0 flex-1" />
    </div>
  )
}
