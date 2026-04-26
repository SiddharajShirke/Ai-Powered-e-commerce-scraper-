"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, MessageCircle, User, Heart } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSearchClick = () => {
    if (pathname === "/dashboard") {
      const searchInput = document.getElementById("hero-search-input")
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: "smooth", block: "center" })
        setTimeout(() => searchInput.focus(), 400)
      }
    } else {
      router.push("/dashboard#search")
    }
  }

  const navItems = [
    { key: "home", href: "/dashboard", icon: Home, label: "Home" },
    { key: "search", href: "#", icon: Search, label: "Search", onClick: handleSearchClick },
    { key: "wishlist", href: "/wishlist", icon: Heart, label: "Wishlist" },
    { key: "chatbot", href: "/chatbot", icon: MessageCircle, label: "Chatbot" },
    { key: "profile", href: "/login", icon: User, label: "Profile" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-pink/20 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-serif text-2xl font-bold text-navy transition-opacity hover:opacity-80"
        >
          DealMind
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Component = item.onClick ? "button" : Link
            const props = item.onClick
              ? { onClick: item.onClick }
              : { href: item.href }

            return (
              <Component
                key={item.key}
                {...(props as Record<string, unknown>)}
                className={`group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-pink/40 ${
                  isActive ? "bg-pink/30" : ""
                }`}
                aria-label={item.label}
              >
                <item.icon
                  size={20}
                  className="text-navy transition-colors group-hover:text-purple"
                />
                <span className="sr-only">{item.label}</span>
              </Component>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
