"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  User,
  Briefcase,
  Heart,
  MessageSquare,
  Bell,
  Settings,
  FileText,
  TrendingUp,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
// Import dynamique pour éviter le bundling côté serveur

const navigation = [
  { name: "Tableau de bord", href: "/candidate", icon: LayoutDashboard },
  { name: "Mon profil", href: "/candidate/profile", icon: User },
  { name: "Mon CV", href: "/candidate/cv", icon: FileText },
  { name: "Mes candidatures", href: "/candidate/applications", icon: Briefcase },
  { name: "Offres recommandées", href: "/candidate/recommendations", icon: TrendingUp },
  { name: "Favoris", href: "/candidate/favorites", icon: Heart },
  { name: "Messages", href: "/candidate/messages", icon: MessageSquare },
  { name: "Notifications", href: "/candidate/notifications", icon: Bell },
  { name: "Paramètres", href: "/candidate/settings", icon: Settings },
]

export function CandidateSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { authApi } = await import("@/lib/api-client")
      await authApi.logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("current_user")
      router.push("/login")
    }
  }

  return (
    <div className="flex h-full flex-col gap-y-5 border-r border-border bg-card px-6 py-8">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Briefcase className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold">TalentHub Pro</div>
          <div className="text-xs text-muted-foreground">Espace Candidat</div>
        </div>
      </div>

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
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 bg-transparent" 
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
