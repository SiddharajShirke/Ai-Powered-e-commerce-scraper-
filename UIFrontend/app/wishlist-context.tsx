'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface WishlistItem {
  id: string
  name: string
  price: string
  image: string
  marketplace: string
  link?: string
  email?: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prev) => {
      const exists = prev.some((w) => w.id === item.id)
      if (!exists) {
        return [...prev, item]
      }
      return prev
    })
  }

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((w) => w.id !== id))
  }

  const isInWishlist = (id: string) => {
    return wishlistItems.some((w) => w.id === id)
  }

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
