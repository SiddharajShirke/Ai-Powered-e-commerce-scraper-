import { BarChart3, Zap, Truck, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Price Comparison",
    description: "Compare prices across all major marketplaces instantly.",
  },
  {
    icon: Zap,
    title: "Smart Deal Ranking",
    description: "AI-powered ranking based on trust, price, and delivery.",
  },
  {
    icon: Truck,
    title: "Fastest Delivery Insights",
    description: "Know which seller delivers the fastest to your location.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Seller Ratings",
    description: "Verified ratings from real buyers across platforms.",
  },
]

export function WhyChoose() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-center font-serif text-3xl font-bold text-navy md:text-4xl text-balance">
          Why Choose DealMind?
        </h2>
        <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
          Everything you need to make smarter purchase decisions
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col items-center gap-4 rounded-2xl bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink/20"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple/15 to-pink/15 transition-all duration-300 group-hover:from-purple/25 group-hover:to-pink/25">
                <feature.icon size={28} className="text-purple" />
              </div>
              <h3 className="text-center font-serif text-lg font-semibold text-navy">
                {feature.title}
              </h3>
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
