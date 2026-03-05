import { LucideIcon, FileText } from "lucide-react"

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
        <FileText className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 capitalize">predictions Page</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        This is a placeholder for the predictions module. It will be fully populated with real Football Data and components shortly.
      </p>
    </div>
  )
}
