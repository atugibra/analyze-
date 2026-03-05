"use client"

import type { GamePrediction } from "@/lib/football-data"

interface ProbabilityGaugeProps {
  game: GamePrediction
}

export function ProbabilityGauge({ game }: ProbabilityGaugeProps) {
  const homeWp = Math.round(game.homeTeam.winProbability * 100)
  const awayWp = 100 - homeWp

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Win Probability</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Current prediction breakdown</p>
      </div>

      {/* Central Gauge */}
      <div className="flex flex-col items-center gap-4">
        {/* Circular Gauge */}
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="oklch(0.19 0.008 260)"
              strokeWidth="10"
            />
            {/* Home team arc */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={game.homeTeam.color}
              strokeWidth="10"
              strokeDasharray={`${homeWp * 3.14} ${314}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* Away team arc */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={game.awayTeam.color}
              strokeWidth="10"
              strokeDasharray={`${awayWp * 3.14} ${314}`}
              strokeDashoffset={`${-homeWp * 3.14}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold font-mono text-foreground">{homeWp}%</span>
            <span className="text-[10px] text-muted-foreground">{game.homeTeam.abbreviation} Win</span>
          </div>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold border border-border"
              style={{ backgroundColor: `${game.homeTeam.color}15`, color: game.homeTeam.color }}
            >
              {game.homeTeam.abbreviation}
            </div>
            <span className="text-lg font-bold font-mono text-foreground">{homeWp}%</span>
            <span className="text-[10px] text-muted-foreground">
              Spread: {game.homeTeam.spread > 0 ? "+" : ""}{game.homeTeam.spread}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground">O/U</span>
            <span className="text-sm font-bold font-mono text-foreground">{game.homeTeam.overUnder}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold border border-border"
              style={{ backgroundColor: `${game.awayTeam.color}15`, color: game.awayTeam.color }}
            >
              {game.awayTeam.abbreviation}
            </div>
            <span className="text-lg font-bold font-mono text-foreground">{awayWp}%</span>
            <span className="text-[10px] text-muted-foreground">
              Spread: +{game.awayTeam.spread}
            </span>
          </div>
        </div>

        {/* Confidence */}
        <div className="w-full rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-muted-foreground">Model Confidence</span>
            <span className="text-xs font-bold font-mono text-foreground">{game.confidence}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${game.confidence}%`,
                backgroundColor:
                  game.confidence >= 80
                    ? "oklch(0.65 0.19 145)"
                    : game.confidence >= 65
                      ? "oklch(0.7 0.18 55)"
                      : "oklch(0.55 0.01 260)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
