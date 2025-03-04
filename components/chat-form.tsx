"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { useState } from "react"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import AutoResizeTextarea from "@/components/autoresize-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MODEL_OPTIONS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4 Mini" },
  { value: "gpt-4.5-preview", label: "GPT-4.5 Preview" },
  { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
  { value: "claude-3.7-sonnet", label: "Claude 3.7 Sonnet" },
]

export function ChatForm({ className, ...props }: React.ComponentProps<"div">) {
  const [model, setModel] = useState("gpt-4.5-preview")

  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
    body: { model },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    await append({ content: input, role: "user" })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-col h-full">
        <header className="border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">AI Chatbot</h1>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        <main className={cn("flex-1 flex flex-col relative overflow-hidden", className)} {...props}>
          <div className="flex-1 content-center overflow-y-auto px-6">
            {messages.length ? (
              <div className="my-4 flex h-fit min-h-full flex-col gap-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "max-w-[80%] rounded-xl px-4 py-2 text-sm",
                      message.role === "user"
                        ? "self-end bg-black text-white"
                        : "self-start bg-muted text-black prose prose-sm dark:prose-invert"
                    )}
                  >
                    {message.role === "user" ? (
                      message.content
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: function Code(props: { inline?: boolean; children?: React.ReactNode }) {
                            return (
                              <code className={cn("bg-muted/50 rounded px-1", props.inline ? "py-0.5" : "block p-2")}>
                                {props.children}
                              </code>
                            )
                          }
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-semibold mb-3">AIアシスタントと会話を始めましょう</h2>
                <p className="text-muted-foreground">
                  上部でモデルを選択し、メッセージを入力してください
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
              <AutoResizeTextarea
                onKeyDown={handleKeyDown}
                onChange={(v) => setInput(v)}
                value={input}
                placeholder="メッセージを入力..."
                className="w-full pr-12 resize-none bg-transparent focus:outline-none"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      disabled={!input.trim()}
                    >
                      <ArrowUpIcon className="h-4 w-4" />
                      <span className="sr-only">送信</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>メッセージを送信</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

