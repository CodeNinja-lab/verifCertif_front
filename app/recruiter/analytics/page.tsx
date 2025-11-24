import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChartComponent } from "@/components/charts/area-chart-component"
import { LineChartComponent } from "@/components/charts/line-chart-component"
import { BarChartComponent } from "@/components/charts/bar-chart-component"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"

export default function RecruiterAnalyticsPage() {
  const applicationsOverTimeData = [
    { name: "Sem 1", value: 45 },
    { name: "Sem 2", value: 62 },
    { name: "Sem 3", value: 78 },
    { name: "Sem 4", value: 95 },
    { name: "Sem 5", value: 112 },
    { name: "Sem 6", value: 134 },
  ]

  const viewsVsApplicationsData = [
    { name: "Jan", vues: 1200, candidatures: 48 },
    { name: "Fév", vues: 1450, candidatures: 62 },
    { name: "Mar", vues: 1680, candidatures: 78 },
    { name: "Avr", vues: 1890, candidatures: 95 },
    { name: "Mai", vues: 2100, candidatures: 112 },
    { name: "Juin", vues: 2340, candidatures: 134 },
  ]

  const topSkillsData = [
    { name: "React", value: 145 },
    { name: "Node.js", value: 128 },
    { name: "TypeScript", value: 112 },
    { name: "Python", value: 98 },
    { name: "AWS", value: 87 },
    { name: "Docker", value: 76 },
  ]

  const sourceData = [
    { name: "LinkedIn", value: 340 },
    { name: "Site carrière", value: 256 },
    { name: "Indeed", value: 178 },
    { name: "Recommandations", value: 145 },
    { name: "Glassdoor", value: 89 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Avancés</h1>
          <p className="text-muted-foreground">Analysez vos performances de recrutement en détail</p>
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 derniers jours</SelectItem>
            <SelectItem value="30days">30 derniers jours</SelectItem>
            <SelectItem value="90days">90 derniers jours</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.7%</div>
            <p className="text-xs text-emerald-500 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +0.8% ce mois
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2j</div>
            <p className="text-xs text-emerald-500 flex items-center">
              <TrendingDown className="mr-1 h-3 w-3" />
              -0.5j ce mois
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Qualité Candidats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.4/10</div>
            <p className="text-xs text-emerald-500 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +0.3 ce mois
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coût par Embauche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240€</div>
            <p className="text-xs text-emerald-500 flex items-center">
              <TrendingDown className="mr-1 h-3 w-3" />
              -180€ ce mois
            </p>
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
                <CardDescription>Évolution hebdomadaire</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AreaChartComponent data={applicationsOverTimeData} color="#3b82f6" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vues vs Candidatures</CardTitle>
                <CardDescription>Comparaison mensuelle</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChartComponent
                  data={viewsVsApplicationsData}
                  lines={[
                    { key: "vues", color: "#8b5cf6", label: "Vues" },
                    { key: "candidatures", color: "#10b981", label: "Candidatures" },
                  ]}
                />
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
                      <span>Junior</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary w-[28%]" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Intermédiaire</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-secondary w-[45%]" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Senior</span>
                      <span className="font-medium">27%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[27%]" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Localisation</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Île-de-France</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auvergne-Rhône-Alpes</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Occitanie</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Nouvelle-Aquitaine</span>
                      <span className="font-medium">11%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Autres</span>
                      <span className="font-medium">17%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Disponibilité</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Immédiate</span>
                      <span className="font-medium">34%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>1 mois</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>2 mois</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>3+ mois</span>
                      <span className="font-medium">6%</span>
                    </div>
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
              <BarChartComponent data={topSkillsData} color="#8b5cf6" />
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
