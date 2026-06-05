"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Briefcase,
  Clock,
  Building2,
  Heart,
  Share2,
  DollarSign,
  Home,
  Users,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Target,
  Loader2,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [similarJobs, setSimilarJobs] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [contacting, setContacting] = useState(false)

  useEffect(() => {
    if (jobId) {
      checkAuthAndLoadJob()
    }
  }, [jobId])

  const checkAuthAndLoadJob = async () => {
    // Vérifier l'authentification
    const token = localStorage.getItem("auth_token")
    if (token) {
      try {
        const { authApi } = await import("@/lib/api-client")
        const userData = await authApi.me()
        if (userData.user) {
          setUser(userData.user)
          setIsAuthenticated(true)
        }
      } catch {
        setIsAuthenticated(false)
      }
    }
    
    await loadJob()
  }

  const loadJob = async () => {
    if (!jobId) return
    try {
      setLoading(true)
      const { offreApi } = await import("@/lib/api-client")
      const data = await offreApi.get(jobId)
      // Le backend renvoie un Resource Laravel : { data: {...offre} }
      setJob(data.data || data.offre || data)
      
      // Charger des offres similaires
      const similarData = await offreApi.list({ per_page: 3 })
      setSimilarJobs((similarData.data || similarData || []).filter((o: any) => o.id !== parseInt(jobId)).slice(0, 3))
    } catch (error: any) {
      console.error("Erreur lors du chargement de l'offre:", error)
      toast.error("Erreur", {
        description: error.message || "Impossible de charger l'offre.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContactRecruiter = async () => {
    if (!isAuthenticated) {
      toast.error("Connexion requise", {
        description: "Vous devez être connecté pour contacter le recruteur.",
      })
      router.push(`/login?redirect=/jobs/${jobId}`)
      return
    }

    if (user.type !== "etudiant") {
      toast.error("Accès refusé", {
        description: "Seuls les étudiants peuvent contacter les recruteurs.",
      })
      return
    }

    try {
      setContacting(true)
      const { messageApi } = await import("@/lib/api-client")
      
      // Créer ou récupérer la conversation avec le recruteur
      const response = await messageApi.getOrCreateConversationAsStudent(parseInt(jobId))
      
      if (response.success && response.conversation) {
        // Rediriger vers la page des messages avec cette conversation
        router.push(`/candidate/messages?conversation=${response.conversation.id}`)
        toast.success("Conversation ouverte", {
          description: "Vous pouvez maintenant discuter avec le recruteur.",
        })
      }
    } catch (error: any) {
      console.error("Erreur:", error)
      toast.error("Erreur", {
        description: error.message || "Impossible de contacter le recruteur.",
      })
    } finally {
      setContacting(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
    return `Il y a ${Math.floor(diffDays / 30)} mois`
  }

  const formatSalary = (min?: number, max?: number, devise?: string) => {
    if (!min && !max) return null
    const currency = devise === "XOF" || !devise ? "FCFA" : devise
    if (min && max) {
      return `${(min / 1000).toFixed(0)}k - ${(max / 1000).toFixed(0)}k ${currency}`
    }
    if (min) return `${(min / 1000).toFixed(0)}k ${currency}`
    if (max) return `Jusqu'à ${(max / 1000).toFixed(0)}k ${currency}`
    return null
  }

  const formatTeletravail = (teletravail?: string) => {
    switch (teletravail) {
      case "total": return "Full Remote"
      case "partiel": return "Hybride"
      case "non": return "Présentiel"
      default: return "Non spécifié"
    }
  }

  const parseTextToList = (text?: string): string[] => {
    if (!text) return []
    // Si c'est déjà un tableau JSON
    if (typeof text === 'string' && text.trim().startsWith('[')) {
      try {
        return JSON.parse(text)
      } catch {
        // Si ça échoue, traiter comme texte
      }
    }
    // Sinon, parser le texte ligne par ligne
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[-•*]\s*/, '')) // Enlever les puces
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement de l'offre...</p>
          </div>
        </main>
        <PublicFooter />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Offre introuvable</p>
            <p className="text-muted-foreground mb-4">Cette offre n'existe pas ou a été supprimée.</p>
            <Button asChild>
              <Link href="/jobs">Voir toutes les offres</Link>
            </Button>
          </div>
        </main>
        <PublicFooter />
      </div>
    )
  }

  const responsibilities = parseTextToList(job.missions_principales)
  const requirements = parseTextToList(job.profil_recherche)
  const niceToHave = parseTextToList(job.nice_to_have)
  const benefits = Array.isArray(job.avantages) ? job.avantages : parseTextToList(job.avantages)
  const process = Array.isArray(job.processus_recrutement) ? job.processus_recrutement : []
  const skills = (job.competences || []).map((c: any) => c.competence?.nom || c.nom || c).filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 bg-muted/30">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Company Logo */}
              <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl flex-shrink-0">
                <Building2 className="h-10 w-10 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">{job.titre}</h1>
                    <div className="flex items-center gap-3 text-lg">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{job.entreprise}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-6">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{job.lieu}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{job.type_contrat}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatTeletravail(job.teletravail)}</span>
                  </span>
                  {formatSalary(job.salaire_min, job.salaire_max, job.devise) && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-secondary" />
                      <span className="font-semibold text-secondary">
                        {formatSalary(job.salaire_min, job.salaire_max, job.devise)}
                      </span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Publié {formatDate(job.date_publication)}</span>
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-lg" asChild>
                    <Link href={`/jobs/${jobId}/apply`}>Postuler maintenant</Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={handleContactRecruiter}
                    disabled={contacting}
                  >
                    {contacting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contacter le recruteur
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">À propos du poste</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>
              </Card>

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Missions principales</h2>
                  <ul className="space-y-3">
                    {responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Requirements */}
              {(requirements.length > 0 || niceToHave.length > 0) && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Profil recherché</h2>
                  <div className="space-y-6">
                    {requirements.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Compétences requises</h3>
                        <ul className="space-y-2">
                          {requirements.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {niceToHave.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-3">Atouts appréciés</h3>
                          <ul className="space-y-2">
                            {niceToHave.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <div className="h-5 w-5 rounded-full border-2 border-primary/30 flex-shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Technologies utilisées</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-sm px-3 py-1.5">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Process */}
              {process.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Processus de recrutement</h2>
                  <p className="text-muted-foreground mb-6">Durée totale estimée : 2-3 semaines</p>
                  <div className="space-y-4">
                    {process.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {step.step || idx + 1}
                          </div>
                          {idx < process.length - 1 && (
                            <div className="flex-1 w-0.5 bg-border mt-2" style={{ minHeight: "40px" }} />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <h4 className="font-semibold mb-1">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">Durée : {step.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Candidatures</span>
                    </div>
                    <span className="font-semibold">{job.nombre_candidatures || job.matchings_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Vues</span>
                    </div>
                    <span className="font-semibold">{job.nombre_vues || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Publié</span>
                    </div>
                    <span className="font-semibold">{formatDate(job.date_publication)}</span>
                  </div>
                </div>
              </Card>

              {/* Benefits */}
              {benefits.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Avantages</h3>
                  <ul className="space-y-2">
                    {benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* CTA */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <h3 className="font-semibold mb-2">Intéressé(e) ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Postulez dès maintenant et rejoignez une équipe passionnée !
                </p>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary" size="lg" asChild>
                  <Link href={`/jobs/${jobId}/apply`}>Postuler</Link>
                </Button>
              </Card>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Offres similaires</h3>
                  <div className="space-y-3">
                    {similarJobs.map((similar) => (
                      <Link key={similar.id} href={`/jobs/${similar.id}`}>
                        <div className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                          <h4 className="font-medium text-sm mb-1 hover:text-primary transition-colors">
                            {similar.titre}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">{similar.entreprise}</p>
                          <div className="flex items-center justify-between">
                            {formatSalary(similar.salaire_min, similar.salaire_max, similar.devise) && (
                              <span className="text-xs font-semibold">
                                {formatSalary(similar.salaire_min, similar.salaire_max, similar.devise)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
