import { Calendar } from "lucide-react"

export default function FixturesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                <Calendar className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Upcoming Fixtures</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
                Schedules, odds, and preview links for incoming matches across all monitored leagues.
            </p>
        </div>
    )
}
