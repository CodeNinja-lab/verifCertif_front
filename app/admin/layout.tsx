"use client"

import type React from "react"
import Script from "next/script"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="auth-check"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const token = localStorage.getItem('auth_token');
              if (!token) {
                const path = window.location.pathname;
                window.location.replace('/login?redirect=' + encodeURIComponent(path));
              }
            })();
          `,
        }}
      />
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex min-h-screen w-full bg-muted/20">
          <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r lg:block">
            <AdminSidebar />
          </aside>
          <div className="flex flex-1 flex-col lg:pl-64">
            <AdminHeader />
            <main className="flex-1 p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </>
  )
}
