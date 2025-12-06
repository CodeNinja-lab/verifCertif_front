import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AreaChartComponent } from "@/components/charts/area-chart-component"
import { LineChartComponent } from "@/components/charts/line-chart-component"
import { BarChartComponent } from "@/components/charts/bar-chart-component"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const usersGrowthData = [
    { name: "Jan", value: 8200 },
    { name: "Fév", value: 8900 },
    { name: "Mar", value: 9600 },
    { name: "Avr", value: 10200 },
    { name: "Mai", value: 11100 },
    { name: "Juin", value: 12345 },
  ]

  const revenueData = [
    { name: "Jan", value: 32000 },
    { name: "Fév", value: 35000 },
    { name: "Mar", value: 38000 },
    { name: "Avr", value: 40000 },
    { name: "Mai", value: 42000 },
    { name: "Juin", value: 45231 },
  ]

  const applicationsVsJobsData = [
    { name: "Jan", applications: 1800, jobs: 280 },
    { name: "Fév", applications: 2100, jobs: 320 },
    { name: "Mar", applications: 2400, jobs: 360 },
    { name: "Avr", applications: 2500, jobs: 390 },
    { name: "Mai", applications: 2700, jobs: 410 },
    { name: "Juin", applications: 2854, jobs: 423 },
  ]

  const topCitiesData = [
    { name: "Dakar", value: 3420 },
    { name: "Thiès", value: 1890 },
    { name: "Saint-Louis", value: 1560 },
    { name: "Ziguinchor", value: 1340 },
    { name: "Touba", value: 1120 },
    { name: "Kaolack", value: 890 },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h1>
          <p className="text-muted-foreground">Bienvenue sur le panneau d'administration de TalentHub.</p>
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

      <Card className="bg-[#009EE0]/10 border-[#009EE0]/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#009EE0] rounded-lg text-white">
              <Printer className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Générateur de Diplômes Certifiés</h3>
              <p className="text-muted-foreground text-sm">
                Créez des diplômes PDF officiels avec hash blockchain pour démonstration.
              </p>
            </div>
          </div>
          <Button asChild className="bg-[#009EE0] hover:bg-[#008AC0]">
            <Link href="/admin/degrees/generate">Accéder au générateur</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground flex items-center text-emerald-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              +15% ce mois
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offres Actives</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">423</div>
            <p className="text-xs text-muted-foreground flex items-center text-emerald-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              +8% ce mois
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,854</div>
            <p className="text-xs text-muted-foreground flex items-center text-emerald-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              +24% ce mois
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus (Est.)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">29.5M FCFA</div>
            <p className="text-xs text-muted-foreground flex items-center text-emerald-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="growth">Croissance</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="geography">Géographie</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Croissance des Utilisateurs</CardTitle>
                <CardDescription>Évolution du nombre total d'utilisateurs sur les 6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AreaChartComponent data={usersGrowthData} color="#3b82f6" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Candidatures vs Offres</CardTitle>
                <CardDescription>Comparaison de l'activité candidats et recruteurs</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChartComponent
                  data={applicationsVsJobsData}
                  lines={[
                    { key: "applications", color: "#10b981", label: "Candidatures" },
                    { key: "jobs", color: "#f59e0b", label: "Offres" },
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Revenus</CardTitle>
              <CardDescription>Revenus mensuels estimés en FCFA</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AreaChartComponent data={revenueData} color="#10b981" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Taux de Conversion</CardTitle>
                <CardDescription>Pourcentage de candidatures menant à un entretien</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    34.5%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <TrendingUp className="inline h-4 w-4 text-emerald-500 mr-1" />
                    +5.2% par rapport au mois dernier
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Temps Moyen de Recrutement</CardTitle>
                <CardDescription>De la publication à l'embauche</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                    18j
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <TrendingUp className="inline h-4 w-4 text-emerald-500 mr-1" />
                    -3 jours par rapport au mois dernier
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Villes</CardTitle>
                <CardDescription>Répartition des utilisateurs par ville</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <BarChartComponent data={topCitiesData} color="#8b5cf6" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Carte Interactive</CardTitle>
                <CardDescription>Distribution géographique des utilisateurs</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center space-y-2">
                    <div className="text-4xl">🗺️</div>
                    <p className="text-sm text-muted-foreground">Carte interactive Sénégal</p>
                    <p className="text-xs text-muted-foreground">Cliquez sur une région pour plus de détails</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Les dernières inscriptions et actions sur la plateforme.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Nouvelle offre publiée</p>
                    <p className="text-xs text-muted-foreground">
                      Une nouvelle offre "Senior React Developer" a été publiée
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">Il y a 2 min</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Offres à modérer</CardTitle>
            <CardDescription>5 nouvelles offres en attente de validation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "UX Designer", company: "Creative Agency", date: "Aujourd'hui" },
                { title: "Product Manager", company: "FinTech Pro", date: "Aujourd'hui" },
                { title: "Backend Engineer", company: "DataSystems", date: "Hier" },
              ].map((job, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{job.title}</span>
                    <span className="text-xs text-muted-foreground">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500 hover:text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs bg-transparent" size="sm">
                Voir toutes les offres en attente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
