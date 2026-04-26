import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-navy py-8 text-light-bg">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
        <p className="font-serif text-sm font-medium text-light-bg">
          {"DealMind \u00A9 2026"}
        </p>
        <div className="flex gap-6 text-sm">
          <Link href="#" className="text-pink transition-colors hover:text-light-bg">
            About
          </Link>
          <Link href="#" className="text-pink transition-colors hover:text-light-bg">
            Privacy
          </Link>
          <Link href="#" className="text-pink transition-colors hover:text-light-bg">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
