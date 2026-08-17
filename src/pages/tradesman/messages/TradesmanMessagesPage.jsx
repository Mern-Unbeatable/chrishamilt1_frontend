import Messenger from '@/components/common/messenger/Messenger'
import useMessages from '@/components/common/messenger/useMessages'

export default function TradesmanMessagesPage() {
  const state = useMessages()

  return (
    <div className="flex h-[calc(100dvh-72px-2rem)] min-h-[520px] flex-col sm:h-[calc(100dvh-72px-3rem)] lg:h-[calc(100dvh-72px-4rem)]">
      <Messenger {...state} placeholder="Write a message..." className="min-h-0 flex-1" />
    </div>
  )
}
