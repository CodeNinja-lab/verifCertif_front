import type React from "react"
import { UniversitySidebar } from "@/components/university-sidebar"
import { UniversityHeader } from "@/components/university-header"

export default function UniversityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <UniversitySidebar />
      <div className="flex flex-1 flex-col overflow-hidden ml-64">
        <UniversityHeader />
        <main className="flex-1 overflow-y-auto bg-muted/30">{children}</main>
      </div>
    </div>
  )
}
