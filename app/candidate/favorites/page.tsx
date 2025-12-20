"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Clock,
  Heart,
  Building2,
  DollarSign,
  Home,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { favoriApi } from "@/lib/api-client"
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

interface Offre {
  id: number
  titre: string
  entreprise: string
  lieu: string
  type_contrat: string
  salaire_min?: number
  salaire_max?: number
  devise?: string
  teletravail?: string
  statut?: string
  date_publication?: string
  favorited_at?: string
}

export default function CandidateFavorites() {
  const [favoris, setFavoris] = useState<Offre[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [offreToRemove, setOffreToRemove] = useState<Offre | null>(null)
  const [removing, setRemoving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadFavoris()
  }, [])

  const loadFavoris = async () => {
    try {
      setLoading(true)
      const response = await favoriApi.list()
      if (response.success) {
        setFavoris(response.data || [])
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des favoris:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger vos favoris",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavori = async () => {
    if (!offreToRemove) return

    try {
      setRemoving(true)
      const response = await favoriApi.remove(offreToRemove.id)
      if (response.success) {
        toast({
          title: "Favori retiré",
          description: "L'offre a été retirée de vos favoris",
        })
        setFavoris(favoris.filter((f) => f.id !== offreToRemove.id))
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de retirer le favori",
        variant: "destructive",
      })
    } finally {
      setRemoving(false)
      setRemoveDialogOpen(false)
      setOffreToRemove(null)
    }
  }

  // Formater la date
  const formatDate = (dateString?: string) => {
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
    const currency = devise === "XOF" || !devise ? "FCFA" : devise
    if (min && max) {
      return `${(min / 1000).toFixed(0)}k-${(max / 1000).toFixed(0)}k ${currency}`
    }
    if (min) return `${(min / 1000).toFixed(0)}k+ ${currency}`
    if (max) return `Jusqu'à ${(max / 1000).toFixed(0)}k ${currency}`
    return null
  }

  // Formater télétravail
  const formatTeletravail = (teletravail?: string) => {
    switch (teletravail) {
      case "total": return "Full Remote"
      case "partiel": return "Hybride"
      case "non": return "Présentiel"
      default: return null
    }
  }

  // Filtrer les favoris
  const filteredFavoris = favoris.filter((offre) => {
    const search = searchTerm.toLowerCase()
    return (
      offre.titre?.toLowerCase().includes(search) ||
      offre.entreprise?.toLowerCase().includes(search) ||
      offre.lieu?.toLowerCase().includes(search)
    )
  })

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de vos favoris...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes offres favorites</h1>
        <p className="text-muted-foreground mt-1">
          Retrouvez toutes les offres que vous avez sauvegardées
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{favoris.length}</div>
              <p className="text-sm text-muted-foreground">Offres sauvegardées</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {favoris.filter((f) => f.statut?.toLowerCase() === "publiee").length}
              </div>
              <p className="text-sm text-muted-foreground">Encore disponibles</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Home className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {favoris.filter((f) => f.teletravail === "total" || f.teletravail === "partiel").length}
              </div>
              <p className="text-sm text-muted-foreground">Avec télétravail</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans vos favoris..."
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

      {/* Favorites List */}
      <div className="space-y-4">
        {filteredFavoris.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "Aucun résultat" : "Aucun favori"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Aucune offre ne correspond à votre recherche."
                  : "Vous n'avez pas encore ajouté d'offres à vos favoris."}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link href="/jobs">Découvrir les offres</Link>
                </Button>
              )}
            </div>
          </Card>
        ) : (
          filteredFavoris.map((offre) => {
            const salary = formatSalary(offre.salaire_min, offre.salaire_max, offre.devise)
            const teletravail = formatTeletravail(offre.teletravail)

            return (
              <Card key={offre.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex gap-6">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-7 w-7 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <Link href={`/jobs/${offre.id}`}>
                          <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">
                            {offre.titre}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground">{offre.entreprise}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setOffreToRemove(offre)
                          setRemoveDialogOpen(true)
                        }}
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {offre.lieu}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {offre.type_contrat}
                      </span>
                      {teletravail && (
                        <span className="flex items-center gap-1">
                          <Home className="h-4 w-4" />
                          {teletravail}
                        </span>
                      )}
                      {salary && (
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <DollarSign className="h-4 w-4 text-secondary" />
                          {salary}
                        </span>
                      )}
                    </div>

                    {offre.favorited_at && (
                      <p className="text-xs text-muted-foreground mb-3">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Ajouté le {formatDate(offre.favorited_at)}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <Link href={`/jobs/${offre.id}`}>Voir l'offre</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/jobs/${offre.id}/apply`}>Postuler</Link>
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
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer des favoris ?</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous retirer l'offre <strong>{offreToRemove?.titre}</strong> chez{" "}
              <strong>{offreToRemove?.entreprise}</strong> de vos favoris ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFavori}
              disabled={removing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Retrait...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Retirer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
