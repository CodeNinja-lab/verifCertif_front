"use client"

import type React from "react"
import Script from "next/script"
import { UniversitySidebar } from "@/components/university-sidebar"
import { UniversityHeader } from "@/components/university-header"
import { ProtectedRoute } from "@/components/protected-route"

export default function UniversityLayout({
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
      <ProtectedRoute allowedRoles={["admin", "administration"]}>
        <div className="flex h-screen overflow-hidden">
          <UniversitySidebar />
          <div className="flex flex-1 flex-col overflow-hidden ml-64">
            <UniversityHeader />
            <main className="flex-1 overflow-y-auto bg-muted/30">{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </>
  )
}
