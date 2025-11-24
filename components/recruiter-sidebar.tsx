"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  Bell,
  Settings,
  Building2,
  BarChart3,
  Plus,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Tableau de bord", href: "/recruiter", icon: LayoutDashboard },
  { name: "Mes offres", href: "/recruiter/jobs", icon: Briefcase },
  { name: "Candidats", href: "/recruiter/candidates", icon: Users },
  { name: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
  { name: "Messages", href: "/recruiter/messages", icon: MessageSquare },
  { name: "Notifications", href: "/recruiter/notifications", icon: Bell },
  { name: "Profil entreprise", href: "/recruiter/company", icon: Building2 },
  { name: "Paramètres", href: "/recruiter/settings", icon: Settings },
]

export function RecruiterSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-y-5 border-r border-border bg-card px-6 py-8">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
          <Building2 className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold">TalentHub Pro</div>
          <div className="text-xs text-muted-foreground">Espace Recruteur</div>
        </div>
      </div>

      <Button className="w-full bg-gradient-to-r from-secondary to-primary" asChild>
        <Link href="/recruiter/jobs/new">
          <Plus className="mr-2 h-4 w-4" />
          Publier une offre
        </Link>
      </Button>

      <nav className="flex flex-1 flex-col gap-1">
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
        <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" size="sm">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
