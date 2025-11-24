import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Eye, Send, CheckCircle2, TrendingUp, Briefcase, Target, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export default function RecruiterDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Bienvenue chez TechCorp Innovation</p>
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
          <div className="text-2xl font-bold">12</div>
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
          <div className="text-2xl font-bold">847</div>
          <p className="text-sm text-muted-foreground">Candidatures reçues</p>
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
          <div className="text-2xl font-bold">12.4K</div>
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
          <div className="text-2xl font-bold">34</div>
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

          {[
            {
              title: "Développeur Full-Stack Senior",
              posted: "2 jours",
              applications: 42,
              views: 847,
              newApplications: 8,
              status: "active",
              progress: 75,
            },
            {
              title: "Data Scientist",
              posted: "1 semaine",
              applications: 28,
              views: 623,
              newApplications: 3,
              status: "active",
              progress: 60,
            },
            {
              title: "Product Manager",
              posted: "3 jours",
              applications: 35,
              views: 712,
              newApplications: 12,
              status: "urgent",
              progress: 45,
            },
          ].map((job, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    {job.status === "urgent" && (
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Urgent</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Publié il y a {job.posted}</p>
                </div>
                {job.newApplications > 0 && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {job.newApplications} nouvelles
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Send className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Candidatures:</span>
                  <span className="font-semibold">{job.applications}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Vues:</span>
                  <span className="font-semibold">{job.views}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taux de complétion</span>
                  <span className="font-semibold">{job.progress}%</span>
                </div>
                <Progress value={job.progress} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/recruiter/jobs/${idx + 1}`}>Voir les candidatures</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/jobs/${idx + 1}`}>Voir l'offre</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Applications & Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Candidatures récentes</h3>
            <div className="space-y-3">
              {[
                { name: "Marie Dubois", position: "Full-Stack Senior", match: 95, time: "10 min" },
                { name: "Pierre Martin", position: "Data Scientist", match: 88, time: "1h" },
                { name: "Sophie Laurent", position: "Product Manager", match: 92, time: "2h" },
              ].map((app, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {app.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">{app.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        <Target className="mr-1 h-3 w-3" />
                        {app.match}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{app.position}</p>
                    <p className="text-xs text-muted-foreground">Il y a {app.time}</p>
                  </div>
                </div>
              ))}
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
                <span className="font-semibold text-secondary">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Délai moyen</span>
                <span className="font-semibold">3.2 jours</span>
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
