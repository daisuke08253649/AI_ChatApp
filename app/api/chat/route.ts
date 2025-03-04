import { CoreMessage, streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { connectDB } from '@/lib/mongodb'
import { Message } from '@/models/message'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  await connectDB()
  const { messages, model }: { messages: CoreMessage[], model: string } = await req.json()

  // 会話IDの生成
  const conversationId = req.headers.get('X-Conversation-Id') || nanoid()

  // メッセージをMongoDBに保存
  try {
    await Message.create({
      conversationId,
      content: messages[messages.length - 1].content,
      role: messages[messages.length - 1].role
    })
  } catch (error) {
    console.error('Error saving message:', error)
    return new Response('Error saving message', { status: 500 })
  }

  let selectedModel;
  if (model.startsWith('gpt')) {
    selectedModel = openai(model)
  } else if (model.startsWith('claude')) {
    selectedModel = anthropic(model)
  } else {
    throw new Error('Unsupported model')
  }

  const result = streamText({
    model: selectedModel,
    system: 'You are a helpful assistant.',
    messages,
  })

  const response = result.toDataStreamResponse()
  response.headers.set('X-Conversation-Id', conversationId)
  return response
}

export async function GET(req: Request) {
  await connectDB()
  const conversationId = req.headers.get('X-Conversation-Id')
  if (!conversationId) {
    return new Response('Conversation ID is required', { status: 400 })
  }

  try {
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .select('content role -_id')

    return new Response(JSON.stringify(messages), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return new Response('Error fetching messages', { status: 500 })
  }
}

