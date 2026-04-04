'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useWishlist } from '@/app/wishlist-context'
import { Mail, Send, Trash2, Heart, ExternalLink } from 'lucide-react'

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendWishlist = () => {
    if (email.trim()) {
      setIsLoading(true)
      // Simulate sending (in a real app, this would call an API)
      setTimeout(() => {
        setSubmitted(true)
        setIsLoading(false)
        setTimeout(() => {
          setEmail('')
          setSubmitted(false)
        }, 3000)
      }, 800)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-bold text-navy mb-2">My Wishlist & Alerts</h1>
            <p className="text-muted-foreground">Keep track of items you love and active price drop alerts.</p>
          </div>

          {/* Email Section */}
          <div className="mb-12 rounded-2xl bg-card p-8 shadow-lg shadow-pink/10">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="wishlist-email" className="block text-sm font-medium text-navy mb-2">
                  Share Your Wishlist
                </label>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your email to send yourself this wishlist for later
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="wishlist-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-pink/40 bg-background py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground transition-all focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
                  />
                </div>
                <button
                  onClick={handleSendWishlist}
                  disabled={!email.trim() || isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple px-8 py-3 font-serif font-semibold text-primary-foreground shadow-lg shadow-purple/30 transition-all duration-300 hover:bg-purple/85 disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:bg-purple"
                >
                  <Send size={18} className={isLoading ? 'animate-spin' : ''} />
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
              {submitted && (
                <div className="rounded-lg bg-purple/10 border border-purple/30 p-3 text-sm font-medium text-purple flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple"></div>
                  Wishlist sent to {email}!
                </div>
              )}
            </div>
          </div>

          {/* Wishlist Items */}
          <div>
            <h2 className="mb-6 font-serif text-2xl font-bold text-navy">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
            </h2>

            {wishlistItems.length === 0 ? (
              <div className="rounded-2xl bg-card p-16 text-center shadow-sm">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink/20 to-purple/10">
                  <Heart size={40} className="fill-pink text-pink" />
                </div>
                <h3 className="mb-3 font-serif text-2xl font-bold text-navy">
                  Your wishlist is empty
                </h3>
                <p className="mb-6 text-muted-foreground max-w-sm mx-auto">
                  Start adding items from search results or the chatbot to compare prices across marketplaces.
                </p>
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-purple px-8 py-3 font-serif font-semibold text-primary-foreground shadow-lg shadow-purple/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple/85 hover:shadow-xl"
                >
                  Start Shopping
                </a>
              </div>
            ) : (
              <div className="grid gap-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink/15 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Image / Details Row */}
                    <div className="flex shrink-0 items-center gap-4 flex-1">
                      {/* Product Image */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white p-1 border border-pink/10 shadow-sm">
                        <Image
                          src={item.image || "/images/iphone15.jpg"}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg font-semibold text-navy mb-1 line-clamp-2" title={item.name}>
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm rounded-md bg-pink/20 text-navy px-2 py-0.5 font-medium">
                            {item.marketplace}
                          </span>
                          {item.email && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail size={12}/> Alert set for {item.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6 shrink-0 border-t border-pink/10 sm:border-0 pt-3 sm:pt-0">
                      <p className="font-serif text-2xl font-bold text-purple whitespace-nowrap">
                        {item.price}
                      </p>
                      
                      {/* CTA Buttons */}
                      <div className="flex items-center gap-3">
                        <a
                           href={item.link || "#"}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={`${item.link ? "" : "pointer-events-none opacity-50"} inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-purple bg-card px-4 py-2 font-serif text-sm font-semibold text-purple transition-all duration-300 hover:bg-purple hover:text-primary-foreground hover:shadow-md hover:shadow-purple/30`}
                        >
                          View Deal
                          <ExternalLink size={14} />
                        </a>
                        
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-red-200 bg-card text-red-400 transition-all duration-300 hover:bg-red-50 hover:border-red-400 hover:text-red-500"
                          aria-label={`Remove ${item.name} from wishlist`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
