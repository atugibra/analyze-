"use client"

import { useState, useEffect } from "react"
import { Trophy, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react"
import { getStandings } from "@/lib/api"

// Strict typography scale: text-sm (14px), text-base (16px), text-lg (20px), text-2xl (24px)
// Strict spacing: 8px grid (p-2, p-4, mt-2, mt-4, gap-2, gap-4)

interface StandingsTableProps {
    splitView: "overall" | "home" | "away"
}

export function StandingsTable({ splitView }: StandingsTableProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        // Fetch real data from the Railway backend using the api wrapper
        // V1 schema: { rank, team, points, matches_played, wins, draws, losses, form }
        getStandings().then((res) => {
            if (res && res.data) {
                // Determine which stats to show based on the split view
                const mappedData = res.data.map((d: any) => ({
                    rank: d.rank || 0,
                    team: d.team || 'Unknown',
                    played: splitView === "overall" ? d.matches_played : splitView === "home" ? d.home_played : d.away_played,
                    won: splitView === "overall" ? d.wins : splitView === "home" ? d.home_wins : d.away_wins,
                    drawn: splitView === "overall" ? d.draws : splitView === "home" ? d.home_draws : d.away_draws,
                    lost: splitView === "overall" ? d.losses : splitView === "home" ? d.home_losses : d.away_losses,
                    points: splitView === "overall" ? d.points : splitView === "home" ? d.home_points : d.away_points,
                    form: d.form ? d.form.split('').slice(0, 5) : []
                }))
                // Sort by points for the specific view
                mappedData.sort((a, b) => b.points - a.points)
                // Re-rank them
                mappedData.forEach((d, i) => d.rank = i + 1)
                setData(mappedData)
            }
        }).catch(err => {
            console.error("Failed to fetch standings:", err)
        }).finally(() => {
            setLoading(false)
        })
    }, [splitView])

    const renderFormIcon = (result: string) => {
        switch (result) {
            case "W": return <TrendingUp className="h-4 w-4 text-success" />
            case "L": return <TrendingDown className="h-4 w-4 text-destructive" />
            default: return <Minus className="h-4 w-4 text-muted-foreground" />
        }
    }

    return (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    League Standings <span className="text-sm font-normal text-muted-foreground">({splitView.toUpperCase()})</span>
                </h3>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-border bg-muted/50">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground">#</th>
                            <th className="p-4 font-medium text-muted-foreground w-full">Club</th>
                            <th className="p-4 font-medium text-muted-foreground text-center">MP</th>
                            <th className="p-4 font-medium text-muted-foreground text-center">W</th>
                            <th className="p-4 font-medium text-muted-foreground text-center">D</th>
                            <th className="p-4 font-medium text-muted-foreground text-center">L</th>
                            <th className="p-4 font-medium text-foreground text-center font-bold">Pts</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Form</th>
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {loading && (
                            <tr>
                                <td colSpan={8} className="p-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <span>Loading live standings...</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!loading && data.length === 0 && (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-muted-foreground font-medium">
                                    No data available. Try Syncing from the Admin panel.
                                </td>
                            </tr>
                        )}
                        {!loading && data.map((row, idx) => (
                            <tr
                                key={row.team}
                                className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${idx < 4 ? 'bg-primary/5' : ''}`}
                            >
                                <td className="p-4 font-mono text-muted-foreground">{row.rank}</td>
                                <td className="p-4 font-medium text-base">{row.team}</td>
                                <td className="p-4 text-center text-muted-foreground">{row.played || 0}</td>
                                <td className="p-4 text-center text-muted-foreground">{row.won || 0}</td>
                                <td className="p-4 text-center text-muted-foreground">{row.drawn || 0}</td>
                                <td className="p-4 text-center text-muted-foreground">{row.lost || 0}</td>
                                <td className="p-4 text-center font-bold text-base text-primary">{row.points || 0}</td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {row.form && row.form.map((f: string, i: number) => (
                                            <div key={i} className="flex h-6 w-6 items-center justify-center rounded bg-muted">
                                                {renderFormIcon(f)}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
