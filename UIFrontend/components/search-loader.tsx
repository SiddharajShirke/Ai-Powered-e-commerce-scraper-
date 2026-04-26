"use client"

import { useEffect, useState } from "react"
import { Globe, CheckCircle2 } from "lucide-react"

interface FetchSource {
  name: string
  url: string
  status: "pending" | "loading" | "complete"
}

const MARKETPLACE_SOURCES: FetchSource[] = [
  { name: "Amazon India", url: "amazon.in", status: "pending" },
  { name: "Flipkart", url: "flipkart.com", status: "pending" },
  { name: "Meesho", url: "meesho.com", status: "pending" },
  { name: "Vijay Sales", url: "vijaysales.com", status: "pending" },
  { name: "Croma", url: "croma.com", status: "pending" },
  { name: "eBay India", url: "ebay.in", status: "pending" },
  { name: "JioMart", url: "jiomart.com", status: "pending" },
  { name: "Big Basket", url: "bigbasket.com", status: "pending" },
]

export function SearchLoader() {
  const [seconds, setSeconds] = useState(0)
  const [sources, setSources] = useState<FetchSource[]>(MARKETPLACE_SOURCES)

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate fetching from each source
  useEffect(() => {
    const fetchInterval = setInterval(() => {
      setSources((prev) => {
        const updated = [...prev]
        const pendingIndex = updated.findIndex((s) => s.status === "pending")
        if (pendingIndex !== -1) {
          updated[pendingIndex].status = "loading"
          // Mark as complete after 500ms
          setTimeout(() => {
            setSources((current) => {
              const next = [...current]
              next[pendingIndex].status = "complete"
              return next
            })
          }, 500)
        }
        return updated
      })
    }, 800)

    return () => clearInterval(fetchInterval)
  }, [])

  const completedCount = sources.filter((s) => s.status === "complete").length
  const currentlyLoadingSource = sources.find((s) => s.status === "loading")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      {/* Main Loading Container */}
      <div className="w-full max-w-2xl space-y-8">
        {/* Timer Circle */}
        <div className="flex justify-center">
          <div className="relative h-32 w-32">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#F1E9E9"
                strokeWidth="2"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#982598"
                strokeWidth="2"
                strokeDasharray={`${(completedCount / MARKETPLACE_SOURCES.length) * 339.29} 339.29`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-4xl font-bold text-navy">
                {seconds}
              </span>
              <span className="text-sm text-muted-foreground">seconds</span>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="font-serif text-2xl font-bold text-navy">
            Searching {completedCount} of {MARKETPLACE_SOURCES.length}
          </p>
          <p className="mt-2 text-muted-foreground">
            {currentlyLoadingSource
              ? `Currently fetching from ${currentlyLoadingSource.name}...`
              : "Fetching real-time deals from marketplaces..."}
          </p>
          <p className="mt-1 text-xs text-purple font-medium">
            {completedCount > 0 && `✓ ${completedCount} marketplace${completedCount > 1 ? "s" : ""} complete`}
          </p>
        </div>

        {/* Marketplace Sources Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {sources.map((source, index) => (
            <div
              key={source.url}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-300 ${
                source.status === "complete"
                  ? "border-purple bg-purple/5"
                  : source.status === "loading"
                    ? "border-pink bg-pink/10"
                    : "border-light-bg bg-light-bg"
              }`}
            >
              {/* Status Icon */}
              <div className="relative h-8 w-8 shrink-0">
                {source.status === "complete" ? (
                  <CheckCircle2 size={24} className="text-purple" />
                ) : source.status === "loading" ? (
                  <>
                    <Globe
                      size={24}
                      className="animate-spin text-pink"
                      style={{ animationDuration: "1.5s" }}
                    />
                  </>
                ) : (
                  <Globe size={24} className="text-muted-foreground/40" />
                )}
              </div>

              {/* Source Name */}
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-semibold ${
                    source.status === "complete"
                      ? "text-navy"
                      : source.status === "loading"
                        ? "text-navy"
                        : "text-muted-foreground"
                  }`}
                >
                  {source.name}
                </p>
                <p className="truncate text-xs text-muted-foreground/60">
                  {source.url}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Info */}
        <div className="space-y-3 rounded-2xl bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-navy">Completed</span>
            <span className="font-serif text-lg font-bold text-purple">
              {completedCount}/{MARKETPLACE_SOURCES.length}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-light-bg">
            <div
              className="h-full bg-gradient-to-r from-pink to-purple transition-all duration-500"
              style={{
                width: `${(completedCount / MARKETPLACE_SOURCES.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {completedCount === MARKETPLACE_SOURCES.length
              ? "✓ All sources fetched successfully"
              : "Fetching data in real-time..."}
          </p>
        </div>

        {/* Loading Animation Text */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Searching best deals</span>
          <div className="flex gap-1">
            <div
              className="h-1.5 w-1.5 rounded-full bg-purple animate-pulse"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="h-1.5 w-1.5 rounded-full bg-purple animate-pulse"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="h-1.5 w-1.5 rounded-full bg-purple animate-pulse"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
