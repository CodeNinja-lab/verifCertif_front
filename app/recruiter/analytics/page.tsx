"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChartComponent } from "@/components/charts/area-chart-component"
import { LineChartComponent } from "@/components/charts/line-chart-component"
import { BarChartComponent } from "@/components/charts/bar-chart-component"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"
// Import dynamique pour éviter le bundling côté serveur

export default function RecruiterAnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [periode, setPeriode] = useState("30days")

  useEffect(() => {
    loadStats()
  }, [periode])

  const loadStats = async () => {
    try {
      setLoading(true)
      const { recruiterStatsApi } = await import("@/lib/api-client")
      const [dashboard, offres, candidates] = await Promise.all([
        recruiterStatsApi.dashboard({ periode: periode === "30days" ? 30 : periode === "7days" ? 7 : 90 }),
        recruiterStatsApi.offres({ periode: periode === "30days" ? 30 : periode === "7days" ? 7 : 90 }),
        recruiterStatsApi.candidates(),
      ])
      setStats({ dashboard, offres, candidates })
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
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
  // Préparer les données pour les graphiques
  const applicationsOverTimeData = stats?.offres?.evolution?.map((item: any, index: number) => {
    const date = item.date ? new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : `J${index + 1}`
    return {
      name: date,
      value: item.candidatures || item.total || 0,
    }
  }) || []

  // Si pas de données, créer un graphique vide avec un message
  if (applicationsOverTimeData.length === 0) {
    applicationsOverTimeData.push({ name: "Aucune donnée", value: 0 })
  }

  // Graphique Vues vs Candidatures par date
  const viewsVsApplicationsData = stats?.offres?.evolution?.map((item: any, index: number) => {
    const date = item.date ? new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : `J${index + 1}`
    return {
      name: date,
      vues: item.total_vues || 0,
      candidatures: item.candidatures || item.total || 0,
    }
  }) || []

  // Si pas de données d'évolution, utiliser les top offres comme alternative
  if (viewsVsApplicationsData.length === 0 && stats?.offres?.top_offres) {
    const topOffresData = stats.offres.top_offres.slice(0, 10).map((offre: any, index: number) => ({
      name: offre.titre?.substring(0, 15) + (offre.titre?.length > 15 ? '...' : '') || `Offre ${index + 1}`,
      vues: offre.vues || 0,
      candidatures: offre.candidatures || 0,
    }))
    viewsVsApplicationsData.push(...topOffresData)
  }

  if (viewsVsApplicationsData.length === 0) {
    viewsVsApplicationsData.push({ name: "Aucune donnée", vues: 0, candidatures: 0 })
  }

  const topSkillsData = stats?.candidates?.top_skills?.map((skill: any) => ({
    name: skill.nom || skill.name || "Inconnu",
    value: skill.total || skill.value || 0,
  })) || []

  if (topSkillsData.length === 0) {
    topSkillsData.push({ name: "Aucune compétence", value: 0 })
  }

  const sourceData = [
    { name: "Matching IA", value: stats?.dashboard?.candidatures_total || 0 },
    { name: "Candidatures directes", value: 0 },
  ]

  // Statistiques d'expérience dynamiques
  const experienceStats = stats?.candidates?.experience_percentages || {
    junior: 0,
    intermediaire: 0,
    senior: 0,
  }

  // Statistiques de localisation dynamiques
  const localisationStats = stats?.candidates?.localisation_stats || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Avancés</h1>
          <p className="text-muted-foreground">Analysez vos performances de recrutement en détail</p>
        </div>
        <Select value={periode} onValueChange={setPeriode}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 derniers jours</SelectItem>
            <SelectItem value="30days">30 derniers jours</SelectItem>
            <SelectItem value="90days">90 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.dashboard?.vues_total > 0 
                ? ((stats.dashboard.candidatures_total / stats.dashboard.vues_total) * 100).toFixed(1)
                : 0}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.dashboard?.performance?.delai_moyen || 0}j</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.candidates?.score_moyen || 0}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Candidats avec Intérêt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.candidates?.avec_interet || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="candidates">Candidats</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
            <CardHeader>
              <CardTitle>Candidatures Reçues</CardTitle>
              <CardDescription>Évolution sur la période sélectionnée</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {applicationsOverTimeData.length > 0 && applicationsOverTimeData[0].value > 0 ? (
                <AreaChartComponent data={applicationsOverTimeData} color="#3b82f6" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Aucune donnée disponible pour cette période
                </div>
              )}
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
              <CardTitle>Vues vs Candidatures</CardTitle>
              <CardDescription>Par offre (top 10)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {viewsVsApplicationsData.length > 0 && (viewsVsApplicationsData[0].vues > 0 || viewsVsApplicationsData[0].candidatures > 0) ? (
                <LineChartComponent
                  data={viewsVsApplicationsData}
                  lines={[
                    { key: "vues", color: "#8b5cf6", label: "Vues" },
                    { key: "candidatures", color: "#10b981", label: "Candidatures" },
                  ]}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profil des Candidats</CardTitle>
              <CardDescription>Analyse démographique et comportementale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Niveau d'Expérience</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Junior (0-2 ans)</span>
                      <span className="font-medium">{experienceStats.junior || 0}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${experienceStats.junior || 0}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Intermédiaire (3-5 ans)</span>
                      <span className="font-medium">{experienceStats.intermediaire || 0}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: `${experienceStats.intermediaire || 0}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Senior (5+ ans)</span>
                      <span className="font-medium">{experienceStats.senior || 0}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${experienceStats.senior || 0}%` }} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Localisation</h4>
                  <div className="space-y-3 text-sm">
                    {localisationStats.length > 0 ? (
                      localisationStats.map((loc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="truncate">{loc.localisation || loc.name || "Inconnu"}</span>
                          <span className="font-medium">{loc.percentage || loc.count || 0}%</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-sm">Aucune donnée disponible</div>
                    )}
                    {localisationStats.length === 0 && (
                      <div className="text-muted-foreground text-sm">Aucune localisation renseignée</div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Disponibilité</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Immédiate</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>1 mois</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>2 mois</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>3+ mois</span>
                      <span className="font-medium">-</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Données non disponibles</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compétences les Plus Demandées</CardTitle>
              <CardDescription>Top compétences présentes dans vos candidatures</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {topSkillsData.length > 0 && topSkillsData[0].value > 0 ? (
                <BarChartComponent data={topSkillsData} color="#8b5cf6" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Aucune compétence disponible
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sources de Candidatures</CardTitle>
              <CardDescription>D'où viennent vos candidats ?</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <BarChartComponent data={sourceData} color="#f59e0b" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
