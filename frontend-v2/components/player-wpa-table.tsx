"use client"

import { topPlayers } from "@/lib/football-data"
import type { GamePrediction } from "@/lib/football-data"

interface PlayerWpaTableProps {
  game: GamePrediction
}

export function PlayerWpaTable({ game }: PlayerWpaTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Player WPA Leaders</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation} — Top performers by Win Probability Added
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="pb-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Player
              </th>
              <th scope="col" className="pb-2 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                WPA
              </th>
              <th scope="col" className="pb-2 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                EPA
              </th>
              <th scope="col" className="pb-2 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Success%
              </th>
              <th scope="col" className="pb-2 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Plays
              </th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player, i) => {
              const teamColor = player.team === game.homeTeam.abbreviation
                ? game.homeTeam.color
                : game.awayTeam.color

              return (
                <tr
                  key={player.name}
                  className={`border-b border-border/50 transition-colors hover:bg-secondary/30 ${
                    i === 0 ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded text-[9px] font-bold border border-border"
                        style={{ backgroundColor: `${teamColor}15`, color: teamColor }}
                      >
                        {player.team}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground">{player.name}</span>
                        <span className="ml-1.5 text-[9px] text-muted-foreground">{player.position}</span>
                      </div>
                      {i === 0 && (
                        <span className="ml-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[8px] font-bold text-warning">
                          MVP
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`text-xs font-bold font-mono ${player.wpa > 0 ? "text-success" : "text-destructive"}`}>
                      {player.wpa > 0 ? "+" : ""}{player.wpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2.5 text-right hidden sm:table-cell">
                    <span className="text-xs font-mono text-foreground">{player.epa.toFixed(1)}</span>
                  </td>
                  <td className="py-2.5 text-right hidden md:table-cell">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="h-1 w-12 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${player.successRate * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {Math.round(player.successRate * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="text-xs font-mono text-muted-foreground">{player.plays}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
