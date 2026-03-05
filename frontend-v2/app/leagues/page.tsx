import { Trophy } from "lucide-react"

export default function LeaguesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                <Trophy className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Leagues Overview</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
                Global league statistics, standings overviews, and season progress metrics will be displayed here.
            </p>
        </div>
    )
}
