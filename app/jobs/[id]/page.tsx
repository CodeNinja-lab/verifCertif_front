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
} from "lucide-react"
import Link from "next/link"

export default function JobDetailPage() {
  const job = {
    id: 1,
    title: "Développeur Full-Stack Senior",
    company: "TechCorp Innovation",
    logo: "🚀",
    location: "Paris, France",
    type: "CDI",
    remote: "Hybride",
    salary: "60-75K€",
    posted: "2 jours",
    applications: 42,
    views: 847,
    match: 95,
    featured: true,
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
    benefits: [
      "Télétravail flexible (2-3 jours/semaine)",
      "Tickets restaurant (12€/jour)",
      "Mutuelle premium",
      "RTT (12 jours/an)",
      "Budget formation (2000€/an)",
      "Matériel au choix (Mac/PC)",
      "Événements d'équipe réguliers",
      "Plan d'actionnariat",
    ],
    description: `TechCorp Innovation est une scale-up tech en forte croissance spécialisée dans le développement de solutions SaaS innovantes pour les entreprises. Nous accompagnons plus de 500 clients à travers l'Europe.

Nous recherchons un(e) Développeur Full-Stack Senior passionné(e) pour rejoindre notre équipe produit et contribuer à l'évolution de notre plateforme.`,
    responsibilities: [
      "Développer de nouvelles fonctionnalités de bout en bout (frontend & backend)",
      "Participer à l'architecture technique et aux choix technologiques",
      "Assurer la qualité du code via code reviews et tests",
      "Mentorer les développeurs juniors de l'équipe",
      "Optimiser les performances et la scalabilité de nos applications",
      "Collaborer étroitement avec les équipes produit, design et QA",
    ],
    requirements: [
      "5+ ans d'expérience en développement Full-Stack",
      "Expertise solide en React et Node.js",
      "Maîtrise de TypeScript",
      "Expérience avec AWS ou autre cloud provider",
      "Connaissance des bases de données SQL et NoSQL",
      "Pratique des méthodologies Agile/Scrum",
      "Excellentes capacités de communication",
      "Anglais professionnel (niveau B2 minimum)",
    ],
    niceToHave: [
      "Expérience avec Kubernetes et Docker",
      "Connaissance de l'architecture microservices",
      "Contribution à des projets open source",
      "Certifications AWS ou équivalent",
    ],
    process: [
      { step: 1, title: "Candidature", duration: "1 jour" },
      { step: 2, title: "Entretien RH", duration: "30 min" },
      { step: 3, title: "Test technique", duration: "2-3h" },
      { step: 4, title: "Entretien technique", duration: "1h" },
      { step: 5, title: "Rencontre équipe", duration: "45 min" },
      { step: 6, title: "Offre", duration: "2-3 jours" },
    ],
  }

  const similarJobs = [
    { title: "Lead Frontend Developer", company: "Digital Solutions", salary: "55-70K€", match: 92 },
    { title: "Backend Developer Senior", company: "DataFlow", salary: "58-72K€", match: 90 },
    { title: "Tech Lead Full-Stack", company: "InnovateLab", salary: "65-80K€", match: 88 },
  ]

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
                {job.logo}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">{job.title}</h1>
                    <div className="flex items-center gap-3 text-lg">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{job.company}</span>
                      {job.match && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Target className="mr-1 h-3 w-3" />
                          {job.match}% match avec votre profil
                        </Badge>
                      )}
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
                    <span className="font-medium">{job.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{job.type}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{job.remote}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-secondary" />
                    <span className="font-semibold text-secondary">{job.salary}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Publié il y a {job.posted}</span>
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-lg" asChild>
                    <Link href={`/jobs/${job.id}/apply`}>Postuler maintenant</Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    Contacter le recruteur
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
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Missions principales</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Requirements */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Profil recherché</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Compétences requises</h3>
                    <ul className="space-y-2">
                      {job.requirements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Nice to have</h3>
                    <ul className="space-y-2">
                      {job.niceToHave.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="h-5 w-5 rounded-full border-2 border-primary/30 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Skills */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Technologies utilisées</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm px-3 py-1.5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Process */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Processus de recrutement</h2>
                <p className="text-muted-foreground mb-6">Durée totale estimée : 2-3 semaines</p>
                <div className="space-y-4">
                  {job.process.map((step) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {step.step}
                        </div>
                        {step.step < job.process.length && (
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
                    <span className="font-semibold">{job.applications}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Vues</span>
                    </div>
                    <span className="font-semibold">{job.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Publié</span>
                    </div>
                    <span className="font-semibold">Il y a {job.posted}</span>
                  </div>
                </div>
              </Card>

              {/* Benefits */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Avantages</h3>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* CTA */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <h3 className="font-semibold mb-2">Intéressé(e) ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Postulez dès maintenant et rejoignez une équipe passionnée !
                </p>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary" size="lg" asChild>
                  <Link href={`/jobs/${job.id}/apply`}>Postuler</Link>
                </Button>
              </Card>

              {/* Similar Jobs */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Offres similaires</h3>
                <div className="space-y-3">
                  {similarJobs.map((similar, idx) => (
                    <Link key={idx} href={`/jobs/${idx + 2}`}>
                      <div className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-sm mb-1 hover:text-primary transition-colors">
                          {similar.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">{similar.company}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{similar.salary}</span>
                          <Badge variant="secondary" className="text-xs">
                            {similar.match}% match
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
