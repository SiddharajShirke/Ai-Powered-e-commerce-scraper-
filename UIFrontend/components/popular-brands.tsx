"use client"

import { useRouter } from "next/navigation"

const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "OnePlus",
  "Lakme",
  "Boat",
  "Dell",
  "Nike",
]

export function PopularBrands() {
  const router = useRouter()

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-center font-serif text-3xl font-bold text-navy md:text-4xl">
          Popular Brands
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => router.push(`/search?q=${encodeURIComponent(brand)}`)}
              className="rounded-full border border-pink bg-card px-8 py-3 font-serif text-sm font-semibold text-navy transition-all duration-300 hover:border-purple hover:bg-purple hover:text-primary-foreground hover:shadow-md hover:shadow-purple/20"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
