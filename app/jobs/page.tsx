"use client"

import { useState } from "react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, MapPin, Briefcase, Clock, Building2, Heart, Filter, X, Target, DollarSign, Home } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JobsPage() {
  const [showFilters, setShowFilters] = useState(true)
  const [salaryRange, setSalaryRange] = useState([30, 100])

  const jobs = [
    {
      id: 1,
      title: "Développeur Full-Stack Senior",
      company: "TechCorp Innovation",
      logo: "🚀",
      location: "Paris, France",
      type: "CDI",
      remote: "Hybride",
      salary: "60-75K€",
      posted: "2 jours",
      featured: true,
      urgent: false,
      match: 95,
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      description: "Rejoignez une équipe passionnée pour développer des applications web innovantes...",
    },
    {
      id: 2,
      title: "Lead Frontend Developer",
      company: "Digital Solutions",
      logo: "💡",
      location: "Lyon, France",
      type: "CDI",
      remote: "Full Remote",
      salary: "55-70K€",
      posted: "1 semaine",
      featured: false,
      urgent: true,
      match: 92,
      skills: ["Vue.js", "CSS", "JavaScript"],
      description: "Nous recherchons un Lead Frontend pour piloter nos projets web...",
    },
    {
      id: 3,
      title: "Architecte Solutions Cloud",
      company: "CloudFirst",
      logo: "☁️",
      location: "Remote",
      type: "CDI",
      remote: "Full Remote",
      salary: "70-90K€",
      posted: "3 jours",
      featured: true,
      urgent: false,
      match: 88,
      skills: ["AWS", "Kubernetes", "DevOps", "Terraform"],
      description: "Concevez et déployez des architectures cloud scalables et sécurisées...",
    },
    {
      id: 4,
      title: "Data Scientist Senior",
      company: "DataFlow Analytics",
      logo: "📊",
      location: "Paris, France",
      type: "CDI",
      remote: "Hybride",
      salary: "65-85K€",
      posted: "5 jours",
      featured: false,
      urgent: false,
      match: 85,
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      description: "Exploitez les données pour créer de la valeur business avec des modèles IA...",
    },
    {
      id: 5,
      title: "Product Manager",
      company: "InnovateLab",
      logo: "🎯",
      location: "Bordeaux, France",
      type: "CDI",
      remote: "Présentiel",
      salary: "50-65K€",
      posted: "1 semaine",
      featured: false,
      urgent: false,
      match: 78,
      skills: ["Product Strategy", "Agile", "UX"],
      description: "Pilotez le développement de produits innovants de A à Z...",
    },
    {
      id: 6,
      title: "DevOps Engineer",
      company: "StartupHub",
      logo: "⚙️",
      location: "Nantes, France",
      type: "CDI",
      remote: "Hybride",
      salary: "45-60K€",
      posted: "4 jours",
      featured: false,
      urgent: true,
      match: 82,
      skills: ["Docker", "Kubernetes", "CI/CD", "Azure"],
      description: "Automatisez et optimisez notre infrastructure cloud...",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Search Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-3">Trouvez votre prochain emploi</h1>
              <p className="text-lg text-muted-foreground">Plus de 50,000 offres d'emploi vous attendent</p>
            </div>

            {/* Search Bar */}
            <Card className="p-4">
              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Poste, mots-clés..." className="pl-10 h-12" />
                </div>
                <div className="md:col-span-4 relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Ville, région..." className="pl-10 h-12" />
                </div>
                <div className="md:col-span-3">
                  <Button className="w-full h-12 bg-gradient-to-r from-primary to-secondary">
                    <Search className="mr-2 h-5 w-5" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">1,247</span> nouvelles offres cette semaine
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">3,842</span> entreprises recrutent
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-80 flex-shrink-0`}>
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center justify-between lg:hidden mb-4">
                  <h2 className="text-xl font-bold">Filtres</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <Card className="p-6 space-y-6">
                  {/* Contract Type */}
                  <div>
                    <h3 className="font-semibold mb-3">Type de contrat</h3>
                    <div className="space-y-2">
                      {["CDI", "CDD", "Freelance", "Stage", "Alternance"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={type} />
                          <label htmlFor={type} className="text-sm cursor-pointer">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Remote Work */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Télétravail</h3>
                    <div className="space-y-2">
                      {["Full Remote", "Hybride", "Présentiel"].map((remote) => (
                        <div key={remote} className="flex items-center space-x-2">
                          <Checkbox id={remote} />
                          <label htmlFor={remote} className="text-sm cursor-pointer">
                            {remote}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Salaire annuel</h3>
                    <div className="space-y-4">
                      <Slider
                        value={salaryRange}
                        onValueChange={setSalaryRange}
                        min={20}
                        max={150}
                        step={5}
                        className="mb-2"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{salaryRange[0]}K€</span>
                        <span className="text-muted-foreground">{salaryRange[1]}K€</span>
                      </div>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Niveau d'expérience</h3>
                    <div className="space-y-2">
                      {["Junior (0-2 ans)", "Confirmé (3-5 ans)", "Senior (5+ ans)", "Expert (10+ ans)"].map(
                        (level) => (
                          <div key={level} className="flex items-center space-x-2">
                            <Checkbox id={level} />
                            <label htmlFor={level} className="text-sm cursor-pointer">
                              {level}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Posted Date */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Date de publication</h3>
                    <div className="space-y-2">
                      {["Dernières 24h", "Dernière semaine", "Dernier mois", "Tout"].map((date) => (
                        <div key={date} className="flex items-center space-x-2">
                          <Checkbox id={date} />
                          <label htmlFor={date} className="text-sm cursor-pointer">
                            {date}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Réinitialiser les filtres
                  </Button>
                </Card>
              </div>
            </aside>

            {/* Jobs List */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">8,234 offres trouvées</h2>
                  <p className="text-sm text-muted-foreground">Mises à jour en temps réel</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="lg:hidden bg-transparent" onClick={() => setShowFilters(true)}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres
                  </Button>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Plus pertinent</SelectItem>
                      <SelectItem value="recent">Plus récent</SelectItem>
                      <SelectItem value="salary">Salaire décroissant</SelectItem>
                      <SelectItem value="match">Meilleur match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job Cards */}
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  >
                    {job.featured && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-secondary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-bl-lg">
                        En vedette
                      </div>
                    )}

                    <div className="flex gap-6">
                      {/* Company Logo */}
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl flex-shrink-0">
                        {job.logo}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <Link href={`/jobs/${job.id}`}>
                              <h3 className="font-bold text-xl group-hover:text-primary transition-colors truncate">
                                {job.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground font-medium">{job.company}</span>
                              {job.match && (
                                <Badge className="bg-primary/10 text-primary border-primary/20 ml-2">
                                  <Target className="mr-1 h-3 w-3" />
                                  {job.match}% match
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 hover:text-destructive transition-colors"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Job Details */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Home className="h-4 w-4" />
                            {job.remote}
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold text-foreground">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {job.posted}
                          </span>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.urgent && (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                              Recrutement urgent
                            </Badge>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{job.description}</p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button className="bg-gradient-to-r from-primary to-secondary" asChild>
                            <Link href={`/jobs/${job.id}`}>Voir les détails</Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link href={`/jobs/${job.id}/apply`}>Postuler rapidement</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" disabled>
                  Précédent
                </Button>
                <Button variant="outline" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <span className="px-2">...</span>
                <Button variant="outline">10</Button>
                <Button variant="outline">Suivant</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
