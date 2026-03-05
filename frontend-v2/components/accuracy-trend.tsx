"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { weeklyTrends } from "@/lib/football-data"

export function AccuracyTrend() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Model Accuracy Trend</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Weekly prediction accuracy (%) — Season 2025-26</p>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyTrends} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.22 0.01 260)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: "oklch(0.55 0.01 260)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[55, 90]}
              tick={{ fontSize: 10, fill: "oklch(0.55 0.01 260)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip content={<AccuracyTooltip />} />
            <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {weeklyTrends.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.accuracy >= 80
                      ? "oklch(0.65 0.19 145)"
                      : entry.accuracy >= 70
                        ? "oklch(0.7 0.18 55)"
                        : "oklch(0.55 0.01 260)"
                  }
                  fillOpacity={index === weeklyTrends.length - 1 ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "oklch(0.65 0.19 145)" }} />
            <span className="text-[10px] text-muted-foreground">{"≥80%"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "oklch(0.7 0.18 55)" }} />
            <span className="text-[10px] text-muted-foreground">{"70-79%"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "oklch(0.55 0.01 260)" }} />
            <span className="text-[10px] text-muted-foreground">{"<70%"}</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          Avg: 75.4%
        </span>
      </div>
    </div>
  )
}

function AccuracyTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: { week: string; accuracy: number; predictions: number; correct: number } }>
}) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="text-xs font-semibold text-foreground mb-1">{d.week}</p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] text-muted-foreground">Accuracy</span>
          <span className="text-xs font-bold font-mono text-foreground">{d.accuracy}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] text-muted-foreground">Record</span>
          <span className="text-xs font-mono text-foreground">
            {d.correct}-{d.predictions - d.correct}
          </span>
        </div>
      </div>
    </div>
  )
}
