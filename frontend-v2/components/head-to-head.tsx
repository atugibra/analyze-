"use client"

import { useState, useEffect } from "react"
import { Crosshair, ShieldAlert, Loader2 } from "lucide-react"
import { getH2H } from "@/lib/api"

// Strict typography scale: text-sm (14px), text-base (16px), text-lg (20px), text-2xl (24px)
// Strict spacing: 8px grid (p-2, p-4, mt-2, mt-4, gap-2, gap-4)

interface HeadToHeadProps {
    splitView: "overall" | "home" | "away"
    homeTeam: string
    awayTeam: string
}

export function HeadToHead({ splitView, homeTeam, awayTeam }: HeadToHeadProps) {
    const [matches, setMatches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!homeTeam || !awayTeam) return

        setLoading(true)
        // Fetch actual head to head data
        getH2H(homeTeam, awayTeam)
            .then((res) => {
                // Expected array of historical match records
                if (res && res.data && Array.isArray(res.data)) {
                    const parsedMatches = res.data.map((m: any) => ({
                        date: m.date || 'Unknown',
                        home: m.home_team || homeTeam,
                        away: m.away_team || awayTeam,
                        homeScore: m.home_score ?? null,
                        awayScore: m.away_score ?? null
                    }))
                    setMatches(parsedMatches)
                }
            })
            .catch((err) => console.error("Failed to fetch H2H:", err))
            .finally(() => setLoading(false))
    }, [homeTeam, awayTeam])

    // Filter based on split view
    const displayMatches = splitView === "overall"
        ? matches
        : splitView === "home"
            ? matches.filter(m => m.home === homeTeam)
            : matches.filter(m => m.home === awayTeam)

    return (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm h-full">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Crosshair className="h-5 w-5 text-primary" />
                    Head-to-Head <span className="text-sm font-normal text-muted-foreground">({splitView.toUpperCase()})</span>
                </h3>
            </div>

            <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center border bg-card rounded-md border-border/50 shadow-sm mt-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary mb-2 opacity-70" />
                        <p className="text-sm text-muted-foreground font-medium">Loading historical matchups...</p>
                    </div>
                ) : displayMatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 border border-border/50 rounded-md border-dashed">
                        <ShieldAlert className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                        <p className="text-sm text-muted-foreground">No matches found for this view.</p>
                    </div>
                ) : (
                    displayMatches.map((match, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-4 bg-background border border-border/50 p-4 rounded-md shadow-sm transition-colors hover:border-primary/50"
                        >
                            <div className="flex flex-col flex-1">
                                <p className="text-sm font-mono text-muted-foreground mb-2">{match.date}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-base font-semibold ${match.homeScore > match.awayScore ? 'text-primary' : 'text-foreground'}`}>
                                        {match.home}
                                    </span>
                                    <span className={`text-xl font-bold font-mono ${match.homeScore > match.awayScore ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {match.homeScore}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className={`text-base ${match.awayScore > match.homeScore ? 'text-primary' : 'text-foreground'}`}>
                                        {match.away}
                                    </span>
                                    <span className={`text-xl font-bold font-mono ${match.awayScore > match.homeScore ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {match.awayScore}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
