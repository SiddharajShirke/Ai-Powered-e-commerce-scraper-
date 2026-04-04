"use client"

import Image from "next/image"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"

const products = [
  { name: "iPhone 15", image: "/images/iphone15.jpg" },
  { name: "Sony DSLR Camera", image: "/images/sony-camera.jpg" },
  { name: "Lakme Serum", image: "/images/lakme-serum.jpg" },
  { name: "Boat Headphones", image: "/images/boat-headphones.jpg" },
]

export default function HeroPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center px-6 py-16 lg:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 lg:flex-row">
          {/* Left Side */}
          <div className="flex flex-1 flex-col items-center gap-8 lg:items-start">
            <h1 className="font-serif text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-navy to-purple bg-clip-text text-transparent">
                DealMind
              </span>
            </h1>

            <p className="max-w-md text-center text-lg leading-relaxed text-muted-foreground lg:text-left">
              An agentic price comparing shopping browser.{" "}
              Compare real-time deals across top marketplaces.{" "}
              Find the smartest purchase in seconds.
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.name}
                  name={product.name}
                  image={product.image}
                />
              ))}
            </div>

            <Link
              href="/login"
              className="group mt-4 inline-flex items-center gap-2 rounded-full bg-purple px-10 py-4 font-serif text-lg font-semibold text-primary-foreground shadow-lg shadow-purple/30 transition-all duration-300 hover:-translate-y-1 hover:bg-purple/85 hover:shadow-xl hover:shadow-purple/40"
            >
              Start Now
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Right Side */}
          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative h-[380px] w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl shadow-purple/20 lg:h-[520px]">
              <Image
                src="/images/hero-collage.jpg"
                alt="DealMind product collage featuring smartphones, cameras, headphones, and beauty products"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-navy/30 to-transparent" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
