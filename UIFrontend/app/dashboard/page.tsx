"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSearch } from "@/components/hero-search"
import { WhyChoose } from "@/components/why-choose"
import { Marketplaces } from "@/components/marketplaces"
import { TrendingSearches } from "@/components/trending-searches"
import { PopularBrands } from "@/components/popular-brands"
import { Chatbot } from "@/components/chatbot"
import { Footer } from "@/components/footer"

export default function DashboardPage() {
  useEffect(() => {
    if (window.location.hash === "#search") {
      setTimeout(() => {
        const el = document.getElementById("hero-search-input")
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" })
          setTimeout(() => el.focus(), 400)
        }
      }, 100)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <HeroSearch />
        <WhyChoose />
        <Marketplaces />
        <TrendingSearches />
        <PopularBrands />
      </main>

      <Footer />
      <Chatbot />
    </div>
  )
}
