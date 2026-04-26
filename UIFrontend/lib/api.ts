import { CompareResponse, ChatResponse, SaveItemRequest, WatchlistItemResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function fetchComparisonSync(query: string, mode: string = "balanced"): Promise<CompareResponse> {
  const res = await fetch(`${API_BASE_URL}/api/compare/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      mode,
      preferences: {
        mode,
        min_match_score: 0.4,
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch comparison: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function fetchChatResponse(message: string, chatHistory: any[]): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      chat_history: chatHistory,
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch chat response: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function saveWatchlistItem(data: SaveItemRequest): Promise<WatchlistItemResponse> {
  const res = await fetch(`${API_BASE_URL}/api/watchlist/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    let errorMessage = "Failed to save price alert";
    try {
        const errData = await res.json();
        if (errData.detail) errorMessage = errData.detail;
    } catch(e) {}
    throw new Error(errorMessage)
  }

  return res.json()
}
