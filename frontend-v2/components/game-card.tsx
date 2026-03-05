"use client"

import { Clock, MapPin, ChevronRight } from "lucide-react"
import type { GamePrediction } from "@/lib/football-data"

interface GameCardProps {
  game: GamePrediction
  isSelected: boolean
  onSelect: (id: string) => void
}

export function GameCard({ game, isSelected, onSelect }: GameCardProps) {
  const homeWp = Math.round(game.homeTeam.winProbability * 100)
  const awayWp = Math.round(game.awayTeam.winProbability * 100)

  return (
    <button
      onClick={() => onSelect(game.id)}
      className={`w-full text-left rounded-lg border transition-all ${
        isSelected
          ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(34,197,94,0.05)]"
          : "border-border bg-card hover:border-border/80 hover:bg-card/80"
      } p-4`}
      aria-pressed={isSelected}
      aria-label={`${game.awayTeam.name} at ${game.homeTeam.name} prediction`}
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <StatusBadge status={game.status} quarter={game.quarter} gameTime={game.gameTime} />
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {game.time}
        </div>
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-2">
        <TeamRow
          abbreviation={game.awayTeam.abbreviation}
          name={game.awayTeam.name}
          record={game.awayTeam.record}
          color={game.awayTeam.color}
          wp={awayWp}
          score={game.awayScore}
          isLive={game.status === "live"}
          isFinal={game.status === "final"}
          isWinning={game.status !== "upcoming" && (game.awayScore ?? 0) > (game.homeScore ?? 0)}
        />
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] text-muted-foreground font-medium">VS</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <TeamRow
          abbreviation={game.homeTeam.abbreviation}
          name={game.homeTeam.name}
          record={game.homeTeam.record}
          color={game.homeTeam.color}
          wp={homeWp}
          score={game.homeScore}
          isLive={game.status === "live"}
          isFinal={game.status === "final"}
          isWinning={game.status !== "upcoming" && (game.homeScore ?? 0) > (game.awayScore ?? 0)}
          isHome
        />
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate max-w-[140px]">{game.venue}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ConfidenceBadge confidence={game.confidence} />
          <ChevronRight className={`h-3.5 w-3.5 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
        </div>
      </div>
    </button>
  )
}

function StatusBadge({ status, quarter, gameTime }: { status: string; quarter?: string; gameTime?: string }) {
  if (status === "live") {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
        </span>
        <span className="text-[10px] font-semibold text-destructive">
          {quarter} {gameTime}
        </span>
      </div>
    )
  }
  if (status === "final") {
    return (
      <div className="rounded-full bg-muted px-2 py-0.5">
        <span className="text-[10px] font-semibold text-muted-foreground">FINAL</span>
      </div>
    )
  }
  return (
    <div className="rounded-full bg-info/10 px-2 py-0.5">
      <span className="text-[10px] font-semibold text-info">UPCOMING</span>
    </div>
  )
}

function TeamRow({
  abbreviation,
  name,
  record,
  color,
  wp,
  score,
  isLive,
  isFinal,
  isWinning,
  isHome = false,
}: {
  abbreviation: string
  name: string
  record: string
  color: string
  wp: number
  score?: number
  isLive: boolean
  isFinal: boolean
  isWinning: boolean
  isHome?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-md text-xs font-bold border border-border"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {abbreviation}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold ${isWinning ? "text-foreground" : "text-foreground/80"}`}>
              {abbreviation}
            </span>
            {isHome && (
              <span className="text-[9px] text-muted-foreground bg-secondary px-1 py-0.5 rounded">HOME</span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground">{record}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {(isLive || isFinal) && score !== undefined && (
          <span className={`text-lg font-bold font-mono ${isWinning ? "text-foreground" : "text-muted-foreground"}`}>
            {score}
          </span>
        )}
        <div className="flex flex-col items-end">
          <span className={`text-sm font-bold font-mono ${wp >= 50 ? "text-success" : "text-muted-foreground"}`}>
            {wp}%
          </span>
          <span className="text-[9px] text-muted-foreground">Win Prob</span>
        </div>
      </div>
    </div>
  )
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const getColor = (c: number) => {
    if (c >= 80) return "text-success bg-success/10"
    if (c >= 65) return "text-warning bg-warning/10"
    return "text-muted-foreground bg-muted"
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold font-mono ${getColor(confidence)}`}>
      {confidence}% conf
    </span>
  )
}
