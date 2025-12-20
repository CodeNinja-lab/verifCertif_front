"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RecommendationsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/candidate/matching")
  }, [router])

  return (
    <div className="p-6 flex items-center justify-center min-h-[400px]">
      <p className="text-muted-foreground">Redirection...</p>
    </div>
  )
}
