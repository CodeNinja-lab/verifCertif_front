"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Star,
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Brain,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { matchingApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface MatchedJob {
  offre: {
    id: number
    titre: string
    entreprise: string
    lieu: string
    type_contrat: string
    salaire_min?: number
    salaire_max?: number
    devise?: string
    date_publication: string
    offreCompetences?: Array<{
      competence: {
        id: number
        nom: string
      }
      niveau_requis: string
      importance: string
    }>
  }
  ai_score: number
  title: string
}

export default function MatchingPage() {
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchMatchings = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const response = await matchingApi.list({
        min_score: 50, // Score minimum de 50%
      })

      setMatchedJobs(response.data || [])
    } catch (error: any) {
      console.error("Erreur lors du chargement des matchings:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les recommandations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMatchings()
  }, [])

  const formatSalary = (offre: MatchedJob["offre"]) => {
    if (!offre.salaire_min && !offre.salaire_max) return "Non spécifié"
    const devise = offre.devise || "FCFA"
    if (offre.salaire_min && offre.salaire_max) {
      return `${(offre.salaire_min / 1000).toFixed(0)}k-${(offre.salaire_max / 1000).toFixed(0)}k ${devise}`
    }
    if (offre.salaire_min) {
      return `À partir de ${(offre.salaire_min / 1000).toFixed(0)}k ${devise}`
    }
    return `Jusqu'à ${(offre.salaire_max! / 1000).toFixed(0)}k ${devise}`
  }

  const formatPostedDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`
    return `Il y a ${Math.ceil(diffDays / 30)} mois`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-orange-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent match", variant: "default" as const }
    if (score >= 75) return { label: "Bon match", variant: "secondary" as const }
    if (score >= 60) return { label: "Match potentiel", variant: "outline" as const }
    return { label: "À considérer", variant: "outline" as const }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Analyse de votre profil en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Matching IA
          </h1>
          <p className="text-muted-foreground">
            Offres recommandées par intelligence artificielle • Modèle: all-MiniLM-L6-v2
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          onClick={() => fetchMatchings(true)}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualisation...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Actualiser les recommandations
            </>
          )}
        </Button>
      </div>

      {matchedJobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Aucune recommandation disponible</h3>
              <p className="text-muted-foreground mt-2">
                Complétez votre profil et ajoutez des compétences pour recevoir des recommandations personnalisées.
              </p>
            </div>
            <Button asChild>
              <Link href="/candidate/profile">
                Compléter mon profil
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {matchedJobs.length} offre{matchedJobs.length > 1 ? "s" : ""} compatible{matchedJobs.length > 1 ? "s" : ""} trouvée{matchedJobs.length > 1 ? "s" : ""}
            </p>
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="h-3 w-3" />
              Powered by AI
            </Badge>
          </div>

          {matchedJobs.map((job) => {
            const scoreBadge = getScoreBadge(job.ai_score)
            const competences = job.offre.offreCompetences || []

            return (
              <Card
                key={job.offre.id}
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50"
                onClick={() => setSelectedJob(job.offre.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{job.offre.titre}</h3>
                          <p className="text-muted-foreground">{job.offre.entreprise || "Entreprise non spécifiée"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getScoreColor(job.ai_score)}`}>
                              {Math.round(job.ai_score)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Compatibilité</div>
                          </div>
                          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant={scoreBadge.variant}>{scoreBadge.label}</Badge>
                        {job.offre.lieu && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.offre.lieu}
                          </Badge>
                        )}
                        {job.offre.type_contrat && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.offre.type_contrat}
                          </Badge>
                        )}
                        <Badge variant="secondary">{formatSalary(job.offre)}</Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatPostedDate(job.offre.date_publication)}
                        </Badge>
                      </div>

                      {competences.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Compétences requises</p>
                          <div className="flex flex-wrap gap-2">
                            {competences.slice(0, 5).map((comp) => (
                              <Badge key={comp.competence.id} variant="outline" className="text-xs">
                                {comp.competence.nom}
                                {comp.importance === "indispensable" && " ★"}
                              </Badge>
                            ))}
                            {competences.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{competences.length - 5} autres
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Recommandé par l'IA
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Cette offre correspond à votre profil selon notre modèle d'embeddings vectoriels
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button asChild className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      <Link href={`/jobs/${job.offre.id}`}>
                        Voir l'offre
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline">Enregistrer</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Matching IA
          </h1>
          <p className="text-muted-foreground">Découvrez les offres qui correspondent le mieux à votre profil</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Brain className="mr-2 h-4 w-4" />
          Actualiser les recommandations
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Score de profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-3">
              <div className="relative inline-flex">
                <svg className="h-32 w-32 transform -rotate-90">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - profileInsights.completeness / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{profileInsights.completeness}%</span>
                </div>
              </div>
              <div>
                <p className="font-semibold">Profil optimisé</p>
                <p className="text-sm text-muted-foreground">Complétez votre profil pour obtenir plus de matchs</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Vos points forts</h4>
              {profileInsights.strengths.map((strength, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{strength.skill}</span>
                    <Badge variant="secondary" className="text-xs">
                      {strength.demand}
                    </Badge>
                  </div>
                  <Progress value={strength.level} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="matches">
                <Zap className="mr-2 h-4 w-4" />
                Matchs ({matchedJobs.length})
              </TabsTrigger>
              <TabsTrigger value="insights">
                <TrendingUp className="mr-2 h-4 w-4" />
                Améliorations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="space-y-4 mt-6">
              {matchedJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50"
                  onClick={() => setSelectedJob(job.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                            <p className="text-muted-foreground">{job.company}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {job.matchScore}%
                              </div>
                              <div className="text-xs text-muted-foreground">Match</div>
                            </div>
                            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.type}
                          </Badge>
                          <Badge variant="secondary">{job.salary}</Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.posted}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Compétences correspondantes</span>
                            <span className="font-medium">
                              {job.skillsMatch}/{job.skillsTotal}
                            </span>
                          </div>
                          <Progress value={(job.skillsMatch / job.skillsTotal) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Pourquoi ce match ?</p>
                          <ul className="space-y-1">
                            {job.matchReasons.map((reason, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {job.missingSkills.length > 0 && (
                          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                            <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-1 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Compétences à développer
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {job.missingSkills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button asChild className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                        <Link href={`/jobs/${job.id}`}>
                          Voir l'offre
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline">Enregistrer</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Optimisez votre profil</CardTitle>
                  <CardDescription>Suivez ces recommandations pour augmenter vos chances de matching</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileInsights.improvements.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        {category.category}
                      </h4>
                      <ul className="space-y-2">
                        {category.suggestions.map((suggestion, sIndex) => (
                          <li
                            key={sIndex}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <Button className="w-full" asChild>
                    <Link href="/candidate/profile">
                      Améliorer mon profil maintenant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
