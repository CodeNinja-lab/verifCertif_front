"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Erreur Critique</h1>
          <p className="text-muted-foreground mb-8">Une erreur critique est survenue. Veuillez rafraîchir la page.</p>
          <Button onClick={() => reset()}>Rafraîchir</Button>
        </div>
      </body>
    </html>
  )
}
