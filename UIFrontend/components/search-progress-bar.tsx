"use client"

import { useEffect, useState } from "react"
import { Globe, CheckCircle2 } from "lucide-react"

interface FetchSource {
  name: string
  status: "pending" | "loading" | "complete"
}

const QUICK_SOURCES: FetchSource[] = [
  { name: "Amazon", status: "pending" },
  { name: "Flipkart", status: "pending" },
  { name: "Meesho", status: "pending" },
  { name: "Vijay Sales", status: "pending" },
]

export function SearchProgressBar() {
  const [seconds, setSeconds] = useState(0)
  const [sources, setSources] = useState<FetchSource[]>(QUICK_SOURCES)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchInterval = setInterval(() => {
      setSources((prev) => {
        const updated = [...prev]
        const pendingIndex = updated.findIndex((s) => s.status === "pending")
        if (pendingIndex !== -1) {
          updated[pendingIndex].status = "loading"
          setTimeout(() => {
            setSources((current) => {
              const next = [...current]
              next[pendingIndex].status = "complete"
              return next
            })
          }, 600)
        }
        return updated
      })
    }, 1000)

    return () => clearInterval(fetchInterval)
  }, [])

  const completedCount = sources.filter((s) => s.status === "complete").length

  // Auto-hide when complete
  useEffect(() => {
    if (completedCount === QUICK_SOURCES.length) {
      setTimeout(() => setIsVisible(false), 500)
    }
  }, [completedCount])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 right-6 z-40 max-w-sm rounded-2xl bg-card shadow-xl shadow-purple/20 border border-purple/20 p-4 md:left-auto">
      <div className="space-y-3">
        {/* Header with timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple animate-pulse" />
            <span className="text-sm font-semibold text-navy">
              Searching deals
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {seconds}s
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-light-bg">
          <div
            className="h-full bg-gradient-to-r from-pink to-purple transition-all duration-300"
            style={{
              width: `${(completedCount / QUICK_SOURCES.length) * 100}%`,
            }}
          />
        </div>

        {/* Source indicators */}
        <div className="flex gap-2">
          {sources.map((source) => (
            <div
              key={source.name}
              className="flex flex-1 items-center gap-1.5 rounded-lg bg-light-bg px-2 py-1.5"
            >
              {source.status === "complete" ? (
                <CheckCircle2 size={14} className="shrink-0 text-purple" />
              ) : source.status === "loading" ? (
                <Globe
                  size={14}
                  className="shrink-0 animate-spin text-pink"
                  style={{ animationDuration: "1.5s" }}
                />
              ) : (
                <div className="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/30" />
              )}
              <span className="truncate text-xs font-medium text-navy">
                {source.name}
              </span>
            </div>
          ))}
        </div>

        {/* Status text */}
        <p className="text-xs text-muted-foreground text-center">
          {completedCount === QUICK_SOURCES.length
            ? "✓ All sources complete"
            : `${completedCount} of ${QUICK_SOURCES.length} sources fetched`}
        </p>
      </div>
    </div>
  )
}
