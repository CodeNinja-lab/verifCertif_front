import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r lg:block">
        <AdminSidebar />
      </aside>
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
