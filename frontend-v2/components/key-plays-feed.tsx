"use client"

import { wpaChartData } from "@/lib/football-data"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function KeyPlaysFeed() {
  // Sort plays by absolute WPA change (biggest swings first)
  const keyPlays = [...wpaChartData]
    .sort((a, b) => Math.abs(b.wpaChange) - Math.abs(a.wpaChange))
    .slice(0, 6)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Key WPA Plays</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Biggest win probability swings this game</p>
      </div>

      <div className="flex flex-col gap-2">
        {keyPlays.map((play, i) => {
          const isPositive = play.wpaChange >= 0
          return (
            <div
              key={`${play.play}-${i}`}
              className="flex items-start gap-3 rounded-md bg-secondary/30 px-3 py-2.5 transition-colors hover:bg-secondary/50"
            >
              <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}>
                {isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-medium text-muted-foreground">{play.quarter}</span>
                  <span className="text-[8px] text-muted-foreground/50">|</span>
                  <span className="text-[10px] font-mono text-muted-foreground">#{play.play}</span>
                  <span className="ml-auto text-[10px] font-bold font-mono">
                    <span className={isPositive ? "text-success" : "text-destructive"}>
                      {isPositive ? "+" : ""}
                      {(play.wpaChange * 100).toFixed(1)}%
                    </span>
                  </span>
                </div>
                <p className="text-xs text-foreground truncate">{play.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
