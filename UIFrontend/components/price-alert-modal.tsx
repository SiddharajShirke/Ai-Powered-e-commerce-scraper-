"use client"

import { useState } from "react"
import { X, Mail, AlertCircle } from "lucide-react"
import { saveWatchlistItem } from "@/lib/api"
import { SaveItemRequest } from "@/lib/types"
import { useWishlist } from "@/app/wishlist-context"

interface PriceAlertModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  currentPrice: string
  productLink: string
  productQuery: string
  site: string
  thumbnailUrl?: string
}

export function PriceAlertModal({
  isOpen,
  onClose,
  productName,
  currentPrice,
  productLink,
  productQuery,
  site,
  thumbnailUrl,
}: PriceAlertModalProps) {
  const { addToWishlist } = useWishlist()
  const [email, setEmail] = useState("")
  const [selectedDropPercentage, setSelectedDropPercentage] = useState<5 | 10 | 20>(10)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    const payload: SaveItemRequest = {
      user_email: email,
      product_query: productQuery,
      product_title: productName,
      site: site,
      saved_price: parseFloat(currentPrice),
      product_url: productLink,
      thumbnail_url: thumbnailUrl,
      mode: "balanced",
      alert_threshold: selectedDropPercentage,
    }

    try {
      await saveWatchlistItem(payload)
      
      // Inject to local context so it shows up in `/wishlist` history natively
      addToWishlist({
        id: `${site}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: productName,
        price: `₹${parseFloat(currentPrice).toLocaleString('en-IN')}`,
        image: thumbnailUrl || "/images/iphone15.jpg",
        marketplace: site,
        link: productLink,
        email: email
      })

      setIsSuccess(true)
      
      // Close after 2.5 seconds
      setTimeout(() => {
        handleClose()
      }, 2500)
    } catch (err: any) {
      console.error("[PriceAlertModal] Failed to save:", err)
      setError(err?.message || "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setSelectedDropPercentage(10)
    setIsSuccess(false)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-card p-8 shadow-2xl shadow-navy/20 transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-pink/20 hover:text-navy"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {!isSuccess ? (
          <>
            {/* Title */}
            <h2 className="mb-2 font-serif text-2xl font-bold text-navy">
              Create Price Alert
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              For: <span className="font-semibold text-navy line-clamp-2">{productName}</span>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-navy">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-pink/40 bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground transition-all focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
                  />
                </div>
              </div>

              {/* Price Drop Percentage */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-navy">
                  Alert when price drops by
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 20].map((percentage) => (
                    <button
                      key={percentage}
                      type="button"
                      onClick={() => setSelectedDropPercentage(percentage as 5 | 10 | 20)}
                      className={`rounded-lg border-2 px-4 py-3 font-semibold transition-all duration-200 ${
                        selectedDropPercentage === percentage
                          ? "border-purple bg-purple/10 text-purple"
                          : "border-pink/30 bg-card text-navy hover:border-pink/50"
                      }`}
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!email.trim() || isSubmitting}
                className="mt-2 rounded-xl bg-purple px-6 py-3 font-serif font-semibold text-primary-foreground shadow-lg shadow-purple/30 transition-all duration-300 hover:bg-purple/85 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  "Save and Get Email Alerts"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="rounded-full bg-purple/10 p-4">
              <svg
                className="h-6 w-6 text-purple"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold text-navy">Price Alert Created!</h3>
            <p className="text-center text-sm text-muted-foreground">
              We'll email you at <span className="font-semibold">{email}</span> when the price drops
              by {selectedDropPercentage}%
            </p>
          </div>
        )}
      </div>
    </>
  )
}
