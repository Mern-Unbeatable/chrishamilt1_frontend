import Messenger from '@/components/common/messenger/Messenger'
import useMessages from '@/components/common/messenger/useMessages'

export default function MessagesPage() {
  const state = useMessages()

  return (
    <div className="mx-auto flex h-[calc(100dvh-6.5rem)] min-h-[520px] w-full max-w-6xl flex-col px-4 pb-4 pt-2 sm:h-[calc(100dvh-7rem)] sm:px-0 sm:pb-6 sm:pt-4">
      <Messenger {...state} placeholder="Write a message..." className="min-h-0 flex-1" />
    </div>
  )
}
