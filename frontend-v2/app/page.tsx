"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { StatsOverview } from "@/components/stats-overview"
import { StandingsTable } from "@/components/standings-table"
import { HeadToHead } from "@/components/head-to-head"

export default function Home() {
  const [splitView, setSplitView] = useState<"overall" | "home" | "away">("overall")



  return (
    <div className="min-h-screen bg-background bg-fixed bg-gradient-to-b from-background via-background/95 to-muted/20">
      <Header />

      <main className="mx-auto max-w-5xl p-4 lg:p-6">
        {/* Stats Overview */}
        <section aria-label="Season statistics overview" className="mb-6">
          <StatsOverview />
        </section>

        {/* Global Split View Toggle (Home/Away/Overall) */}
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex items-center rounded-lg border border-border bg-card p-2 shadow-sm">
            {["overall", "home", "away"].map((view) => (
              <button
                key={view}
                onClick={() => setSplitView(view as any)}
                className={`px-4 py-2 text-base font-medium rounded-md transition-all ${splitView === view
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">


          {/* Full Width Analysis Grid */}
          <section className="flex-1 w-full" aria-label="League analysis detail">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Standings Table — spans 2 cols */}
              <div className="xl:col-span-2">
                <StandingsTable splitView={splitView} />
              </div>

              {/* Head To Head */}
              <div className="xl:col-span-1">
                {/* Temporary hardcoded teams until API is connected */}
                <HeadToHead
                  splitView={splitView}
                  homeTeam="ARS"
                  awayTeam="MCI"
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="mx-auto max-w-5xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            PlusOne Analytics — Advanced prediction engine powered by Match Data.
          </p>
          <p className="text-sm text-muted-foreground">
            For entertainment purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
