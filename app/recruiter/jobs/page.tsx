"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Eye, 
  Send, 
  CheckCircle2, 
  Briefcase, 
  Target, 
  ArrowRight, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function RecruiterJobsPage() {
  const [offres, setOffres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadOffres()
  }, [statusFilter])

  const loadOffres = async () => {
    try {
      setLoading(true)
      const { offreApi } = await import("@/lib/api-client")
      const params: any = { my_offres: true, per_page: 100 }
      if (statusFilter !== "all") {
        params.statut = statusFilter
      }
      const data = await offreApi.list(params)
      setOffres(data.data || [])
    } catch (error: any) {
      console.error("Erreur lors du chargement des offres:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = async (id: number | string) => {
    try {
      const { offreApi } = await import("@/lib/api-client")
      await offreApi.archive(id)
      loadOffres()
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error)
    }
  }

  const handleDelete = async (id: number | string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) return
    try {
      const { offreApi } = await import("@/lib/api-client")
      await offreApi.delete(id)
      loadOffres()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const handlePublish = async (id: number | string) => {
    try {
      const { offreApi } = await import("@/lib/api-client")
      await offreApi.publish(id)
      loadOffres()
    } catch (error) {
      console.error("Erreur lors de la publication:", error)
    }
  }

  const filteredOffres = offres.filter((offre: any) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        offre.titre?.toLowerCase().includes(query) ||
        offre.description?.toLowerCase().includes(query) ||
        offre.entreprise?.toLowerCase().includes(query) ||
        offre.lieu?.toLowerCase().includes(query)
      )
    }
    return true
  })

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "PUBLIEE":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Publiée</Badge>
      case "BROUILLON":
        return <Badge variant="secondary">Brouillon</Badge>
      case "ARCHIVEE":
        return <Badge variant="outline">Archivée</Badge>
      case "EXPIREE":
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">Expirée</Badge>
      case "POURVUE":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">Pourvue</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes offres d'emploi</h1>
          <p className="text-muted-foreground mt-1">Gérez toutes vos offres d'emploi</p>
        </div>
        <Button className="bg-gradient-to-r from-secondary to-primary" asChild>
          <Link href="/recruiter/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            Publier une nouvelle offre
          </Link>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre, entreprise, localisation..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:col-span-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="PUBLIEE">Publiées</SelectItem>
                <SelectItem value="BROUILLON">Brouillons</SelectItem>
                <SelectItem value="ARCHIVEE">Archivées</SelectItem>
                <SelectItem value="EXPIREE">Expirées</SelectItem>
                <SelectItem value="POURVUE">Pourvues</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total offres</p>
              <p className="text-2xl font-bold">{offres.length}</p>
            </div>
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Publiées</p>
              <p className="text-2xl font-bold text-green-600">
                {offres.filter((o: any) => o.statut === "PUBLIEE").length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Brouillons</p>
              <p className="text-2xl font-bold">
                {offres.filter((o: any) => o.statut === "BROUILLON").length}
              </p>
            </div>
            <Edit className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Candidatures totales</p>
              <p className="text-2xl font-bold">
                {offres.reduce((acc: number, o: any) => acc + (o.nombre_candidatures || 0), 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Liste des offres */}
      <div className="space-y-4">
        {filteredOffres.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune offre trouvée</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Aucune offre ne correspond à vos critères de recherche"
                : "Vous n'avez pas encore créé d'offre d'emploi"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button className="bg-gradient-to-r from-secondary to-primary" asChild>
                <Link href="/recruiter/jobs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer votre première offre
                </Link>
              </Button>
            )}
          </Card>
        ) : (
          filteredOffres.map((job: any) => {
            const progress = job.nombre_candidatures > 0 ? Math.min((job.nombre_candidatures / 50) * 100, 100) : 0
            return (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-xl">{job.titre}</h3>
                      {getStatusBadge(job.statut)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4" />
                        {job.entreprise}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {job.lieu}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {job.date_publication
                          ? new Date(job.date_publication).toLocaleDateString("fr-FR")
                          : "Non publiée"}
                      </span>
                      {job.salaire_min && job.salaire_max && (
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4" />
                          {job.salaire_min} - {job.salaire_max} {job.devise === "XOF" || !job.devise ? "FCFA" : job.devise}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description?.substring(0, 150)}...
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/jobs/${job.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir l'offre
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/recruiter/matching?offre=${job.id}`}>
                          <Users className="mr-2 h-4 w-4" />
                          Voir les candidatures
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {job.statut === "BROUILLON" && (
                        <DropdownMenuItem onClick={() => handlePublish(job.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Publier
                        </DropdownMenuItem>
                      )}
                      {job.statut === "PUBLIEE" && (
                        <DropdownMenuItem onClick={() => handleArchive(job.id)}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archiver
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(job.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Send className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Candidatures:</span>
                    <span className="font-semibold">{job.nombre_candidatures || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Vues:</span>
                    <span className="font-semibold">{job.nombre_vues || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-semibold">{job.type_contrat || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Match moyen:</span>
                    <span className="font-semibold">85%</span>
                  </div>
                </div>

                {job.statut === "PUBLIEE" && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Taux de complétion</span>
                      <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/recruiter/matching?offre=${job.id}`}>
                      <Users className="mr-2 h-4 w-4" />
                      Voir les candidatures ({job.nombre_candidatures || 0})
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/jobs/${job.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir l'offre
                    </Link>
                  </Button>
                  {job.statut === "BROUILLON" && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-secondary to-primary"
                      onClick={() => handlePublish(job.id)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Publier
                    </Button>
                  )}
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

