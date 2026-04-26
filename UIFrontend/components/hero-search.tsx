"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <section id="search" className="flex flex-col items-center gap-6 px-6 py-20">
      <h2 className="text-center font-serif text-3xl font-bold text-navy md:text-4xl lg:text-5xl text-balance">
        Find the Best Deals
      </h2>
      <p className="max-w-lg text-center leading-relaxed text-muted-foreground">
        Search across top marketplaces to find the smartest purchase instantly
      </p>
      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-2xl flex-col items-center gap-4 sm:flex-row"
      >
        <div className="relative w-full flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="hero-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for iPhone 15, Sony Camera, Lakme Serum..."
            className="w-full rounded-2xl border border-pink/40 bg-card py-4 pl-12 pr-4 text-foreground shadow-sm placeholder:text-muted-foreground transition-all focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-2xl bg-purple px-8 py-4 font-serif font-semibold text-primary-foreground shadow-lg shadow-purple/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple/85 hover:shadow-xl hover:shadow-purple/40 sm:w-auto"
        >
          Search
        </button>
      </form>
    </section>
  )
}
