import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CandidateApplications() {
  const applications = [
    {
      id: 1,
      position: "Développeur Full-Stack Senior",
      company: "TechSenegal Innovation", // Localized company
      location: "Dakar, Sénégal", // Localized location
      salary: "800k-1.2M FCFA", // Localized currency
      appliedDate: "15 Jan 2025",
      status: "interview",
      statusLabel: "Entretien prévu",
      interviewDate: "25 Jan 2025",
      messages: 3,
    },
    {
      id: 2,
      position: "Lead Frontend Developer",
      company: "Digital Dakar Solutions", // Localized company
      location: "Saly (Télétravail)", // Localized location
      salary: "700k-1M FCFA", // Localized currency
      appliedDate: "12 Jan 2025",
      status: "review",
      statusLabel: "En cours de review",
      messages: 1,
    },
    {
      id: 3,
      position: "Architecte Solutions Cloud",
      company: "CloudFirst",
      location: "Remote",
      salary: "1M-1.5M FCFA",
      appliedDate: "10 Jan 2025",
      status: "applied",
      statusLabel: "Candidature envoyée",
      messages: 0,
    },
    {
      id: 4,
      position: "Tech Lead",
      company: "InnovateLab SN",
      location: "Dakar, Sénégal", // Localized location
      salary: "900k-1.5M FCFA", // Localized currency
      appliedDate: "08 Jan 2025",
      status: "rejected",
      statusLabel: "Non retenu",
      messages: 1,
    },
    {
      id: 5,
      position: "Senior Backend Developer",
      company: "StartupHub West Africa",
      location: "Saint-Louis", // Localized location
      salary: "600k-900k FCFA", // Localized currency
      appliedDate: "05 Jan 2025",
      status: "applied",
      statusLabel: "Candidature envoyée",
      messages: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interview":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "review":
        return "bg-primary/10 text-primary border-primary/20"
      case "applied":
        return "bg-muted text-muted-foreground"
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "interview":
        return CheckCircle2
      case "review":
        return Clock
      case "applied":
        return Eye
      case "rejected":
        return XCircle
      default:
        return Clock
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes candidatures</h1>
        <p className="text-muted-foreground mt-1">Suivez l'évolution de toutes vos candidatures en un seul endroit</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">23</div>
          <p className="text-sm text-muted-foreground">Total candidatures</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-secondary">5</div>
          <p className="text-sm text-muted-foreground">En cours</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">3</div>
          <p className="text-sm text-muted-foreground">Entretiens prévus</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">65%</div>
          <p className="text-sm text-muted-foreground">Taux de réponse</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher par poste ou entreprise..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => {
          const StatusIcon = getStatusIcon(app.status)

          return (
            <Card key={app.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex gap-6">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{app.position}</h3>
                      <p className="text-muted-foreground">{app.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(app.status)}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {app.statusLabel}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                          <DropdownMenuItem>Envoyer un message</DropdownMenuItem>
                          <DropdownMenuItem>Annuler la candidature</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {app.location}
                    </span>
                    <span className="font-semibold text-foreground">{app.salary}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Postulé le {app.appliedDate}
                    </span>
                    {app.messages > 0 && (
                      <span className="flex items-center gap-1 text-primary">
                        <MessageSquare className="h-4 w-4" />
                        {app.messages} message{app.messages > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {app.interviewDate && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium">Entretien prévu le {app.interviewDate}</span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Voir l'offre
                    </Button>
                    {app.messages > 0 && (
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
