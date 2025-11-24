"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Une erreur est survenue</h1>
        <p className="text-muted-foreground">
          Nous avons rencontré un problème inattendu. Nos équipes ont été notifiées.
        </p>
        <div className="pt-4">
          <Button onClick={() => reset()} size="lg" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Réessayer
          </Button>
        </div>
        <div className="text-xs text-muted-foreground pt-8">Code d'erreur: {error.digest || "UNKNOWN_ERROR"}</div>
      </div>
    </div>
  )
}
