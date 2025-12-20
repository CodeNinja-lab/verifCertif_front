"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Briefcase,
  Building2,
  Home,
  DollarSign,
  Loader2,
  ArrowLeft,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { offreApi, candidatureApi, authApi } from "@/lib/api-client"

export default function ApplyJobPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [lettreMotivation, setLettreMotivation] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)

  useEffect(() => {
    if (jobId) {
      checkAuthAndLoadData()
    }
  }, [jobId])

  const checkAuthAndLoadData = async () => {
    if (!jobId) return
    try {
      setLoading(true)
      
      // Vérifier l'authentification
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsAuthenticated(false)
        // Charger quand même l'offre pour l'afficher
        await loadJob()
        return
      }

      try {
        const userData = await authApi.me()
        if (userData.user) {
          setUser(userData.user)
          setIsAuthenticated(true)
          
          // Vérifier si l'utilisateur a déjà postulé
          const candidaturesResponse = await candidatureApi.list()
          if (candidaturesResponse.success && candidaturesResponse.data) {
            const existing = candidaturesResponse.data.find(
              (c: any) => c.offre_id === parseInt(jobId)
            )
            if (existing) {
              setAlreadyApplied(true)
            }
          }
        }
      } catch {
        setIsAuthenticated(false)
      }

      await loadJob()
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadJob = async () => {
    try {
      const data = await offreApi.get(jobId)
      setJob(data.offre || data)
    } catch (error: any) {
      console.error("Erreur lors du chargement de l'offre:", error)
      toast.error("Erreur", {
        description: "Impossible de charger l'offre.",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error("Connexion requise", {
        description: "Vous devez être connecté pour postuler.",
      })
      router.push(`/login?redirect=/jobs/${jobId}/apply`)
      return
    }

    try {
      setSubmitting(true)
      
      const response = await candidatureApi.create({
        offre_id: parseInt(jobId),
        lettre_motivation: lettreMotivation || undefined,
      })

      if (response.success) {
        setApplicationSuccess(true)
        toast.success("Candidature envoyée !", {
          description: "Votre candidature a été envoyée avec succès.",
        })
      }
    } catch (error: any) {
      console.error("Erreur lors de l'envoi:", error)
      toast.error("Erreur", {
        description: error.message || "Impossible d'envoyer votre candidature.",
      })
    } finally {
      setSubmitting(false)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement...</p>
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
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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

  // Si candidature réussie
  if (applicationSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 bg-muted/30 flex items-center justify-center py-12">
          <Card className="max-w-lg w-full mx-4 p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Candidature envoyée !</h1>
            <p className="text-muted-foreground mb-6">
              Votre candidature pour le poste de <strong>{job.titre}</strong> chez{" "}
              <strong>{job.entreprise}</strong> a été envoyée avec succès.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Vous recevrez une notification dès que le recruteur aura examiné votre profil.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/jobs">
                  Voir d'autres offres
                </Link>
              </Button>
              <Button asChild>
                <Link href="/candidate/applications">
                  Mes candidatures
                </Link>
              </Button>
            </div>
          </Card>
        </main>
        <PublicFooter />
      </div>
    )
  }

  // Si déjà postulé
  if (alreadyApplied) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 bg-muted/30 flex items-center justify-center py-12">
          <Card className="max-w-lg w-full mx-4 p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Vous avez déjà postulé</h1>
            <p className="text-muted-foreground mb-6">
              Vous avez déjà envoyé une candidature pour le poste de <strong>{job.titre}</strong> chez{" "}
              <strong>{job.entreprise}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href={`/jobs/${jobId}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à l'offre
                </Link>
              </Button>
              <Button asChild>
                <Link href="/candidate/applications">
                  Suivre ma candidature
                </Link>
              </Button>
            </div>
          </Card>
        </main>
        <PublicFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href={`/jobs/${jobId}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'offre
          </Link>

          {/* Job Summary */}
          <Card className="p-6 mb-6">
            <div className="flex gap-4 items-start">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold mb-1">{job.titre}</h1>
                <p className="text-muted-foreground font-medium">{job.entreprise}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {job.lieu}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    {job.type_contrat}
                  </span>
                  <span className="flex items-center gap-1">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    {formatTeletravail(job.teletravail)}
                  </span>
                  {formatSalary(job.salaire_min, job.salaire_max, job.devise) && (
                    <span className="flex items-center gap-1 text-secondary font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {formatSalary(job.salaire_min, job.salaire_max, job.devise)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Application Form */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Postuler à cette offre</h2>

            {!isAuthenticated ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connexion requise</h3>
                <p className="text-muted-foreground mb-6">
                  Vous devez être connecté en tant que candidat pour postuler à cette offre.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link href={`/login?redirect=/jobs/${jobId}/apply`}>
                      Se connecter
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/signup?redirect=/jobs/${jobId}/apply`}>
                      Créer un compte
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Info Summary */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Vous postulez en tant que :</p>
                  <p className="font-medium">{user?.prenom} {user?.nom}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>

                <Separator />

                {/* Motivation Letter */}
                <div className="space-y-2">
                  <Label htmlFor="motivation">
                    Lettre de motivation <span className="text-muted-foreground">(optionnelle)</span>
                  </Label>
                  <Textarea
                    id="motivation"
                    placeholder="Présentez-vous et expliquez pourquoi ce poste vous intéresse..."
                    value={lettreMotivation}
                    onChange={(e) => setLettreMotivation(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Une lettre de motivation personnalisée augmente vos chances d'être retenu.
                  </p>
                </div>

                {/* CV Info */}
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex gap-3">
                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Votre CV sera automatiquement joint
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Le recruteur aura accès à votre profil et CV renseignés sur VeriCertis.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/jobs/${jobId}`)}
                    disabled={submitting}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer ma candidature
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
