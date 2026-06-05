"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  Building,
  Globe,
  Github,
  Linkedin,
  ExternalLink,
  MessageSquare,
  ArrowLeft,
  Star,
  Award,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

export default function CandidateProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [cv, setCv] = useState<any>(null)

  useEffect(() => {
    loadCandidateProfile()
  }, [userId])

  const loadCandidateProfile = async () => {
    try {
      setLoading(true)
      const { profilEtudiantApi, cvApi, authApi } = await import("@/lib/api-client")
      
      // Charger le profil étudiant
      const profilData = await profilEtudiantApi.getByUserId(userId)
      setProfile(profilData.data || profilData)
      setStudent(profilData.data?.utilisateur || profilData.utilisateur)
      
      // Charger le CV
      const cvData = await cvApi.getByUserId(userId)
      setCv(cvData)
    } catch (error: any) {
      console.error("Erreur lors du chargement du profil:", error)
      let errorMessage = "Impossible de charger le profil du candidat."
      
      if (error.status === 403) {
        errorMessage = "Ce profil est privé ou vous n'avez pas l'autorisation d'y accéder."
      } else if (error.status === 404) {
        errorMessage = "Ce candidat n'a pas encore complété son profil."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const handleContact = async () => {
    try {
      const { messageApi } = await import("@/lib/api-client")
      const data = await messageApi.getOrCreateConversation(userId)
      router.push(`/recruiter/messages?conversation=${data.conversation?.id ?? data.id}`)
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error)
      alert("Erreur lors de l'ouverture de la conversation")
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Chargement du profil...</div>
      </div>
    )
  }

  if (!student || !profile) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">Profil non trouvé</h3>
          <p className="text-muted-foreground mb-4">
            Ce candidat n'a pas encore complété son profil.
          </p>
          <Button onClick={() => router.back()}>Retour</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      {/* Profile Header */}
      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-4xl font-bold flex-shrink-0">
            {student.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
                <p className="text-xl text-muted-foreground mb-3">
                  {profile.titre_profil || "Candidat"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button className="bg-gradient-to-r from-secondary to-primary" onClick={handleContact}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contacter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {profile.localisation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.localisation}</span>
                </div>
              )}
              {student.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
              )}
              {student.telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.telephone}</span>
                </div>
              )}
              {profile.disponibilite && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Disponibilité: {profile.disponibilite}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              {profile.linkedin_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {profile.github_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              )}
              {profile.portfolio_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Portfolio
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Bio */}
      {profile.bio && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">À propos</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
        </Card>
      )}

      {/* Compétences */}
      {profile.profil_competences && profile.profil_competences.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Compétences
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.profil_competences.map((pc: any) => (
              <Badge key={pc.id} variant="secondary" className="text-sm py-1.5 px-3">
                {pc.competence?.nom || pc.nom}
                {pc.niveau && (
                  <span className="ml-2 text-xs opacity-70">
                    • {pc.niveau}
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Expériences */}
      {cv?.experiences && cv.experiences.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Expériences professionnelles
          </h2>
          <div className="space-y-6">
            {cv.experiences.map((exp: any, index: number) => (
              <div key={exp.id || index}>
                {index > 0 && <Separator className="my-6" />}
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{exp.titre}</h3>
                        <p className="text-muted-foreground">{exp.entreprise}</p>
                      </div>
                      {exp.poste_actuel && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                          En poste
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(exp.date_debut).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                        {" - "}
                        {exp.date_fin 
                          ? new Date(exp.date_fin).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
                          : "Présent"}
                      </span>
                      {exp.localisation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exp.localisation}
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-3">
                        {exp.description}
                      </p>
                    )}
                    {exp.realisations && exp.realisations.length > 0 && (
                      <ul className="space-y-1">
                        {exp.realisations.map((real: string, idx: number) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{real}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Formations */}
      {cv?.formations && cv.formations.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Formation
          </h2>
          <div className="space-y-6">
            {cv.formations.map((form: any, index: number) => (
              <div key={form.id || index}>
                {index > 0 && <Separator className="my-6" />}
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{form.diplome}</h3>
                        <p className="text-muted-foreground">{form.etablissement}</p>
                      </div>
                      {form.en_cours && (
                        <Badge variant="secondary">En cours</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(form.date_debut).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                        {" - "}
                        {form.date_fin 
                          ? new Date(form.date_fin).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
                          : "En cours"}
                      </span>
                      {form.localisation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {form.localisation}
                        </span>
                      )}
                    </div>
                    {form.description && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {form.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Certifications */}
      {cv?.certifications && cv.certifications.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications
          </h2>
          <div className="space-y-4">
            {cv.certifications.map((cert: any, index: number) => (
              <div key={cert.id || index} className="flex gap-4 p-4 border rounded-lg">
                <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{cert.nom}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{cert.organisme}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      Obtenue: {new Date(cert.date_obtention).toLocaleDateString("fr-FR")}
                    </span>
                    {cert.date_expiration && (
                      <span>
                        Expire: {new Date(cert.date_expiration).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    {cert.url_verification && (
                      <Button variant="link" size="sm" className="h-auto p-0" asChild>
                        <a href={cert.url_verification} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Vérifier
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Informations de recherche */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Préférences de recherche</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.salaire_souhaite && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Salaire souhaité</p>
              <p className="font-semibold">
                {profile.salaire_souhaite} {profile.devise || "FCFA"}
              </p>
            </div>
          )}
          {profile.types_contrat_souhaites && profile.types_contrat_souhaites.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Types de contrat</p>
              <div className="flex flex-wrap gap-2">
                {profile.types_contrat_souhaites.map((type: string) => (
                  <Badge key={type} variant="outline">{type}</Badge>
                ))}
              </div>
            </div>
          )}
          {profile.localisation_souhaitee && profile.localisation_souhaitee.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Localisations souhaitées</p>
              <div className="flex flex-wrap gap-2">
                {profile.localisation_souhaitee.map((loc: string) => (
                  <Badge key={loc} variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {profile.mobilite && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Mobilité</p>
              <p className="font-semibold">{profile.mobilite}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
