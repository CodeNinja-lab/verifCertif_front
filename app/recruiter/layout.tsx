"use client"

import type React from "react"
import Script from "next/script"
import { usePathname } from "next/navigation"
import { RecruiterSidebar } from "@/components/recruiter-sidebar"
import { RecruiterHeader } from "@/components/recruiter-header"
import { ProtectedRoute } from "@/components/protected-route"

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

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
      <ProtectedRoute allowedRoles={["recruteur", "admin"]}>
        <div className="flex h-screen overflow-hidden">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <RecruiterSidebar />
          </aside>
          <div className="flex flex-1 flex-col overflow-hidden">
            <RecruiterHeader />
            <main className="flex-1 overflow-y-auto bg-background">{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </>
  )
}
