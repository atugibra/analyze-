"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { StatsOverview } from "@/components/stats-overview"
import { GameCard } from "@/components/game-card"
import { WpaChart } from "@/components/wpa-chart"
import { MatchupComparison } from "@/components/matchup-comparison"
import { PlayerWpaTable } from "@/components/player-wpa-table"
import { ProbabilityGauge } from "@/components/probability-gauge"
import { AccuracyTrend } from "@/components/accuracy-trend"
import { KeyPlaysFeed } from "@/components/key-plays-feed"
import { predictions } from "@/lib/football-data"
import { ChevronLeft } from "lucide-react"

export default function Home() {
  const [selectedGameId, setSelectedGameId] = useState(predictions[0].id)
  const [showDetail, setShowDetail] = useState(false)

  const selectedGame = predictions.find((g) => g.id === selectedGameId) ?? predictions[0]

  const handleSelect = (id: string) => {
    setSelectedGameId(id)
    setShowDetail(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-[1440px] px-4 lg:px-6 py-4 lg:py-6">
        {/* Stats Overview */}
        <section aria-label="Season statistics overview" className="mb-6">
          <StatsOverview />
        </section>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Column — Game Cards */}
          <aside
            className={`w-full lg:w-[380px] shrink-0 ${showDetail ? "hidden lg:block" : "block"}`}
            aria-label="Game predictions"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Week 18 Predictions</h2>
              <span className="text-[10px] font-mono text-muted-foreground">
                {predictions.length} games
              </span>
            </div>
            <div className="flex flex-col gap-3 lg:max-h-[calc(100vh-240px)] lg:overflow-y-auto lg:pr-1 scrollbar-thin">
              {predictions.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isSelected={selectedGameId === game.id}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </aside>

          {/* Right Column — Analysis Detail */}
          <section
            className={`flex-1 min-w-0 ${showDetail ? "block" : "hidden lg:block"}`}
            aria-label="Game analysis detail"
          >
            {/* Mobile back button */}
            <button
              onClick={() => setShowDetail(false)}
              className="lg:hidden flex items-center gap-1 mb-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back to predictions
            </button>

            {/* Game Header */}
            <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-md text-xs font-bold border border-border"
                  style={{
                    backgroundColor: `${selectedGame.awayTeam.color}15`,
                    color: selectedGame.awayTeam.color,
                  }}
                >
                  {selectedGame.awayTeam.abbreviation}
                </div>
                <div className="text-center">
                  <span className="text-xs text-muted-foreground">@</span>
                </div>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-md text-xs font-bold border border-border"
                  style={{
                    backgroundColor: `${selectedGame.homeTeam.color}15`,
                    color: selectedGame.homeTeam.color,
                  }}
                >
                  {selectedGame.homeTeam.abbreviation}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-semibold text-foreground">
                    {selectedGame.awayTeam.abbreviation} @ {selectedGame.homeTeam.abbreviation}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {selectedGame.date} — {selectedGame.venue}
                  </p>
                </div>
              </div>

              {selectedGame.status === "live" && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-foreground">
                      {selectedGame.awayScore}
                    </span>
                    <span className="mx-2 text-muted-foreground">-</span>
                    <span className="text-lg font-bold font-mono text-foreground">
                      {selectedGame.homeScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
                    </span>
                    <span className="text-[10px] font-semibold text-destructive">
                      {selectedGame.quarter} {selectedGame.gameTime}
                    </span>
                  </div>
                </div>
              )}

              {selectedGame.status === "final" && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-foreground">
                      {selectedGame.awayScore}
                    </span>
                    <span className="mx-2 text-muted-foreground">-</span>
                    <span className="text-lg font-bold font-mono text-foreground">
                      {selectedGame.homeScore}
                    </span>
                  </div>
                  <div className="rounded-full bg-muted px-2.5 py-1">
                    <span className="text-[10px] font-semibold text-muted-foreground">FINAL</span>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* WPA Chart — spans 2 cols */}
              <div className="xl:col-span-2">
                <WpaChart game={selectedGame} />
              </div>

              {/* Probability Gauge */}
              <div className="xl:col-span-1">
                <ProbabilityGauge game={selectedGame} />
              </div>

              {/* Player WPA Table — spans 2 cols */}
              <div className="xl:col-span-2">
                <PlayerWpaTable game={selectedGame} />
              </div>

              {/* Key Plays Feed */}
              <div className="xl:col-span-1">
                <KeyPlaysFeed />
              </div>

              {/* Matchup Comparison */}
              <div className="xl:col-span-2">
                <MatchupComparison game={selectedGame} />
              </div>

              {/* Accuracy Trend */}
              <div className="xl:col-span-1">
                <AccuracyTrend />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-muted-foreground">
            GridIron Analytics — Advanced football prediction engine powered by WPA models.
          </p>
          <p className="text-[10px] text-muted-foreground">
            For entertainment purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
