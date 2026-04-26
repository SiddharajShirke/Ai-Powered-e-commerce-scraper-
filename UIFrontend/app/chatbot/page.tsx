"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchChatResponse } from "@/lib/api"

interface Message {
  role: "assistant" | "user"
  content: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your smart shopping assistant. Ask me about product comparisons, best deals, or price insights.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const response = await fetchChatResponse(userMessage.content, history)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.message,
        },
      ])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to the server. Please check your connection or try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-navy md:text-4xl">
            DealMind Assistant
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Ask about product comparisons, best deals, or price insights.
          </p>
        </div>

        {/* Chat container */}
        <div className="flex w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-2xl border border-pink/20 bg-card shadow-xl shadow-pink/10">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed md:text-base ${
                      msg.role === "user"
                        ? "bg-purple text-primary-foreground"
                        : "bg-pink/20 text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[75%] items-center gap-2 rounded-2xl bg-pink/20 px-5 py-3 text-sm leading-relaxed text-foreground md:text-base">
                    <Loader2 size={16} className="animate-spin text-purple" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input bar */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 border-t border-pink/20 bg-card p-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Type your question..."
              className="flex-1 rounded-xl border border-pink/30 bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple text-primary-foreground shadow-md shadow-purple/30 transition-all hover:-translate-y-0.5 hover:bg-purple/85 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
