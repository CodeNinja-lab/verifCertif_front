"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sparkles,
  Star,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  ExternalLink,
  Brain,
  Target,
  TrendingUp,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react"
// Import dynamique pour éviter le bundling côté serveur

export default function RecruiterMatchingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const offreId = searchParams.get("offre")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPosition, setFilterPosition] = useState("all")
  const [matchings, setMatchings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [offre, setOffre] = useState<any>(null)

  useEffect(() => {
    if (offreId) {
      loadMatchings()
      loadOffre()
    }
  }, [offreId])

  const loadOffre = async () => {
    try {
      const { offreApi } = await import("@/lib/api-client")
      const data = await offreApi.get(offreId!)
      setOffre(data.offre || data)
    } catch (error) {
      console.error("Erreur lors du chargement de l'offre:", error)
    }
  }

  const loadMatchings = async () => {
    try {
      setLoading(true)
      const { offreApi } = await import("@/lib/api-client")
      const data = await offreApi.getMatchings(offreId!)
      setMatchings(data.data || data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des matchings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleContact = async (matching: any) => {
    try {
      const { messageApi } = await import("@/lib/api-client")
      // Créer ou obtenir la conversation
      const data = await messageApi.getOrCreateConversation(
        matching.etudiant_id,
        offreId ? parseInt(offreId) : undefined
      )
      // Rediriger vers la page messages
      router.push(`/recruiter/messages?conversation=${data.conversation.id}`)
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error)
    }
  }

  if (!offreId) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center text-muted-foreground">
          Veuillez sélectionner une offre pour voir les candidats recommandés
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  const filteredMatchings = matchings.filter((matching: any) => {
    if (searchQuery) {
      const name = matching.etudiant?.name || ""
      return name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  const matchedCandidates = filteredMatchings.map((matching: any) => ({
    id: matching.id,
    name: matching.etudiant?.name || "Candidat",
    title: matching.etudiant?.profilEtudiant?.titre_profil || "",
    location: matching.etudiant?.profilEtudiant?.localisation || "",
    experience: matching.etudiant?.profilEtudiant?.annees_experience || 0,
    availability: "Disponible",
    matchScore: Math.round(matching.score_global || 0),
    skillsMatch: matching.competences_matchees?.length || 0,
    skillsTotal: (matching.competences_matchees?.length || 0) + (matching.competences_manquantes?.length || 0),
    email: matching.etudiant?.email || "",
    phone: "",
    matchReasons: matching.points_forts || [],
    skills: matching.competences_matchees || [],
    salary: "",
    matching: matching,
  }))

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-secondary" />
            Candidats recommandés
          </h1>
          <p className="text-muted-foreground">
            Les meilleurs candidats pour votre poste: {offre?.titre || "Offre"}
          </p>
        </div>
        <Button className="bg-gradient-to-r from-secondary to-green-600 hover:opacity-90">
          <Brain className="mr-2 h-4 w-4" />
          Actualiser les recommandations
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Candidats matchés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchedCandidates.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pour ce poste</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Match moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {matchedCandidates.length > 0 
                ? Math.round(matchedCandidates.reduce((acc: number, c: any) => acc + c.matchScore, 0) / matchedCandidates.length)
                : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {matchedCandidates.filter((c: any) => c.availability === "Disponible").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Immédiatement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {matchings.filter((m: any) => m.vu_par_recruteur).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Candidats consultés</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, compétences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Poste" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les postes</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {matchedCandidates.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Aucun candidat matché pour cette offre
            </CardContent>
          </Card>
        ) : (
          matchedCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-all border-2 hover:border-secondary/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-secondary to-green-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{candidate.name}</h3>
                      <p className="text-lg text-muted-foreground">{candidate.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-green-600 bg-clip-text text-transparent">
                          {candidate.matchScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">Match IA</div>
                      </div>
                      <Star className="h-7 w-7 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {candidate.location}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {candidate.experience}
                    </Badge>
                    <Badge
                      className={
                        candidate.availability === "Disponible"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                      }
                    >
                      {candidate.availability}
                    </Badge>
                    <Badge variant="secondary">{candidate.salary}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Compétences requises</span>
                      <span className="font-medium">
                        {candidate.skillsMatch}/{candidate.skillsTotal}
                      </span>
                    </div>
                    <Progress value={(candidate.skillsMatch / candidate.skillsTotal) * 100} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-secondary" />
                      Pourquoi ce candidat ?
                    </p>
                    <ul className="grid grid-cols-2 gap-2">
                      {candidate.matchReasons.map((reason, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-secondary to-green-600 hover:opacity-90"
                      onClick={() => handleContact(candidate.matching)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contacter
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Voir le profil
                    </Button>
                    <Button variant="outline">
                      <Phone className="mr-2 h-4 w-4" />
                      Appeler
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  )
}
