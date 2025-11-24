"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"

const matchedJobs = [
  {
    id: 1,
    title: "Développeur Full Stack Senior",
    company: "Tech Innovate",
    location: "Paris, France",
    type: "CDI",
    salary: "55-70k",
    matchScore: 94,
    skillsMatch: 9,
    skillsTotal: 10,
    posted: "Il y a 2 jours",
    matchReasons: [
      "5+ années d'expérience en développement",
      "Compétences React et Node.js",
      "Localisation correspondante",
    ],
    missingSkills: ["GraphQL"],
  },
  {
    id: 2,
    title: "Lead Developer React",
    company: "Digital Solutions",
    location: "Lyon, France",
    type: "CDI",
    salary: "60-75k",
    matchScore: 88,
    skillsMatch: 8,
    skillsTotal: 10,
    posted: "Il y a 1 jour",
    matchReasons: ["Expertise React confirmée", "Leadership technique", "Stack moderne"],
    missingSkills: ["TypeScript", "Next.js"],
  },
  {
    id: 3,
    title: "Architecte Solutions Cloud",
    company: "Cloud Corp",
    location: "Paris, France",
    type: "CDI",
    salary: "70-90k",
    matchScore: 82,
    skillsMatch: 7,
    skillsTotal: 10,
    posted: "Il y a 3 jours",
    matchReasons: ["Expérience cloud computing", "Architecture microservices"],
    missingSkills: ["AWS", "Kubernetes", "Terraform"],
  },
]

const profileInsights = {
  completeness: 85,
  strengths: [
    { skill: "React", level: 95, demand: "Très forte" },
    { skill: "Node.js", level: 90, demand: "Très forte" },
    { skill: "TypeScript", level: 85, demand: "Forte" },
    { skill: "MongoDB", level: 80, demand: "Moyenne" },
  ],
  improvements: [
    {
      category: "Compétences techniques",
      suggestions: [
        "Ajouter GraphQL pour augmenter vos chances de 15%",
        "Certifier vos compétences AWS pour +20% de matching",
      ],
    },
    {
      category: "Expérience",
      suggestions: ["Détailler vos projets React récents", "Ajouter des métriques de performance sur vos réalisations"],
    },
    {
      category: "Profil",
      suggestions: ["Compléter votre section formations", "Ajouter votre portfolio en ligne"],
    },
  ],
}

export default function MatchingPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)

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
