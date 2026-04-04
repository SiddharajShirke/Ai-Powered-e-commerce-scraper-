"use client"

import { useState } from "react";
import Image from "next/image";
import { Award, Star, Truck, ShieldCheck, ExternalLink, Heart } from "lucide-react"
import { useWishlist } from "@/app/wishlist-context"
import { PriceAlertModal } from "@/components/price-alert-modal"
import { NormalizedOffer } from "@/lib/types"

interface RatingBarProps {
  label: string
  percentage: number
  stars: number
}

function RatingBar({ label, percentage, stars }: RatingBarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < stars ? "fill-purple text-purple" : "fill-pink/30 text-pink/30"}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-navy">({percentage}%)</span>
    </div>
  )
}

function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0;
  const numMatches = priceStr.match(/\\d+(?:,\\d+)*(?:\\.\\d+)?/);
  if (numMatches) {
    return parseFloat(numMatches[0].replace(/,/g, ''));
  }
  return 0;
}

export function BestDealCard({ query, offer }: { query: string, offer: NormalizedOffer }) {
  const [showPriceAlert, setShowPriceAlert] = useState(false)

  // STRICT RULE: Feature 1 - Final calculated price ONLY
  const currentPriceRaw = offer.effective_price || parsePrice(offer.raw_price)
  const currentPriceDisplay = `₹${currentPriceRaw.toLocaleString('en-IN')}`

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-xl shadow-pink/10 transition-all duration-300 hover:shadow-2xl hover:shadow-pink/15 md:flex-row">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gradient-to-br from-pink/10 to-purple/5 p-8 md:w-2/5">
            <div className="relative h-52 w-52 overflow-hidden rounded-2xl bg-card shadow-md">
              <Image
                src={offer.image_url || "/images/iphone15.jpg"}
                alt={offer.title}
                fill
                className="object-contain bg-white p-2"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col justify-center gap-4 p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-serif text-2xl font-bold text-navy line-clamp-2">{offer.title}</h2>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-pink/40 px-3.5 py-1.5 text-xs font-bold text-navy">
                <Award size={14} />
                Best Deal from {offer.site}
              </span>
            </div>

            <p className="font-serif text-4xl font-bold text-purple">
              {currentPriceDisplay}
            </p>

            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Truck size={16} className="text-purple" />
                {offer.delivery || "Delivery details unavailable"}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-purple" />
                Trust Score: {Math.round((offer.score_breakdown?.trust_score || 0) * 100)}%
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={offer.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-purple px-8 py-3.5 font-serif font-semibold text-primary-foreground shadow-lg shadow-purple/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple/85 hover:shadow-xl"
              >
                View Deal
                <ExternalLink size={16} />
              </a>
              <button
                onClick={() => setShowPriceAlert(true)}
                className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-pink/40 bg-card px-8 py-3.5 font-serif font-semibold text-navy transition-all duration-300 hover:border-pink/60 hover:bg-pink/10"
              >
                <Heart size={16} />
                Price Alert
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={showPriceAlert}
        onClose={() => setShowPriceAlert(false)}
        productName={offer.title}
        currentPrice={currentPriceRaw.toString()}
        productLink={offer.url || "#"}
        productQuery={query}
        site={offer.site || "unknown"}
        thumbnailUrl={offer.image_url}
      />
    </>
  )
}

export function RankedOffers({ query, offers }: { query: string, offers: NormalizedOffer[] }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [localWishlist, setLocalWishlist] = useState<Set<string>>(new Set())
  const [selectedOffer, setSelectedOffer] = useState<NormalizedOffer | null>(null)
  const [priceAlertIndex, setPriceAlertIndex] = useState<number | null>(null)

  const handleWishlist = (offer: NormalizedOffer, index: number) => {
    const itemId = `${offer.site}-${index}`
    if (isInWishlist(itemId)) {
      removeFromWishlist(itemId)
      setLocalWishlist((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    } else {
      const currentPriceRaw = offer.effective_price || parsePrice(offer.raw_price)
      addToWishlist({
        id: itemId,
        name: offer.title,
        price: `₹${currentPriceRaw.toLocaleString('en-IN')}`,
        image: offer.image_url || "/images/iphone15.jpg",
        marketplace: offer.site,
        link: offer.url || "#"
      })
      setLocalWishlist((prev) => new Set(prev).add(itemId))
    }
  }

  const handlePriceAlert = (offer: NormalizedOffer, index: number) => {
    setSelectedOffer(offer)
    setPriceAlertIndex(index)
  }

  if (!offers || offers.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <h3 className="mb-6 font-serif text-2xl font-bold text-navy">Ranked Offers</h3>

      <div className="flex flex-col gap-4">
        {offers.map((offer, i) => {
          const itemId = `${offer.site}-${i}`
          const isWishlisted = isInWishlist(itemId)
          
          const trustPct = Math.round((offer.score_breakdown?.trust_score || 0) * 100)
          const trustStars = Math.round((offer.score_breakdown?.trust_score || 0) * 5)
          
          const deliveryPct = Math.round((offer.score_breakdown?.delivery_score || 0) * 100)
          const deliveryStars = Math.round((offer.score_breakdown?.delivery_score || 0) * 5)
          
          const pricePct = Math.round((offer.score_breakdown?.price_score || 0) * 100)
          const priceStars = Math.round((offer.score_breakdown?.price_score || 0) * 5)

          // STRICT RULE: Feature 1 - Final calculated price ONLY
          const currentPriceRaw = offer.effective_price || parsePrice(offer.raw_price)
          const currentPriceDisplay = `₹${currentPriceRaw.toLocaleString('en-IN')}`

          return (
            <div
              key={`${offer.site}-${i}`}
              className="group flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink/15 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Rank badge + Thumbnail */}
              <div className="flex shrink-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy to-purple font-serif text-sm font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-1 border border-pink/10 shadow-sm">
                  <Image
                    src={offer.image_url || "/images/iphone15.jpg"}
                    alt={offer.site}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Marketplace + Price + Delivery */}
              <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-8">
                <div className="min-w-[130px] flex-1">
                  <p className="font-serif text-lg font-semibold text-navy">
                    {offer.site}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1 truncate block max-w-[200px]" title={offer.title}>
                    {offer.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Delivery: {offer.delivery || "N/A"}
                  </p>
                </div>

                <p className="font-serif text-xl font-bold text-purple shrink-0">{currentPriceDisplay}</p>
              </div>

              {/* Ratings */}
              <div className="flex flex-col gap-1.5 shrink-0 min-w-[140px]">
                <RatingBar label="Trust" percentage={trustPct} stars={trustStars} />
                <RatingBar
                  label="Delivery"
                  percentage={deliveryPct}
                  stars={deliveryStars}
                />
                <RatingBar
                  label="Price"
                  percentage={pricePct}
                  stars={priceStars}
                />
              </div>

              {/* CTA + Price Alert + View Deal */}
              <div className="flex shrink-0 items-center gap-3 sm:ml-auto">
                <button
                  onClick={() => handlePriceAlert(offer, i)}
                  className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-pink/40 bg-card px-4 py-2.5 font-serif text-sm font-semibold transition-all duration-300 hover:scale-110 hover:border-pink/60 hover:shadow-md hover:shadow-pink/20"
                  aria-label="Set price alert"
                >
                  <Heart
                    size={18}
                    className="text-navy"
                  />
                </button>
                <a
                  href={offer.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-purple bg-card px-6 py-2.5 font-serif text-sm font-semibold text-purple transition-all duration-300 hover:bg-purple hover:text-primary-foreground hover:shadow-lg hover:shadow-purple/30"
                >
                  View Deal
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-center text-sm italic text-muted-foreground">
        Ranking based on Trust, Delivery Speed, and Price Score.
      </p>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={selectedOffer !== null}
        onClose={() => {
          setSelectedOffer(null)
          setPriceAlertIndex(null)
        }}
        productName={selectedOffer ? selectedOffer.title : ""}
        currentPrice={selectedOffer ? (selectedOffer.effective_price?.toString() || parsePrice(selectedOffer.raw_price).toString()) : ""}
        productLink={selectedOffer?.url || "#"}
        productQuery={query}
        site={selectedOffer?.site || "unknown"}
        thumbnailUrl={selectedOffer?.image_url}
      />
    </section>
  )
}

