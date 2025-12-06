"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Eye, Send, CheckCircle2, TrendingUp, Briefcase, Target, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export default function RecruiterDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [offres, setOffres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // Import dynamique pour éviter le bundling côté serveur
      const { recruiterStatsApi, offreApi } = await import("@/lib/api-client")
      const [dashboardStats, offresData] = await Promise.all([
        recruiterStatsApi.dashboard(),
        offreApi.list({ my_offres: true, statut: "PUBLIEE", per_page: 3 }),
      ])
      setStats(dashboardStats)
      setOffres(offresData.data || [])
    } catch (error: any) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Bienvenue sur votre tableau de bord</p>
        </div>
        <Button className="bg-gradient-to-r from-secondary to-primary" asChild>
          <Link href="/recruiter/jobs/new">Publier une nouvelle offre</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              +3 ce mois
            </Badge>
          </div>
          <div className="text-2xl font-bold">{stats?.offres_actives || 0}</div>
          <p className="text-sm text-muted-foreground">Offres actives</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              +28%
            </Badge>
          </div>
          <div className="text-2xl font-bold">{stats?.candidatures_total || 0}</div>
          <p className="text-sm text-muted-foreground">Candidatures reçues</p>
          {stats?.candidatures_ce_mois > 0 && (
            <Badge variant="secondary" className="text-xs mt-1">
              +{stats.candidatures_ce_mois} ce mois
            </Badge>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              +15%
            </Badge>
          </div>
          <div className="text-2xl font-bold">{stats?.vues_total || 0}</div>
          <p className="text-sm text-muted-foreground">Vues profil</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-secondary/10">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              8 ce mois
            </Badge>
          </div>
          <div className="text-2xl font-bold">{stats?.recrutements_reussis || 0}</div>
          <p className="text-sm text-muted-foreground">Recrutements réussis</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Offres en cours</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/recruiter/jobs">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {offres.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Aucune offre active pour le moment
            </Card>
          ) : (
            offres.map((job: any, idx: number) => {
              const progress = job.matchings_count > 0 ? Math.min((job.matchings_count / 50) * 100, 100) : 0
              return (
            <Card key={job.id || idx} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{job.titre}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {job.date_publication || "Non publiée"}
                  </p>
                </div>
                {job.nouvelles_candidatures > 0 && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {job.nouvelles_candidatures} nouvelles
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Send className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Candidatures:</span>
                  <span className="font-semibold">{job.matchings_count || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Vues:</span>
                  <span className="font-semibold">{job.nombre_vues || 0}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taux de complétion</span>
                  <span className="font-semibold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/recruiter/matching?offre=${job.id}`}>Voir les candidatures</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/jobs/${job.id}`}>Voir l'offre</Link>
                </Button>
              </div>
            </Card>
              )
            })
          )}
        </div>

        {/* Recent Applications & Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Candidatures récentes</h3>
            <div className="space-y-3">
              {stats?.candidatures_recentes && stats.candidatures_recentes.length > 0 ? (
                stats.candidatures_recentes.map((app: any, idx: number) => (
                <div
                  key={app.id || idx}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {app.candidat?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">{app.candidat?.name || "Candidat"}</h4>
                      <Badge variant="secondary" className="text-xs">
                        <Target className="mr-1 h-3 w-3" />
                        {Math.round(app.match_score || 0)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{app.offre?.titre || ""}</p>
                    <p className="text-xs text-muted-foreground">{app.date || ""}</p>
                  </div>
                </div>
              ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune candidature récente</p>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/recruiter/candidates">Voir tous les candidats</Link>
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de réponse</span>
                <span className="font-semibold text-secondary">{stats?.performance?.taux_reponse || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Délai moyen</span>
                <span className="font-semibold">{stats?.performance?.delai_moyen || 0} jours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Satisfaction</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8/5</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-3">Actions rapides</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/recruiter/jobs/new">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Créer une offre
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/recruiter/candidates">
                  <Users className="mr-2 h-4 w-4" />
                  Rechercher candidats
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/recruiter/analytics">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Voir analytics
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
