"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl shadow-pink/10">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-navy">DealMind</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to find the best deals
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="loginId" className="font-serif text-sm font-medium text-navy">
              Login ID
            </label>
            <input
              id="loginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Enter your login ID"
              className="rounded-xl border border-pink/50 bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-serif text-sm font-medium text-navy">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-pink/50 bg-card px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground transition-all focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-navy"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-full bg-purple py-3 font-serif font-semibold text-primary-foreground shadow-lg shadow-purple/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple/85 hover:shadow-xl hover:shadow-purple/40"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <span className="cursor-pointer font-medium text-purple transition-colors hover:text-navy">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  )
}
