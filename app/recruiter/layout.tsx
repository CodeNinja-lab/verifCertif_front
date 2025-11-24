import type React from "react"
import { RecruiterSidebar } from "@/components/recruiter-sidebar"
import { RecruiterHeader } from "@/components/recruiter-header"

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <RecruiterSidebar />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <RecruiterHeader />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
