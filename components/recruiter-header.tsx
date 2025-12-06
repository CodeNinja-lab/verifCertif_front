"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function RecruiterHeader() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("current_user")
        if (userStr) {
          setUser(JSON.parse(userStr))
        } else {
          const { authApi } = await import("@/lib/api-client")
          const data = await authApi.me()
          const userInfo = data.user || data
          setUser(userInfo)
          localStorage.setItem("current_user", JSON.stringify(userInfo))
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error)
    }
  }

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

  const getInitials = () => {
    if (user?.nom_entreprise) {
      return user.nom_entreprise.substring(0, 2).toUpperCase()
    }
    if (user?.prenom && user?.nom) {
      return `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
    }
    return "R"
  }

  const getDisplayName = () => {
    if (user?.nom_entreprise) {
      return user.nom_entreprise
    }
    if (user?.prenom && user?.nom) {
      return `${user.prenom} ${user.nom}`
    }
    return "Recruteur"
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher des candidats..." className="pl-10" />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="font-semibold">Nouvelle candidature</div>
              <div className="text-xs text-muted-foreground">Un candidat a postulé pour votre offre</div>
              <div className="text-xs text-muted-foreground">Il y a 10 minutes</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="font-semibold">Offre expirée</div>
              <div className="text-xs text-muted-foreground">Votre offre expire dans 2 jours</div>
              <div className="text-xs text-muted-foreground">Il y a 2 heures</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {getInitials()}
              </div>
              <span className="hidden md:inline">{getDisplayName()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/recruiter/company">Profil entreprise</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/recruiter/settings">Paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
