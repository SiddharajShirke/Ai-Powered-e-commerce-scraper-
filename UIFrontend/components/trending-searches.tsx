"use client"

import { useRouter } from "next/navigation"
import { TrendingUp } from "lucide-react"

const trending = [
  "iPhone 15 128GB",
  "Samsung S24",
  "Sony Alpha Camera",
  "OnePlus 12",
  "Lakme Serum",
  "Boat Headphones",
  "MacBook Air M3",
  "PS5 Slim",
]

export function TrendingSearches() {
  const router = useRouter()

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-center gap-2">
          <TrendingUp size={24} className="text-purple" />
          <h2 className="text-center font-serif text-3xl font-bold text-navy md:text-4xl">
            Trending Searches
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {trending.map((term) => (
            <button
              key={term}
              onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
              className="rounded-full bg-pink/30 px-6 py-2.5 text-sm font-medium text-navy transition-all duration-300 hover:bg-purple hover:text-primary-foreground hover:shadow-md hover:shadow-purple/20"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
