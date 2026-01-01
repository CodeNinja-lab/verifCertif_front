"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  FileCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarLogo } from "@/components/logo"
import Image from "next/image"

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Tableau de bord", href: "/university", icon: LayoutDashboard },
  { name: "Étudiants", href: "/university/students", icon: Users },
  { name: "Diplômes", href: "/university/degrees", icon: GraduationCap },
  { name: "Configuration Diplômes", href: "/university/diplomas", icon: BookOpen },
  { name: "Certifications", href: "/university/certifications", icon: Award },
  { name: "Vérifications", href: "/university/verifications", icon: FileCheck },
  { name: "Paramètres", href: "/university/settings", icon: Settings },
]

export function UniversitySidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link href="/university" className="flex items-center gap-2 group">
              <div className="h-8 w-8 relative flex-shrink-0 rounded-lg overflow-hidden bg-white shadow-sm">
                <Image
                  src="/logo-acadys.png"
                  alt="ACADYS Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="font-semibold bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] bg-clip-text text-transparent">ACADYS</span>
            </Link>
          )}
          {collapsed && (
            <div className="h-8 w-8 relative mx-auto rounded-lg overflow-hidden bg-white shadow-sm">
              <Image
                src="/logo-acadys.png"
                alt="ACADYS Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent",
                  isActive
                    ? "bg-[#009EE0]/10 text-[#009EE0] dark:text-[#33B5E5]"
                    : "text-muted-foreground hover:text-foreground",
                  collapsed && "justify-center",
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="h-10 w-10 rounded-full bg-[#009EE0] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-white">AD</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin ACADYS</p>
                <p className="text-xs text-muted-foreground truncate">admin@acadys.sn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
