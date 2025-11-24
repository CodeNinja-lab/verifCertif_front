import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, MessageSquare, Calendar, Settings, CheckCheck, TrendingUp } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "application",
    icon: Briefcase,
    title: "Nouvelle candidature",
    description: "Alexandre Dupont a postulé pour Senior React Developer",
    time: "Il y a 10 minutes",
    unread: true,
  },
  {
    id: 2,
    type: "message",
    icon: MessageSquare,
    title: "Nouveau message",
    description: "Léa Martinez a répondu à votre message",
    time: "Il y a 30 minutes",
    unread: true,
  },
  {
    id: 3,
    type: "application",
    icon: Briefcase,
    title: "5 nouvelles candidatures",
    description: "Votre offre Product Manager a reçu 5 nouvelles candidatures",
    time: "Il y a 2 heures",
    unread: true,
  },
  {
    id: 4,
    type: "interview",
    icon: Calendar,
    title: "Rappel d'entretien",
    description: "Entretien avec Julien Bernard demain à 14h",
    time: "Il y a 4 heures",
    unread: false,
  },
  {
    id: 5,
    type: "stats",
    icon: TrendingUp,
    title: "Statistiques hebdomadaires",
    description: "Vos offres ont reçu 45 vues cette semaine",
    time: "Aujourd'hui",
    unread: false,
  },
]

export default function RecruiterNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Suivez l'activité de vos recrutements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-colors hover:bg-accent/50 cursor-pointer ${
              notification.unread ? "border-l-4 border-l-primary bg-accent/30" : ""
            }`}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  notification.unread ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <notification.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{notification.title}</h3>
                  {notification.unread && <Badge className="bg-primary">Nouveau</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
