"use client"

import type { GamePrediction } from "@/lib/football-data"
import { matchupStats } from "@/lib/football-data"

interface MatchupComparisonProps {
  game: GamePrediction
}

interface StatBarProps {
  label: string
  homeValue: string | number
  awayValue: string | number
  homeRaw: number
  awayRaw: number
  homeColor: string
  awayColor: string
}

function StatBar({ label, homeValue, awayValue, homeRaw, awayRaw, homeColor, awayColor }: StatBarProps) {
  const total = homeRaw + awayRaw
  const homePct = total > 0 ? (homeRaw / total) * 100 : 50
  const awayPct = 100 - homePct

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono font-bold text-foreground">{homeValue}</span>
        <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
        <span className="text-xs font-mono font-bold text-foreground">{awayValue}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-secondary gap-0.5">
        <div
          className="rounded-full transition-all duration-500"
          style={{ width: `${homePct}%`, backgroundColor: homeColor }}
        />
        <div
          className="rounded-full transition-all duration-500"
          style={{ width: `${awayPct}%`, backgroundColor: awayColor }}
        />
      </div>
    </div>
  )
}

export function MatchupComparison({ game }: MatchupComparisonProps) {
  const { home, away } = matchupStats

  const parseTime = (t: string) => {
    const [m, s] = t.split(":").map(Number)
    return m * 60 + s
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-1">Team Comparison</h3>
      <p className="text-xs text-muted-foreground mb-4">
        {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation} — Key Matchup Stats
      </p>

      {/* Team Headers */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold border border-border"
            style={{ backgroundColor: `${game.homeTeam.color}15`, color: game.homeTeam.color }}
          >
            {game.homeTeam.abbreviation}
          </div>
          <span className="text-xs font-semibold text-foreground">{game.homeTeam.abbreviation}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">{game.awayTeam.abbreviation}</span>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold border border-border"
            style={{ backgroundColor: `${game.awayTeam.color}15`, color: game.awayTeam.color }}
          >
            {game.awayTeam.abbreviation}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <StatBar
          label="Pass Yds"
          homeValue={home.passingYards}
          awayValue={away.passingYards}
          homeRaw={home.passingYards}
          awayRaw={away.passingYards}
          homeColor={game.homeTeam.color}
          awayColor={game.awayTeam.color}
        />
        <StatBar
          label="Rush Yds"
          homeValue={home.rushingYards}
          awayValue={away.rushingYards}
          homeRaw={home.rushingYards}
          awayRaw={away.rushingYards}
          homeColor={game.homeTeam.color}
          awayColor={game.awayTeam.color}
        />
        <StatBar
          label="Total Yds"
          homeValue={home.totalYards}
          awayValue={away.totalYards}
          homeRaw={home.totalYards}
          awayRaw={away.totalYards}
          homeColor={game.homeTeam.color}
          awayColor={game.awayTeam.color}
        />
        <StatBar
          label="3rd Down"
          homeValue={home.thirdDown}
          awayValue={away.thirdDown}
          homeRaw={6}
          awayRaw={4}
          homeColor={game.homeTeam.color}
          awayColor={game.awayTeam.color}
        />
        <StatBar
          label="Red Zone"
          homeValue={home.redZone}
          awayValue={away.redZone}
          homeRaw={3}
          awayRaw={2}
          homeColor={game.homeTeam.color}
          awayColor={game.awayTeam.color}
        />
        <StatBar
          label="T.O.P."
          homeValue={home.timeOfPossession}
          awayValue={away.timeOfPossession}
          homeRaw={parseTime(home.timeOfPossession)}
          awayRaw={parseTime(away.timeOfPossession)}
          homeColor={game.homeTeam.color}
          awayColor={game.awayTeam.color}
        />
        <StatBar
          label="Sacks"
          homeValue={home.sacks}
          awayValue={away.sacks}
          homeRaw={home.sacks}
          awayRaw={away.sacks}
          homeColor={game.homeTeam.color}
          awayColor={game.awayTeam.color}
        />
        <StatBar
          label="Turnovers"
          homeValue={home.turnovers}
          awayValue={away.turnovers}
          homeRaw={away.turnovers}
          awayRaw={home.turnovers}
          homeColor={game.homeTeam.color}
          awayColor={game.awayTeam.color}
        />
      </div>
    </div>
  )
}
