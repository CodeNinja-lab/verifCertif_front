"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, MessageSquare, Calendar, Settings, CheckCheck, TrendingUp, AlertCircle, FileText } from "lucide-react"
import { toast } from "sonner"

export default function RecruiterNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const { notificationApi } = await import("@/lib/api-client")
      const response = await notificationApi.list()
      
      // Gérer la pagination si présente (Laravel retourne { data: [...], links: {...}, meta: {...} })
      let allNotifications: any[] = []
      
      if (response.data && Array.isArray(response.data)) {
        // Si c'est une pagination Laravel
        allNotifications = response.data
        
        // Si on a plusieurs pages, charger toutes les pages (limité à 100 notifications pour éviter la surcharge)
        if (response.meta && response.meta.last_page > 1 && response.meta.last_page <= 5) {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
          const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
          
          const promises = []
          for (let page = 2; page <= response.meta.last_page; page++) {
            promises.push(
              fetch(`${API_URL}/notifications?page=${page}&per_page=${response.meta.per_page || 20}`, {
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
              })
                .then(res => res.json())
                .then(data => data.data || [])
            )
          }
          const additionalPages = await Promise.all(promises)
          allNotifications = [...allNotifications, ...additionalPages.flat()]
        }
      } else if (Array.isArray(response)) {
        // Si c'est directement un tableau
        allNotifications = response
      }
      
      setNotifications(allNotifications)
    } catch (error: any) {
      console.error("Erreur lors du chargement des notifications:", error)
      toast.error("Erreur lors du chargement des notifications", {
        description: error.message || "Veuillez réessayer.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const { notificationApi } = await import("@/lib/api-client")
      await notificationApi.markAllAsRead()
      toast.success("Toutes les notifications ont été marquées comme lues")
      loadNotifications()
    } catch (error: any) {
      console.error("Erreur lors du marquage des notifications:", error)
      toast.error("Erreur lors du marquage des notifications", {
        description: error.message || "Veuillez réessayer.",
      })
    }
  }

  const handleMarkAsRead = async (id: number | string, notification: any) => {
    try {
      if (!notification.lue) {
        const { notificationApi } = await import("@/lib/api-client")
        await notificationApi.markAsRead(id)
        // Mettre à jour localement pour une meilleure UX
        setNotifications(prev => prev.map(n => 
          n.id === id ? { ...n, lue: true, date_lecture: new Date().toISOString() } : n
        ))
      }
      
      // Si la notification a un lien d'action, naviguer vers celui-ci
      if (notification.lien_action) {
        router.push(notification.lien_action)
      }
    } catch (error: any) {
      console.error("Erreur lors du marquage de la notification:", error)
      toast.error("Erreur lors du marquage de la notification", {
        description: error.message || "Veuillez réessayer.",
      })
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
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "matching":
      case "nouvelle_offre":
        return Briefcase
      case "message":
        return MessageSquare
      case "rappel":
        return Calendar
      case "verification_document":
        return FileText
      case "alerte_systeme":
        return AlertCircle
      default:
        return Briefcase
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Suivez l'activité de vos recrutements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Chargement des notifications...
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Aucune notification pour le moment
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification: any) => {
            const Icon = getNotificationIcon(notification.type || notification.type_notification)
            const isUnread = notification.lue === false
            const dateToShow = notification.date_envoi || notification.created_at
            
            return (
              <Card
                key={notification.id}
                className={`transition-colors hover:bg-accent/50 cursor-pointer ${
                  isUnread ? "border-l-4 border-l-primary bg-accent/30" : ""
                }`}
                onClick={() => handleMarkAsRead(notification.id, notification)}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${
                      isUnread ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold truncate">{notification.titre || notification.title}</h3>
                      {isUnread && (
                        <Badge className="bg-primary flex-shrink-0">Nouveau</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message || notification.description || notification.contenu}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(dateToShow)}
                      </p>
                      {notification.priorite && notification.priorite !== 'normale' && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            notification.priorite === 'urgente' ? 'border-red-500 text-red-600' :
                            notification.priorite === 'haute' ? 'border-orange-500 text-orange-600' :
                            'border-blue-500 text-blue-600'
                          }`}
                        >
                          {notification.priorite}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
