"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Menu, Briefcase, MessageSquare } from "lucide-react"
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
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadUser()
    loadNotifications()
    // Rafraîchir les notifications toutes les 30 secondes
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
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

  const loadNotifications = async () => {
    try {
      const { notificationApi } = await import("@/lib/api-client")
      const response = await notificationApi.unread()
      
      let unreadNotifications = []
      if (response.data && Array.isArray(response.data)) {
        unreadNotifications = response.data
      } else if (Array.isArray(response)) {
        unreadNotifications = response
      }
      
      setNotifications(unreadNotifications.slice(0, 5)) // Afficher les 5 dernières
      setUnreadCount(unreadNotifications.length)
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error)
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Date inconnue"
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "matching":
      case "nouvelle_offre":
      case "candidature":
        return Briefcase
      case "message":
        return MessageSquare
      default:
        return Bell
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
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 text-xs bg-red-500 hover:bg-red-600">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">{unreadCount} non {unreadCount > 1 ? 'lues' : 'lue'}</Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Aucune nouvelle notification
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon = getNotificationIcon(notif.type || notif.type_notification)
                return (
                  <DropdownMenuItem
                    key={notif.id}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                    onClick={() => router.push('/recruiter/notifications')}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {notif.titre || notif.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {notif.message || notif.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(notif.date_envoi || notif.created_at)}
                      </div>
                    </div>
                  </DropdownMenuItem>
                )
              })
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center text-center cursor-pointer">
              <Link href="/recruiter/notifications" className="w-full">
                Voir toutes les notifications
              </Link>
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
