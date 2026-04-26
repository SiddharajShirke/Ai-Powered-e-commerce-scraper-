"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Maximize2, Minimize2, ExternalLink, Heart, Loader2 } from "lucide-react"
import { PriceAlertModal } from "@/components/price-alert-modal"
import { fetchChatResponse } from "@/lib/api"
import { ShoppingResult } from "@/lib/types"

interface Message {
  role: "assistant" | "user"
  content: string
  products?: ShoppingResult[]
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your smart shopping assistant. Ask me about product comparisons, best deals, or price insights.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [priceAlertProduct, setPriceAlertProduct] = useState<{ name: string; price: string; link: string; thumbnail?: string; site?: string } | null>(null)
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
      // Map frontend interface slightly to backend schema expectations if necessary, 
      // but `fetchChatResponse` natively wants `{role, content}` array
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetchChatResponse(userMessage.content, history)
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.message,
          products: response.products,
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

  const handleClose = () => {
    setIsOpen(false)
    setIsMaximized(false)
  }

  const popupClasses = isMaximized
    ? "fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl bg-card shadow-2xl shadow-navy/20 sm:inset-8 md:inset-16 lg:inset-24"
    : "fixed bottom-24 right-6 z-50 flex h-[450px] w-[360px] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl shadow-navy/20"

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-purple text-primary-foreground shadow-lg shadow-purple/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple/50"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat popup */}
      {isOpen && (
        <>
          {/* Backdrop when maximized */}
          {isMaximized && (
            <div
              className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm"
              onClick={handleClose}
              aria-hidden="true"
            />
          )}

          <div className={popupClasses}>
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-navy to-purple px-5 py-4">
              <h3 className="font-serif text-lg font-semibold text-primary-foreground">
                DealMind Assistant
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}
                >
                  {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-purple text-primary-foreground"
                          : "bg-pink/20 text-foreground"
                      }`}
                    >
                      {msg.content}
                      
                      {/* Product recommendation cards */}
                      {msg.role === "assistant" && msg.products && msg.products.length > 0 && (
                        <div className="mt-3 space-y-2 border-t border-pink/30 pt-3">
                          {msg.products.slice(0, 3).map((product, j) => (
                            <div key={j} className="rounded-lg bg-white/50 p-2 text-xs">
                              <p className="font-semibold text-navy line-clamp-2" title={product.title}>{product.title}</p>
                              {product.price && <p className="font-bold text-purple">{product.price}</p>}
                              <p className="text-muted-foreground">{product.source || "Unknown store"} {product.rating ? `· ${product.rating}★` : ""}</p>
                              <div className="mt-2 flex gap-2">
                                {product.link ? (
                                  <a
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-purple px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-purple/85"
                                  >
                                    View Deal
                                    <ExternalLink size={12} />
                                  </a>
                                ) : (
                                  <span className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-300 px-3 py-1.5 text-xs font-semibold text-white">
                                    No Link
                                  </span>
                                )}
                                <button
                                  onClick={() => setPriceAlertProduct({ 
                                    name: product.title, 
                                    price: product.price || "0", 
                                    link: product.link || "#",
                                    thumbnail: product.thumbnail,
                                    site: product.source || "google_shopping"
                                  })}
                                  className="inline-flex items-center justify-center rounded-lg border border-pink/40 bg-white px-3 py-1.5 transition-all hover:bg-pink/10"
                                >
                                  <Heart size={12} className="text-navy" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-pink/20 text-foreground flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-purple" />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-pink/20 bg-card p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-pink/30 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple text-primary-foreground transition-all hover:bg-purple/85 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Price Alert Modal */}
          <PriceAlertModal
            isOpen={priceAlertProduct !== null}
            onClose={() => setPriceAlertProduct(null)}
            productName={priceAlertProduct?.name || ""}
            currentPrice={(() => {
              if (!priceAlertProduct?.price) return "0";
              const raw = priceAlertProduct.price;
              const matches = raw.match(/\\d+(?:,\\d+)*(?:\\.\\d+)?/);
              if (matches) return matches[0].replace(/,/g, '');
              return "0";
            })()}
            productLink={priceAlertProduct?.link || "#"}
            productQuery={`Chatbot: ${priceAlertProduct?.name || "Product"}`}
            site={priceAlertProduct?.site || "unknown"}
            thumbnailUrl={priceAlertProduct?.thumbnail}
          />
        </>
      )}
    </>
  )
}
