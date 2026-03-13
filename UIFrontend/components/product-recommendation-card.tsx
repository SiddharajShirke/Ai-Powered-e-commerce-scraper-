"use client"

import { ExternalLink, Heart } from "lucide-react"

interface ProductRecommendationCardProps {
  name: string
  price: string
  marketplace: string
  rating: number
  onViewDeal: () => void
  onPriceAlert: () => void
}

export function ProductRecommendationCard({
  name,
  price,
  marketplace,
  rating,
  onViewDeal,
  onPriceAlert,
}: ProductRecommendationCardProps) {
  return (
    <div className="rounded-xl bg-white/70 backdrop-blur-sm p-3 border border-pink/20 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <p className="font-semibold text-sm text-navy line-clamp-2">{name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{marketplace}</p>
        </div>
        <p className="font-bold text-purple text-sm whitespace-nowrap">{price}</p>
      </div>

      {/* Rating */}
      <div className="mb-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-purple text-purple" : "fill-pink/30 text-pink/30"}`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
          <span className="text-xs text-muted-foreground ml-1">{rating}★</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onViewDeal}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-purple px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-purple/85 active:scale-95"
        >
          View Deal
          <ExternalLink size={12} />
        </button>
        <button
          onClick={onPriceAlert}
          className="inline-flex items-center justify-center rounded-lg border border-pink/40 bg-white px-3 py-2 transition-all hover:bg-pink/10 active:scale-95"
          aria-label="Set price alert"
        >
          <Heart size={14} className="text-navy" />
        </button>
      </div>
    </div>
  )
}
