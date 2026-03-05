"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Trophy, Calendar, Users, Activity, BarChart3, Database, Swords, Crown, Medal } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  const tabs = [
    { name: "Leagues", href: "/leagues", icon: Trophy },
    { name: "Fixtures", href: "/fixtures", icon: Calendar },
    { name: "Standings", href: "/", icon: Medal },
    { name: "Squad Stats", href: "/squads", icon: Users },
    { name: "Players", href: "/players", icon: Activity },
    { name: "Predictions", href: "/predictions", icon: BarChart3 },
    { name: "Head to Head", href: "/h2h", icon: Swords },
    { name: "Sync / Data", href: "/admin/sync", icon: Database },
  ]

  return (
    <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-5xl px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Crown className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
                Football Analytics
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs font-medium text-success">LIVE DATA</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-sm"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>

        {/* Horizontal Scrollable Sub-Navigation */}
        <div className="flex overflow-x-auto py-2 -mx-4 px-4 lg:-mx-6 lg:px-6 scrollbar-thin">
          <nav className="flex items-center gap-2 min-w-max" role="navigation" aria-label="Main navigation">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
