import type React from "react"
import { CandidateSidebar } from "@/components/candidate-sidebar"
import { CandidateHeader } from "@/components/candidate-header"

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <CandidateSidebar />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <CandidateHeader />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
