import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/utils/supabase-client'

type Conversation = {
  id: string
  title: string
}

export function Sidebar({ onSelectConversation }: { onSelectConversation: (id: string) => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, messages')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching conversations:', error)
        return
      }

      const formattedConversations = data.map(conv => ({
        id: conv.id,
        title: JSON.parse(conv.messages)[0]?.content.slice(0, 30) || 'New conversation'
      }))

      setConversations(formattedConversations)
    }

    fetchConversations()
  }, [])

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {conversations.map((conversation) => (
          <Button
            key={conversation.id}
            variant="ghost"
            className="w-full justify-start mb-2 text-left"
            onClick={() => onSelectConversation(conversation.id)}
          >
            {conversation.title}
          </Button>
        ))}
      </ScrollArea>
    </div>
  )
}

