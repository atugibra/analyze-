"use client"

import { Target, TrendingUp, Award, Percent } from "lucide-react"

const stats = [
  {
    label: "Model Accuracy",
    value: "76.4%",
    change: "+2.1%",
    trend: "up",
    icon: Target,
    description: "Season ATS",
  },
  {
    label: "Win Rate",
    value: "73.8%",
    change: "+1.4%",
    trend: "up",
    icon: TrendingUp,
    description: "Straight Up",
  },
  {
    label: "Total Predictions",
    value: "268",
    change: "16 this week",
    trend: "up",
    icon: Award,
    description: "Season Total",
  },
  {
    label: "Avg. Confidence",
    value: "71.2%",
    change: "-0.8%",
    trend: "down",
    icon: Percent,
    description: "Per Prediction",
  },
]

export function StatsOverview() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <stat.icon className="h-4 w-4" />
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-sm font-medium ${stat.trend === "up"
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
                }`}
            >
              {stat.change}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {stat.value}
            </p>
            <p className="mt-2 text-base text-muted-foreground">{stat.label}</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground/70">{stat.description}</p>
        </div>
      ))}
    </div>
  )
}
