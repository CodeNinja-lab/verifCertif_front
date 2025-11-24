"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Download,
  MapPin,
  Briefcase,
  GraduationCap,
  Target,
  Star,
  MessageSquare,
  Heart,
  Eye,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CandidatesPage() {
  const [showFilters, setShowFilters] = useState(true)

  const candidates = [
    {
      id: 1,
      name: "Fatou Diop", // Localized name
      title: "Développeuse Full-Stack Senior",
      location: "Dakar, Sénégal", // Localized location
      experience: "7 ans",
      education: "Master en Informatique",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      match: 95,
      salary: "800k-1.2M FCFA", // Localized currency
      available: "Immédiat",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Amadou Sow", // Localized name
      title: "Data Scientist",
      location: "Thiès, Sénégal", // Localized location
      experience: "5 ans",
      education: "Doctorat en IA",
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
      match: 92,
      salary: "700k-1M FCFA", // Localized currency
      available: "1 mois",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Aïssatou Ndiaye", // Localized name
      title: "Product Manager",
      location: "Remote",
      experience: "6 ans",
      education: "MBA",
      skills: ["Product Strategy", "Agile", "UX", "Analytics"],
      match: 88,
      salary: "600k-900k FCFA", // Localized currency
      available: "Immédiat",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Cheikh Bèye", // Localized name
      title: "DevOps Engineer",
      location: "Saint-Louis, Sénégal", // Localized location
      experience: "4 ans",
      education: "Master en Systèmes",
      skills: ["Kubernetes", "Docker", "CI/CD", "AWS"],
      match: 85,
      salary: "500k-800k FCFA", // Localized currency
      available: "2 semaines",
      rating: 4.6,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Base de candidats</h1>
          <p className="text-muted-foreground mt-1">Recherchez parmi 120,000+ profils vérifiés</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher par compétences, poste..." className="pl-10 h-12" />
          </div>
          <div className="md:col-span-4 relative">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Localisation" className="pl-10 h-12" />
          </div>
          <div className="md:col-span-3">
            <Button className="w-full h-12 bg-gradient-to-r from-secondary to-primary">
              <Search className="mr-2 h-5 w-5" />
              Rechercher
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-80 flex-shrink-0`}>
          <Card className="p-6 space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filtres</h3>
              <Button variant="ghost" size="sm">
                Réinitialiser
              </Button>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Expérience</h4>
              <div className="space-y-2">
                {["0-2 ans", "3-5 ans", "5-10 ans", "10+ ans"].map((exp) => (
                  <div key={exp} className="flex items-center space-x-2">
                    <Checkbox id={exp} />
                    <label htmlFor={exp} className="text-sm cursor-pointer">
                      {exp}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Disponibilité</h4>
              <div className="space-y-2">
                {["Immédiat", "< 1 mois", "1-3 mois", "3+ mois"].map((avail) => (
                  <div key={avail} className="flex items-center space-x-2">
                    <Checkbox id={avail} />
                    <label htmlFor={avail} className="text-sm cursor-pointer">
                      {avail}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Niveau d'études</h4>
              <div className="space-y-2">
                {["Bac+3", "Bac+5", "Doctorat"].map((edu) => (
                  <div key={edu} className="flex items-center space-x-2">
                    <Checkbox id={edu} />
                    <label htmlFor={edu} className="text-sm cursor-pointer">
                      {edu}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </aside>

        {/* Candidates List */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">1,247 candidats trouvés</h2>
              <p className="text-sm text-muted-foreground">Triés par pertinence</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="lg:hidden bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Select defaultValue="match">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Meilleur match</SelectItem>
                  <SelectItem value="experience">Expérience</SelectItem>
                  <SelectItem value="recent">Plus récent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {candidates.map((candidate) => (
            <Card key={candidate.id} className="p-6 hover:shadow-xl transition-all">
              <div className="flex gap-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-2xl font-bold flex-shrink-0">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-xl">{candidate.name}</h3>
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Target className="mr-1 h-3 w-3" />
                          {candidate.match}% match
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{candidate.rating}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground font-medium">{candidate.title}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {candidate.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      {candidate.experience} d'expérience
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      {candidate.education}
                    </span>
                    <span className="font-semibold text-secondary">{candidate.salary}</span>
                    <Badge variant="secondary" className="text-xs">
                      Dispo: {candidate.available}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-secondary to-primary">Voir le profil complet</Button>
                    <Button variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contacter
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      CV
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
