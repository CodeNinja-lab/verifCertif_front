"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bell, Search, Menu, Briefcase, MessageSquare, Award, Sparkles, Loader2 } from "lucide-react"
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
import Image from "next/image"
import Link from "next/link"
// Import dynamique pour éviter le bundling côté serveur

interface User {
  prenom: string
  nom: string
  photo_url: string | null
}

interface Notification {
  id: number
  type: string
  titre: string
  message: string
  lue: boolean
  lien_action?: string
  date_envoi: string
  priorite?: string
}

export function CandidateHeader() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)
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
      const { authApi } = await import("@/lib/api-client")
      const response = await authApi.me()
      setUser(response.user)
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error)
    }
  }

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true)
      const { notificationApi } = await import("@/lib/api-client")
      const response = await notificationApi.unread()
      const data = response.data || []
      setNotifications(data.slice(0, 5)) // Garder les 5 dernières
      setUnreadCount(data.length)
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const { notificationApi } = await import("@/lib/api-client")
      await notificationApi.markAllAsRead()
      setNotifications([])
      setUnreadCount(0)
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    try {
      const { notificationApi } = await import("@/lib/api-client")
      await notificationApi.markAsRead(notification.id)
      
      // Mettre à jour le compteur
      setUnreadCount(prev => Math.max(0, prev - 1))
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
      
      // Rediriger si lien action
      if (notification.lien_action) {
        router.push(notification.lien_action)
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'candidature_consultee':
      case 'candidature_vue':
        return <Briefcase className="h-4 w-4 text-blue-500" />
      case 'certificat_disponible':
      case 'certificat':
        return <Award className="h-4 w-4 text-emerald-500" />
      case 'nouveau_message':
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case 'matching_eleve':
      case 'matching':
        return <Sparkles className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`
    return date.toLocaleDateString('fr-FR')
  }

  const getInitials = () => {
    const firstInitial = user?.prenom?.charAt(0)?.toUpperCase() || ""
    const lastInitial = user?.nom?.charAt(0)?.toUpperCase() || ""
    return firstInitial + lastInitial || "?"
  }

  const getFullName = () => {
    return `${user?.prenom || ""} ${user?.nom || ""}`.trim() || "Utilisateur"
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
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher des offres, entreprises..." className="pl-10" />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full p-0 text-xs bg-destructive">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleMarkAllAsRead}
                >
                  Tout marquer comme lu
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            
            {loadingNotifications ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucune nouvelle notification</p>
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className="flex items-start gap-3 p-3 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-sm">{notification.titre}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.date_envoi)}
                      </div>
                    </div>
                    {notification.priorite === 'haute' && (
                      <Badge variant="destructive" className="text-xs h-5">Urgent</Badge>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-center justify-center text-primary cursor-pointer">
                  <Link href="/candidate/notifications">Voir toutes les notifications</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              {user?.photo_url ? (
                <div className="h-8 w-8 rounded-full overflow-hidden relative">
                  <Image
                    src={user.photo_url}
                    alt="Photo de profil"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {getInitials()}
                </div>
              )}
              <span className="hidden md:inline">{getFullName()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/candidate/profile">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
