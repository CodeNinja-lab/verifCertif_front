"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Briefcase, 
  MessageSquare, 
  Award, 
  Sparkles, 
  Loader2,
  Check,
  CheckCheck,
  Settings,
  UserCheck,
  Calendar,
} from "lucide-react"
import { notificationApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link"

interface Notification {
  id: number
  type: string
  titre: string
  message: string
  lue: boolean
  archivee: boolean
  lien_action?: string
  date_envoi: string
  priorite?: string
  icone?: string
}

export default function CandidateNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const { toast } = useToast()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationApi.list()
      setNotifications(response.data || [])
    } catch (error: any) {
      console.error("Erreur lors du chargement des notifications:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, lue: true } : n))
      )
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, lue: true })))
      toast({
        title: "Succès",
        description: "Toutes les notifications ont été marquées comme lues",
      })
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'candidature_consultee':
      case 'candidature_vue':
        return <UserCheck className="h-5 w-5" />
      case 'candidature':
      case 'application':
        return <Briefcase className="h-5 w-5" />
      case 'certificat_disponible':
      case 'certificat':
        return <Award className="h-5 w-5" />
      case 'nouveau_message':
      case 'message':
        return <MessageSquare className="h-5 w-5" />
      case 'matching_eleve':
      case 'matching':
        return <Sparkles className="h-5 w-5" />
      case 'entretien':
      case 'interview':
        return <Calendar className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
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
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.lue && !n.archivee
    if (filter === "read") return n.lue && !n.archivee
    return !n.archivee
  })

  const unreadCount = notifications.filter(n => !n.lue && !n.archivee).length

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Restez informé de l'avancement de vos candidatures
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Bell className="h-4 w-4" />
            Toutes
            <Badge variant="secondary">{notifications.filter(n => !n.archivee).length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            Non lues
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="read">Lues</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
                <p className="text-muted-foreground text-center">
                  {filter === "unread" 
                    ? "Vous n'avez aucune notification non lue." 
                    : "Vous n'avez pas encore de notifications."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-colors hover:bg-accent/50 cursor-pointer ${
                    !notification.lue ? "border-l-4 border-l-primary bg-accent/30" : ""
                  }`}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        !notification.lue ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{notification.titre}</h3>
                        <div className="flex items-center gap-2">
                          {notification.priorite === 'haute' && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                          {!notification.lue && (
                            <>
                              <Badge className="bg-primary">Nouveau</Badge>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsRead(notification.id)
                                }}
                                title="Marquer comme lu"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.date_envoi)}
                        </p>
                        {notification.lien_action && (
                          <Link href={notification.lien_action}>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-xs text-primary"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Voir les détails →
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
