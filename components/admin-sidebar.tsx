"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldCheck,
  BarChart3,
  Settings,
  MessageSquare,
  AlertCircle,
  LogOut,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Offres d'emploi", href: "/admin/jobs", icon: Briefcase },
  { name: "Candidatures", href: "/admin/applications", icon: FileText },
  { name: "Signalements", href: "/admin/reports", icon: AlertCircle },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-y-5 border-r border-border bg-card px-6 py-8">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm font-semibold">TalentHub Admin</div>
          <div className="text-xs text-muted-foreground">Super Admin</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 mt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto">
        <div className="rounded-xl bg-accent/50 p-4 mb-4">
          <p className="text-xs font-medium mb-1">État du système</p>
          <div className="flex items-center gap-2 text-xs text-emerald-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Opérationnel
          </div>
        </div>
        <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" size="sm">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
