"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { candidatureApi, messageApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Candidature {
  id: number
  offre_id: number
  statut: string
  statut_label: string
  lettre_motivation?: string
  date_candidature: string
  date_entretien?: string
  feedback?: string
  offre?: {
    id: number
    titre: string
    entreprise: string
    lieu: string
    type_contrat: string
    salaire_min?: number
    salaire_max?: number
    devise?: string
    teletravail?: boolean
    statut?: string
  }
}

export default function CandidateApplications() {
  const router = useRouter()
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [candidatureToDelete, setCandidatureToDelete] = useState<Candidature | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  // Charger les candidatures
  useEffect(() => {
    loadCandidatures()
  }, [])

  const loadCandidatures = async () => {
    try {
      setLoading(true)
      const response = await candidatureApi.list()
      if (response.success) {
        setCandidatures(response.data || [])
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des candidatures:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger vos candidatures",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (candidature: Candidature) => {
    if (!candidature.offre_id) {
      toast({
        title: "Erreur",
        description: "Cette candidature n'a pas d'offre associée",
        variant: "destructive",
      })
      return
    }

    // Afficher un toast de chargement
    toast({
      title: "Ouverture de la conversation...",
      description: "Veuillez patienter",
    })

    try {
      // Créer ou obtenir la conversation avec le recruteur
      const response = await messageApi.getOrCreateConversationAsStudent(candidature.offre_id)
      
      if (response.success && response.conversation) {
        // Rediriger vers la page des messages avec la conversation ouverte
        router.push(`/candidate/messages?conversation=${response.conversation.id}`)
      } else {
        throw new Error("Réponse invalide du serveur")
      }
    } catch (error: any) {
      console.error("Erreur lors de la création de la conversation:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de contacter le recruteur. Vérifiez votre connexion.",
        variant: "destructive",
      })
    }
  }

  // Mapper le statut backend vers le format frontend
  const mapStatutToStatus = (statut: string): string => {
    switch (statut) {
      case "envoyee":
      case "vue":
        return "applied"
      case "en_cours":
        return "review"
      case "entretien":
        return "interview"
      case "acceptee":
        return "accepted"
      case "refusee":
        return "rejected"
      case "annulee":
        return "cancelled"
      default:
        return "applied"
    }
  }

  const getStatusColor = (statut: string) => {
    const status = mapStatutToStatus(statut)
    switch (status) {
      case "interview":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "review":
        return "bg-primary/10 text-primary border-primary/20"
      case "applied":
        return "bg-muted text-muted-foreground"
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200"
      case "rejected":
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (statut: string) => {
    const status = mapStatutToStatus(statut)
    switch (status) {
      case "interview":
        return CheckCircle2
      case "review":
        return Clock
      case "applied":
        return Eye
      case "accepted":
        return CheckCircle2
      case "rejected":
      case "cancelled":
        return XCircle
      default:
        return Clock
    }
  }

  // Formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Formater le salaire
  const formatSalary = (min?: number, max?: number, devise?: string) => {
    if (!min && !max) return null
    const currency = devise || "FCFA"
    if (min && max) {
      return `${(min / 1000).toFixed(0)}k-${(max / 1000).toFixed(0)}k ${currency}`
    }
    if (min) return `${(min / 1000).toFixed(0)}k+ ${currency}`
    if (max) return `Jusqu'à ${(max / 1000).toFixed(0)}k ${currency}`
    return null
  }

  // Filtrer les candidatures
  const filteredCandidatures = candidatures.filter((c) => {
    const search = searchTerm.toLowerCase()
    return (
      (c.offre?.titre?.toLowerCase().includes(search) || false) ||
      (c.offre?.entreprise?.toLowerCase().includes(search) || false)
    )
  })

  // Stats
  const totalCandidatures = candidatures.length
  const enCours = candidatures.filter(c => ["envoyee", "vue", "en_cours"].includes(c.statut)).length
  const entretiensPrevu = candidatures.filter(c => c.statut === "entretien").length
  const tauxReponse = totalCandidatures > 0 
    ? Math.round((candidatures.filter(c => !["envoyee"].includes(c.statut)).length / totalCandidatures) * 100)
    : 0

  // Annuler une candidature
  const handleCancelCandidature = async () => {
    if (!candidatureToDelete) return
    
    try {
      setDeleting(true)
      const response = await candidatureApi.delete(candidatureToDelete.id)
      if (response.success) {
        toast({
          title: "Candidature retirée",
          description: "Votre candidature a été retirée avec succès",
        })
        loadCandidatures()
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de retirer la candidature",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setCandidatureToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de vos candidatures...</p>
        </div>
      </div>
    )
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
          <div className="text-2xl font-bold text-primary">{totalCandidatures}</div>
          <p className="text-sm text-muted-foreground">Total candidatures</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-secondary">{enCours}</div>
          <p className="text-sm text-muted-foreground">En cours</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">{entretiensPrevu}</div>
          <p className="text-sm text-muted-foreground">Entretiens prévus</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{tauxReponse}%</div>
          <p className="text-sm text-muted-foreground">Taux de réponse</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par poste ou entreprise..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredCandidatures.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "Aucun résultat" : "Aucune candidature"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Aucune candidature ne correspond à votre recherche."
                  : "Vous n'avez pas encore postulé à une offre d'emploi."
                }
              </p>
            </div>
          </Card>
        ) : (
          filteredCandidatures.map((candidature) => {
            const StatusIcon = getStatusIcon(candidature.statut)
            const salary = formatSalary(
              candidature.offre?.salaire_min,
              candidature.offre?.salaire_max,
              candidature.offre?.devise
            )

            return (
              <Card key={candidature.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex gap-6">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {candidature.offre?.titre || "Offre inconnue"}
                        </h3>
                        <p className="text-muted-foreground">
                          {candidature.offre?.entreprise || "Entreprise inconnue"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(candidature.statut)}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {candidature.statut_label}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendMessage(candidature)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Envoyer un message
                            </DropdownMenuItem>
                            {!["acceptee", "refusee", "annulee"].includes(candidature.statut) && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setCandidatureToDelete(candidature)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Annuler la candidature
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                      {candidature.offre?.lieu && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {candidature.offre.lieu}
                          {candidature.offre.teletravail && " (Télétravail)"}
                        </span>
                      )}
                      {salary && (
                        <span className="font-semibold text-foreground">{salary}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Postulé le {formatDate(candidature.date_candidature)}
                      </span>
                    </div>

                    {candidature.date_entretien && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                        <Calendar className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium">
                          Entretien prévu le {formatDate(candidature.date_entretien)}
                        </span>
                      </div>
                    )}

                    {candidature.feedback && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 border">
                        <p className="text-sm text-muted-foreground">
                          <strong>Retour du recruteur :</strong> {candidature.feedback}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        Voir l'offre
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la candidature ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir retirer votre candidature pour le poste de{" "}
              <strong>{candidatureToDelete?.offre?.titre}</strong> chez{" "}
              <strong>{candidatureToDelete?.offre?.entreprise}</strong> ?
              <br /><br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Non, garder</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelCandidature}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Annulation...
                </>
              ) : (
                "Oui, retirer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
