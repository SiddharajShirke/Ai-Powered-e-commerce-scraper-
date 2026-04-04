"use client"

import Image from "next/image"

interface ProductCardProps {
  name: string
  image: string
  href?: string
}

export function ProductCard({ name, image, href = "#" }: ProductCardProps) {
  return (
    <a
      href={href}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-pink/50 bg-card p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:border-pink hover:shadow-lg hover:shadow-pink/20 cursor-pointer"
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-xl sm:h-24 sm:w-24">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <p className="font-serif text-xs font-semibold text-navy sm:text-sm text-center">{name}</p>
    </a>
  )
}
