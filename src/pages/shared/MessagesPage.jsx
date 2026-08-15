import Messenger from '@/components/common/messenger/Messenger'
import useMessages from '@/components/common/messenger/useMessages'

export default function MessagesPage() {
  const state = useMessages()

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[560px]">
      <Messenger
        {...state}
        placeholder="Text message form MTN"
      />
    </div>
  )
}
