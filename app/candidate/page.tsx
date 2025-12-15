"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Eye,
  Send,
  Heart,
  CheckCircle2,
  Clock,
  MapPin,
  Briefcase,
  ArrowRight,
  Sparkles,
  Target,
  GraduationCap,
  Download,
  FileCheck,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { documentApi, offreApi, authApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  prenom: string
  nom: string
  email: string
  numero_etudiant?: string
}

interface Document {
  id: number
  uuid_document: string
  titre: string
  type_document: string
  statut: string
  date_emission: string
  file_url: string
  administration?: {
    nom: string
  }
  metadata?: {
    degree_title?: string
    student_name?: string
    graduation_date?: string
  }
}

interface Offre {
  id: number
  titre: string
  nom_entreprise?: string
  recruteur?: {
    nom_entreprise?: string
  }
  localisation: string
  type_contrat: string
  teletravail?: string
  salaire_min?: number
  salaire_max?: number
  competences?: Array<{ nom: string }>
  created_at: string
}

export default function CandidateDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [diplomas, setDiplomas] = useState<Document[]>([])
  const [offres, setOffres] = useState<Offre[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les informations de l'utilisateur
        const userResponse = await authApi.me()
        setUser(userResponse.user)

        // Récupérer les diplômes de l'étudiant
        try {
          const diplomasResponse = await documentApi.myDocuments({ per_page: 10 })
          setDiplomas(diplomasResponse.data || [])
        } catch (err) {
          console.error("Erreur lors de la récupération des diplômes:", err)
          setDiplomas([])
        }

        // Récupérer les offres d'emploi publiées
        try {
          const offresResponse = await offreApi.list({ per_page: 3 })
          setOffres(offresResponse.data || [])
        } catch (err) {
          console.error("Erreur lors de la récupération des offres:", err)
          setOffres([])
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDownload = async (document: Document) => {
    try {
      setDownloadingId(document.id)
      const blob = await documentApi.download(document.id)
      const url = window.URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `${document.titre}.pdf`
      window.document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
      toast({
        title: "Téléchargement réussi",
        description: `Le diplôme "${document.titre}" a été téléchargé.`,
      })
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      toast({
        title: "Erreur de téléchargement",
        description: error instanceof Error ? error.message : "Impossible de télécharger le diplôme.",
        variant: "destructive",
      })
    } finally {
      setDownloadingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Non spécifié"
    if (min && max) return `${(min / 1000).toFixed(0)}k-${(max / 1000).toFixed(0)}k FCFA`
    if (min) return `${(min / 1000).toFixed(0)}k+ FCFA`
    return `Jusqu'à ${(max! / 1000).toFixed(0)}k FCFA`
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `${diffDays} jours`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semaine(s)`
    return `${Math.floor(diffDays / 30)} mois`
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const userName = user?.prenom || "Étudiant"

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bonjour, {userName}! 👋</h1>
          <p className="text-muted-foreground mt-1">Voici un aperçu de votre activité et de nouvelles opportunités</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary" asChild>
          <Link href="/candidate/recommendations">
            <Sparkles className="mr-2 h-4 w-4" />
            Voir les matchs
          </Link>
        </Button>
      </div>

      {/* Profile Completion */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Complétez votre profil</h3>
            <p className="text-sm text-muted-foreground">Un profil complet augmente vos chances de 85%</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            85%
          </Badge>
        </div>
        <Progress value={85} className="mb-4 h-2" />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/candidate/cv">Ajouter des certifications</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/candidate/profile">Ajouter une photo</Link>
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Certifiés
            </Badge>
          </div>
          <div className="text-2xl font-bold">{diplomas.length}</div>
          <p className="text-sm text-muted-foreground">Diplômes</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Briefcase className="h-5 w-5 text-secondary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Disponibles
            </Badge>
          </div>
          <div className="text-2xl font-bold">{offres.length}+</div>
          <p className="text-sm text-muted-foreground">Offres d'emploi</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Nouveau
            </Badge>
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-sm text-muted-foreground">Matchs IA</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Heart className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <div className="text-2xl font-bold">8</div>
          <p className="text-sm text-muted-foreground">Offres favorites</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Job Offers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Offres d'emploi disponibles</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/jobs">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {offres.length === 0 ? (
            <Card className="p-6 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune offre disponible pour le moment</p>
            </Card>
          ) : (
            offres.map((offre) => (
              <Card key={offre.id} className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                          {offre.titre}
                        </h3>
                        <p className="text-muted-foreground">
                          {offre.nom_entreprise || offre.recruteur?.nom_entreprise || "Entreprise"}
                        </p>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 flex-shrink-0">
                        <Target className="mr-1 h-3 w-3" />
                        Nouveau
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {offre.localisation || "Non spécifié"}
                      </span>
                      <span>{offre.type_contrat || "CDI"}</span>
                      <span className="font-semibold text-foreground">
                        {formatSalary(offre.salaire_min, offre.salaire_max)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getRelativeTime(offre.created_at)}
                      </span>
                    </div>
                    {offre.competences && offre.competences.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {offre.competences.slice(0, 3).map((comp, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {comp.nom}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-primary to-secondary" asChild>
                        <Link href={`/jobs/${offre.id}`}>Voir l'offre</Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Diplomas Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Mes Diplômes</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/candidate/cv">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {diplomas.length === 0 ? (
            <Card className="p-6 text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Aucun diplôme certifié</p>
              <p className="text-xs text-muted-foreground">
                Vos diplômes certifiés par votre université apparaîtront ici
              </p>
            </Card>
          ) : (
            diplomas.map((diploma) => (
              <Card key={diploma.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <FileCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">
                      {diploma.metadata?.degree_title || diploma.titre}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {diploma.administration?.nom || "Université"}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          diploma.statut === "ACTIF"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {diploma.statut === "ACTIF" ? "Certifié" : diploma.statut}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(diploma.date_emission)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => handleDownload(diploma)}
                      disabled={downloadingId === diploma.id}
                    >
                      {downloadingId === diploma.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Télécharger
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
