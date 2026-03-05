"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import type { WpaPlay, GamePrediction } from "@/lib/football-data"
import { wpaChartData } from "@/lib/football-data"

interface WpaChartProps {
  game: GamePrediction
}

export function WpaChart({ game }: WpaChartProps) {
  const data = wpaChartData.map((d) => ({
    ...d,
    homeWpPct: Math.round(d.homeWp * 100),
  }))

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Win Probability Chart</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation} — Real-time WPA
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: game.homeTeam.color }} />
            <span className="text-[10px] font-medium text-muted-foreground">{game.homeTeam.abbreviation}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: game.awayTeam.color }} />
            <span className="text-[10px] font-medium text-muted-foreground">{game.awayTeam.abbreviation}</span>
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="homeWpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={game.homeTeam.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={game.homeTeam.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.22 0.01 260)"
              vertical={false}
            />
            <XAxis
              dataKey="play"
              tick={{ fontSize: 10, fill: "oklch(0.55 0.01 260)" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "Play #", position: "insideBottom", offset: -5, fontSize: 10, fill: "oklch(0.55 0.01 260)" }}
            />
            <YAxis
              domain={[30, 90]}
              tick={{ fontSize: 10, fill: "oklch(0.55 0.01 260)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              content={<WpaTooltip homeAbbr={game.homeTeam.abbreviation} awayAbbr={game.awayTeam.abbreviation} />}
            />
            <ReferenceLine
              y={50}
              stroke="oklch(0.55 0.01 260)"
              strokeDasharray="6 4"
              strokeOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="homeWpPct"
              stroke={game.homeTeam.color}
              strokeWidth={2}
              fill="url(#homeWpGradient)"
              dot={false}
              activeDot={{
                r: 5,
                stroke: game.homeTeam.color,
                strokeWidth: 2,
                fill: "oklch(0.14 0.006 260)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quarter markers */}
      <div className="mt-2 flex items-center justify-between px-2">
        {["Q1", "Q2", "HALF", "Q3", "Q4"].map((q) => (
          <span key={q} className={`text-[9px] font-medium ${q === "Q3" ? "text-primary" : "text-muted-foreground/50"}`}>
            {q}
          </span>
        ))}
      </div>
    </div>
  )
}

function WpaTooltip({
  active,
  payload,
  homeAbbr,
  awayAbbr,
}: {
  active?: boolean
  payload?: Array<{ payload: WpaPlay & { homeWpPct: number } }>
  homeAbbr: string
  awayAbbr: string
}) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-[10px] font-medium text-muted-foreground">
          {d.quarter} — Play #{d.play}
        </span>
        <span
          className={`text-[10px] font-bold ${d.wpaChange >= 0 ? "text-success" : "text-destructive"}`}
        >
          {d.wpaChange >= 0 ? "+" : ""}
          {(d.wpaChange * 100).toFixed(1)}% WPA
        </span>
      </div>
      <p className="text-xs text-foreground mb-2 max-w-[220px]">{d.description}</p>
      <div className="flex items-center gap-3">
        <div className="text-xs">
          <span className="text-muted-foreground">{homeAbbr}: </span>
          <span className="font-bold font-mono text-foreground">{d.homeWpPct}%</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">{awayAbbr}: </span>
          <span className="font-bold font-mono text-foreground">{100 - d.homeWpPct}%</span>
        </div>
      </div>
    </div>
  )
}
