"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Download,
  MapPin,
  Briefcase,
  GraduationCap,
  Target,
  Star,
  MessageSquare,
  Heart,
  Eye,
  Users,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function CandidatesPage() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(true)
  const [allCandidates, setAllCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [offres, setOffres] = useState<any[]>([])
  
  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [experienceFilters, setExperienceFilters] = useState<string[]>([])
  const [availabilityFilters, setAvailabilityFilters] = useState<string[]>([])
  const [educationFilters, setEducationFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("match")

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    try {
      setLoading(true)
      const { offreApi, candidatureApi } = await import("@/lib/api-client")
      // Charger toutes les offres du recruteur
      const offresData = await offreApi.list({ my_offres: true })
      setOffres(offresData.data || [])
      
      // Pour chaque offre, charger les candidatures ET les matchings
      const candidatesList: any[] = []
      for (const offre of offresData.data || []) {
        // Charger les vraies candidatures d'abord
        try {
          const candidaturesData = await candidatureApi.forOffre(offre.id)
          const candidatures = candidaturesData.data || []
          for (const candidature of candidatures) {
            if (candidature.etudiant) {
              const profil = candidature.etudiant.profil_etudiant || {}
              const experienceYears = profil.annees_experience || 0
              const experienceText = experienceYears === 0 ? "0-2 ans" : 
                                    experienceYears <= 2 ? "0-2 ans" :
                                    experienceYears <= 5 ? "3-5 ans" :
                                    experienceYears <= 10 ? "5-10 ans" : "10+ ans"
              
              candidatesList.push({
                id: candidature.id,
                etudiantId: candidature.etudiant_id,
                name: candidature.etudiant.name || `${candidature.etudiant.prenom || ''} ${candidature.etudiant.nom || ''}`.trim(),
                title: profil.titre_profil || "Candidat",
                location: profil.localisation || "Non spécifié",
                experience: `${experienceYears} ans`,
                experienceYears: experienceYears,
                experienceText: experienceText,
                education: profil.niveau_etudes || "Non spécifié",
                skills: [], // Les compétences seront chargées du profil
                match: 0, // Pas de score pour les candidatures directes
                salary: profil.salaire_souhaite ? `${profil.salaire_souhaite} FCFA` : "",
                available: candidature.disponibilite || "À discuter",
                rating: 4.5,
                candidature: candidature,
                offre: offre,
                dateMatching: candidature.date_candidature || candidature.created_at,
                type: 'candidature' // Marqueur pour identifier les vraies candidatures
              })
            }
          }
        } catch (error) {
          console.error(`Erreur lors du chargement des candidatures pour l'offre ${offre.id}:`, error)
        }

        // Ensuite charger les matchings
        try {
          const matchingsData = await offreApi.getMatchings(offre.id, { per_page: 100 })
          const matchings = matchingsData.data || matchingsData || []
          for (const matching of matchings) {
            if (matching.etudiant) {
              const profil = matching.etudiant.profilEtudiant || {}
              const experienceYears = profil.annees_experience || 0
              const experienceText = experienceYears === 0 ? "0-2 ans" : 
                                    experienceYears <= 2 ? "0-2 ans" :
                                    experienceYears <= 5 ? "3-5 ans" :
                                    experienceYears <= 10 ? "5-10 ans" : "10+ ans"
              
              candidatesList.push({
                id: matching.id,
                etudiantId: matching.etudiant_id,
                name: matching.etudiant.name || `${matching.etudiant.prenom || ''} ${matching.etudiant.nom || ''}`.trim(),
                title: profil.titre_profil || "",
                location: profil.localisation || "",
                experience: `${experienceYears} ans`,
                experienceYears: experienceYears,
                experienceText: experienceText,
                education: profil.niveau_etudes || "",
                skills: matching.competences_matchees || [],
                match: Math.round(matching.score_global || 0),
                salary: profil.salaire_souhaite ? `${profil.salaire_souhaite} ${profil.devise || 'FCFA'}` : "",
                available: "Immédiat", // Par défaut, peut être amélioré avec un champ dans le profil
                rating: 4.5, // Par défaut
                matching: matching,
                offre: offre,
                dateMatching: matching.date_matching || matching.created_at,
              })
            }
          }
        } catch (error) {
          console.error(`Erreur lors du chargement des matchings pour l'offre ${offre.id}:`, error)
        }
      }
      
      // Dédupliquer par étudiant (garder le meilleur match)
      const uniqueCandidates = candidatesList.reduce((acc: any[], candidate: any) => {
        const existing = acc.find((c: any) => c.etudiantId === candidate.etudiantId)
        if (!existing || candidate.match > existing.match) {
          if (existing) {
            const index = acc.indexOf(existing)
            acc[index] = candidate
          } else {
            acc.push(candidate)
          }
        }
        return acc
      }, [])
      
      setAllCandidates(uniqueCandidates)
    } catch (error) {
      console.error("Erreur lors du chargement des candidats:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fonction de filtrage
  const filteredCandidates = allCandidates.filter((candidate) => {
    // Filtre de recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        candidate.name.toLowerCase().includes(query) ||
        candidate.title.toLowerCase().includes(query) ||
        candidate.skills.some((skill: string) => skill.toLowerCase().includes(query))
      if (!matchesSearch) return false
    }

    // Filtre de localisation
    if (locationQuery) {
      const location = locationQuery.toLowerCase()
      if (!candidate.location.toLowerCase().includes(location)) return false
    }

    // Filtre d'expérience
    if (experienceFilters.length > 0) {
      if (!experienceFilters.includes(candidate.experienceText)) return false
    }

    // Filtre de disponibilité
    if (availabilityFilters.length > 0) {
      // Pour l'instant, on garde tous les candidats car on n'a pas cette info
      // Vous pouvez ajouter un champ disponibilité dans le profil étudiant
    }

    // Filtre d'éducation
    if (educationFilters.length > 0) {
      const education = candidate.education.toLowerCase()
      const matchesEducation = educationFilters.some(filter => {
        const filterLower = filter.toLowerCase()
        if (filterLower === "bac+3") return education.includes("licence") || education.includes("bac+3")
        if (filterLower === "bac+5") return education.includes("master") || education.includes("bac+5") || education.includes("mba")
        if (filterLower === "doctorat") return education.includes("doctorat") || education.includes("phd")
        return false
      })
      if (!matchesEducation) return false
    }

    return true
  })

  // Fonction de tri
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case "match":
        return b.match - a.match
      case "experience":
        return b.experienceYears - a.experienceYears
      case "recent":
        const dateA = new Date(a.dateMatching || 0).getTime()
        const dateB = new Date(b.dateMatching || 0).getTime()
        return dateB - dateA
      default:
        return 0
    }
  })

  const handleExperienceFilter = (exp: string) => {
    setExperienceFilters(prev => 
      prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]
    )
  }

  const handleAvailabilityFilter = (avail: string) => {
    setAvailabilityFilters(prev => 
      prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]
    )
  }

  const handleEducationFilter = (edu: string) => {
    setEducationFilters(prev => 
      prev.includes(edu) ? prev.filter(e => e !== edu) : [...prev, edu]
    )
  }

  const resetFilters = () => {
    setSearchQuery("")
    setLocationQuery("")
    setExperienceFilters([])
    setAvailabilityFilters([])
    setEducationFilters([])
    setSortBy("match")
  }

  const handleContact = async (candidate: any) => {
    try {
      const { messageApi } = await import("@/lib/api-client")
      // Créer ou obtenir la conversation
      const data = await messageApi.getOrCreateConversation(
        candidate.matching.etudiant_id,
        candidate.offre?.id
      )
      // Rediriger vers la page messages
      router.push(`/recruiter/messages?conversation=${data.conversation.id}`)
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">Chargement des candidats...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Base de candidats</h1>
          <p className="text-muted-foreground mt-1">
            {allCandidates.length > 0 
              ? `Recherchez parmi ${allCandidates.length} candidat(s) correspondant à vos offres`
              : "Aucun candidat pour le moment"}
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par compétences, poste, nom..." 
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:col-span-4 relative">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Localisation" 
              className="pl-10 h-12"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <Button 
              className="w-full h-12 bg-gradient-to-r from-secondary to-primary"
              onClick={() => {
                // La recherche se fait automatiquement via les filtres
              }}
            >
              <Search className="mr-2 h-5 w-5" />
              Rechercher
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-80 flex-shrink-0`}>
          <Card className="p-6 space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filtres</h3>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Réinitialiser
              </Button>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Expérience</h4>
              <div className="space-y-2">
                {["0-2 ans", "3-5 ans", "5-10 ans", "10+ ans"].map((exp) => (
                  <div key={exp} className="flex items-center space-x-2">
                    <Checkbox 
                      id={exp} 
                      checked={experienceFilters.includes(exp)}
                      onCheckedChange={() => handleExperienceFilter(exp)}
                    />
                    <label htmlFor={exp} className="text-sm cursor-pointer">
                      {exp}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Disponibilité</h4>
              <div className="space-y-2">
                {["Immédiat", "< 1 mois", "1-3 mois", "3+ mois"].map((avail) => (
                  <div key={avail} className="flex items-center space-x-2">
                    <Checkbox 
                      id={avail} 
                      checked={availabilityFilters.includes(avail)}
                      onCheckedChange={() => handleAvailabilityFilter(avail)}
                    />
                    <label htmlFor={avail} className="text-sm cursor-pointer">
                      {avail}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Niveau d'études</h4>
              <div className="space-y-2">
                {["Bac+3", "Bac+5", "Doctorat"].map((edu) => (
                  <div key={edu} className="flex items-center space-x-2">
                    <Checkbox 
                      id={edu} 
                      checked={educationFilters.includes(edu)}
                      onCheckedChange={() => handleEducationFilter(edu)}
                    />
                    <label htmlFor={edu} className="text-sm cursor-pointer">
                      {edu}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </aside>

        {/* Candidates List */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{sortedCandidates.length} candidat(s) trouvé(s)</h2>
              <p className="text-sm text-muted-foreground">
                {sortBy === "match" && "Triés par meilleur match"}
                {sortBy === "experience" && "Triés par expérience"}
                {sortBy === "recent" && "Triés par plus récent"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="lg:hidden bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Meilleur match</SelectItem>
                  <SelectItem value="experience">Expérience</SelectItem>
                  <SelectItem value="recent">Plus récent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {sortedCandidates.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun candidat trouvé</h3>
              <p className="text-muted-foreground">
                {allCandidates.length === 0 
                  ? "Vous n'avez pas encore de candidats correspondant à vos offres"
                  : "Aucun candidat ne correspond à vos critères de recherche. Essayez de modifier vos filtres."}
              </p>
            </Card>
          ) : (
            sortedCandidates.map((candidate) => (
            <Card key={candidate.id} className="p-6 hover:shadow-xl transition-all">
              <div className="flex gap-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-2xl font-bold flex-shrink-0">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-xl">{candidate.name}</h3>
                        {candidate.type === 'candidature' ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                            ✓ A postulé
                          </Badge>
                        ) : (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <Target className="mr-1 h-3 w-3" />
                            {candidate.match}% match
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{candidate.rating}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground font-medium">{candidate.title}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {candidate.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      {candidate.experience} d'expérience
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      {candidate.education}
                    </span>
                    <span className="font-semibold text-secondary">{candidate.salary}</span>
                    <Badge variant="secondary" className="text-xs">
                      Dispo: {candidate.available}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-secondary to-primary">Voir le profil complet</Button>
                    <Button variant="outline" onClick={() => handleContact(candidate)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contacter
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      CV
                    </Button>
                  </div>
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

export default CandidatesPage
