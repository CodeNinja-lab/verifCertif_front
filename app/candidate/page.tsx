import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Eye,
  Send,
  Heart,
  CheckCircle2,
  Clock,
  MapPin,
  Briefcase,
  ArrowRight,
  Sparkles,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function CandidateDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bonjour, Moussa! 👋</h1>
          <p className="text-muted-foreground mt-1">Voici un aperçu de votre activité et de nouvelles opportunités</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary" asChild>
          <Link href="/candidate/recommendations">
            <Sparkles className="mr-2 h-4 w-4" />
            Voir les matchs
          </Link>
        </Button>
      </div>

      {/* Profile Completion */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Complétez votre profil</h3>
            <p className="text-sm text-muted-foreground">Un profil complet augmente vos chances de 85%</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            85%
          </Badge>
        </div>
        <Progress value={85} className="mb-4 h-2" />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/candidate/cv">Ajouter des certifications</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/candidate/profile">Ajouter une photo</Link>
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              +12%
            </Badge>
          </div>
          <div className="text-2xl font-bold">847</div>
          <p className="text-sm text-muted-foreground">Vues de profil</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Send className="h-5 w-5 text-secondary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              5 actives
            </Badge>
          </div>
          <div className="text-2xl font-bold">23</div>
          <p className="text-sm text-muted-foreground">Candidatures</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Nouveau
            </Badge>
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-sm text-muted-foreground">Matchs IA</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Heart className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <div className="text-2xl font-bold">8</div>
          <p className="text-sm text-muted-foreground">Offres favorites</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Offres recommandées pour vous</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/candidate/recommendations">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {[
            {
              title: "Développeur Full-Stack Senior",
              company: "TechSenegal Innovation",
              location: "Dakar",
              type: "CDI",
              salary: "800k-1.2M FCFA",
              match: 95,
              posted: "2 jours",
              skills: ["React", "Node.js", "TypeScript"],
            },
            {
              title: "Lead Frontend Developer",
              company: "Orange Sonatel",
              location: "Dakar (Télétravail)",
              type: "CDI",
              salary: "700k-1M FCFA",
              match: 92,
              posted: "1 semaine",
              skills: ["Vue.js", "CSS", "JavaScript"],
            },
            {
              title: "Architecte Solutions Cloud",
              company: "CloudFirst",
              location: "Remote",
              type: "CDI",
              salary: "70-90K€",
              match: 88,
              posted: "3 jours",
              skills: ["AWS", "Kubernetes", "DevOps"],
            },
          ].map((job, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                        {job.title}
                      </h3>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 flex-shrink-0">
                      <Target className="mr-1 h-3 w-3" />
                      {job.match}% match
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span>{job.type}</span>
                    <span className="font-semibold text-foreground">{job.salary}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.posted}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                      Postuler maintenant
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Application Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Candidatures récentes</h2>

          {[
            {
              company: "TechStart",
              position: "Senior Developer",
              status: "Entretien prévu",
              date: "15 Jan 2025",
              icon: CheckCircle2,
              color: "text-secondary",
            },
            {
              company: "InnovateLab",
              position: "Tech Lead",
              status: "En cours de review",
              date: "12 Jan 2025",
              icon: Clock,
              color: "text-primary",
            },
            {
              company: "DataFlow",
              position: "Full-Stack Dev",
              status: "Candidature envoyée",
              date: "10 Jan 2025",
              icon: Send,
              color: "text-muted-foreground",
            },
          ].map((app, idx) => (
            <Card key={idx} className="p-4 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-muted mt-1`}>
                  <app.icon className={`h-4 w-4 ${app.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{app.position}</h4>
                  <p className="text-sm text-muted-foreground">{app.company}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {app.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{app.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/candidate/applications">
              Voir toutes les candidatures
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
