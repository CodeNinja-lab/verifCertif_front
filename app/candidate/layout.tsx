"use client"

import type React from "react"
import Script from "next/script"
import { CandidateSidebar } from "@/components/candidate-sidebar"
import { CandidateHeader } from "@/components/candidate-header"
import { ProtectedRoute } from "@/components/protected-route"

export default function CandidateLayout({
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
      <ProtectedRoute allowedRoles={["etudiant", "admin"]}>
        <div className="flex h-screen overflow-hidden">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <CandidateSidebar />
          </aside>
          <div className="flex flex-1 flex-col overflow-hidden">
            <CandidateHeader />
            <main className="flex-1 overflow-y-auto bg-background">{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </>
  )
}
