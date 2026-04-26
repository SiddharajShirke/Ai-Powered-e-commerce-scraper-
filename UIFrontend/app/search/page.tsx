"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { BestDealCard, RankedOffers } from "@/components/search-results"
import { Chatbot } from "@/components/chatbot"
import { Footer } from "@/components/footer"
import { SearchLoader } from "@/components/search-loader"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { fetchComparisonSync } from "@/lib/api"
import { CompareResponse } from "@/lib/types"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || "Product"
  
  const [data, setData] = useState<CompareResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const responseData = await fetchComparisonSync(query)
        setData(responseData)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchData()
    }
  }, [query])

  if (loading) {
    return <SearchLoader />
  }

  return (
    <>
      {/* Back + Query */}
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 pt-8">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-navy shadow-sm transition-all hover:bg-pink/30"
          aria-label="Go back to dashboard"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">Search results for</p>
          <h1 className="font-serif text-2xl font-bold text-navy">{query}</h1>
        </div>
      </div>

      {error ? (
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-pink/10 p-8 text-center border border-pink/30">
            <AlertCircle className="h-12 w-12 text-pink mb-4" />
            <h2 className="font-serif text-xl font-bold text-navy mb-2">Oops! Something went wrong</h2>
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-navy px-6 py-2 text-white transition-all hover:bg-navy/90"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : !data?.final_offers || data.final_offers.length === 0 ? (
        <div className="mx-auto max-w-4xl px-6 py-12 text-center">
          <div className="rounded-2xl bg-card p-12 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-navy mb-2">No deals found</h2>
            <p className="text-muted-foreground">We couldn't find any deals for "{query}". Try searching for something else.</p>
          </div>
        </div>
      ) : (
        <>
           {data.recommendation && (
             <BestDealCard query={query} offer={data.recommendation} />
           )}
           <RankedOffers query={query} offers={data.final_offers} />
        </>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
      <Suspense fallback={<SearchLoader />}>
        <SearchContent />
      </Suspense>
      </main>

      <Footer />
      <Chatbot />
    </div>
  )
}
