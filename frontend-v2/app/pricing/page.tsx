"use client"

import { Check, X } from "lucide-react"

export default function PricingPage() {
  const handleSubscribe = async () => {
    // 1. In production, ensure user is logged in
    // 2. Call the backend API (or Next.js Server Action) to invoke stripeUtils.createCheckoutSession
    // 3. Redirect the user to the Stripe Checkout URL returned
    alert("Stripe Checkout Session Initiated (Mock)")
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Upgrade your Analytics Game
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Unlock the full power of the Football Intelligence Predictor
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">

        {/* Free Tier */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Base Analyst</h2>
          <p className="mt-4 text-sm text-muted-foreground">Perfect for casual fans tracking team progress.</p>
          <div className="mt-6 flex items-baseline gap-x-2">
            <span className="text-4xl font-bold tracking-tight text-foreground">$0</span>
            <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
          </div>

          <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
            <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" /> Live Standings (Home/Away Splits)</li>
            <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" /> Match Fixtures</li>
            <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" /> Global League Overview</li>
            <li className="flex gap-x-3"><X className="h-6 w-5 flex-none text-muted-foreground/50" /> Advanced AI Predictions</li>
            <li className="flex gap-x-3"><X className="h-6 w-5 flex-none text-muted-foreground/50" /> Deep Head-to-Head Analytics</li>
          </ul>

          <button className="mt-8 block w-full rounded-md bg-secondary px-3 py-2 text-center text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
            Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div className="rounded-2xl border-2 border-primary bg-card p-8 shadow-xl relative">
          <div className="absolute -top-4 right-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </div>
          <h2 className="text-2xl font-bold text-primary">Pro Predictor</h2>
          <p className="mt-4 text-sm text-muted-foreground">Serious tools for data-driven football analysis.</p>
          <div className="mt-6 flex items-baseline gap-x-2">
            <span className="text-4xl font-bold tracking-tight text-foreground">$19.99</span>
            <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
          </div>

          <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
            <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" /> Everything in Base</li>
            <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" /> Full API Database Syncing Access</li>
            <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" /> Advanced AI Predictions (All Leagues)</li>
            <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" /> Deep Head-to-Head Analytics</li>
            <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" /> Probability Gauges & Value Bets</li>
          </ul>

          <button
            onClick={handleSubscribe}
            className="mt-8 block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary animate-pulse"
          >
            Upgrade via Stripe
          </button>
        </div>

      </div>
    </div>
  )
}
