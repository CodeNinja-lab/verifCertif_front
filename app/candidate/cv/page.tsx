"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, GraduationCap, Award, Plus, Edit, Trash2, Calendar, Building2, Download, Eye } from "lucide-react"

export default function CandidateCV() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon CV</h1>
          <p className="text-muted-foreground mt-1">Créez et gérez votre curriculum vitae professionnel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Prévisualiser
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary">
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      {/* Experience Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Expérience professionnelle</h2>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-6">
          {[
            {
              title: "Développeur Full-Stack Senior",
              company: "TechSenegal Innovation", // Localized company
              location: "Dakar, Sénégal", // Localized location
              period: "Jan 2022 - Présent",
              current: true,
              description:
                "Développement et maintenance d'applications web complexes utilisant React, Node.js et MongoDB. Leadership technique d'une équipe de 5 développeurs. Mise en place de CI/CD et migration vers architecture microservices.",
              achievements: [
                "Augmentation des performances de 40% par optimisation du code",
                "Réduction du temps de déploiement de 60% avec automatisation",
                "Formation de 3 développeurs juniors",
              ],
            },
            {
              title: "Développeur Full-Stack",
              company: "Digital Solutions SN", // Localized company
              location: "Thiès, Sénégal", // Localized location
              period: "Mar 2020 - Déc 2021",
              current: false,
              description:
                "Conception et développement de solutions web sur mesure pour clients B2B. Stack: Vue.js, Express, PostgreSQL. Collaboration étroite avec équipes UX/UI.",
              achievements: [
                "Livraison de 15+ projets clients avec 98% de satisfaction",
                "Création d'une bibliothèque de composants réutilisables",
              ],
            },
          ].map((exp, idx) => (
            <div key={idx} className="relative border-l-2 border-primary/20 pl-6 pb-6 last:pb-0">
              <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary" />

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{exp.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Building2 className="h-4 w-4" />
                    <span>{exp.company}</span>
                    <span>•</span>
                    <span>{exp.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{exp.period}</span>
                    {exp.current && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Poste actuel
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mb-3">{exp.description}</p>

              <div className="space-y-2">
                <p className="text-sm font-medium">Réalisations clés:</p>
                <ul className="space-y-1">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Education Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <GraduationCap className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="text-xl font-semibold">Formation</h2>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-6">
          {[
            {
              degree: "Master en Informatique",
              school: "École Supérieure Polytechnique", // Localized school
              location: "Dakar, Sénégal", // Localized location
              period: "2017 - 2019",
              description: "Spécialisation en développement web et intelligence artificielle. Mention Très Bien.",
            },
            {
              degree: "Licence en Sciences Informatiques",
              school: "Université Cheikh Anta Diop", // Localized school
              location: "Dakar, Sénégal", // Localized location
              period: "2014 - 2017",
              description: "Formation générale en informatique et mathématiques appliquées.",
            },
          ].map((edu, idx) => (
            <div key={idx} className="relative border-l-2 border-secondary/20 pl-6 pb-6 last:pb-0">
              <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-secondary" />

              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{edu.degree}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Building2 className="h-4 w-4" />
                    <span>{edu.school}</span>
                    <span>•</span>
                    <span>{edu.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{edu.period}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground">{edu.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Certifications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Certifications & Formations</h2>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              name: "AWS Certified Solutions Architect",
              issuer: "Amazon Web Services",
              date: "Déc 2023",
              id: "AWS-SA-2023-12345",
            },
            {
              name: "Professional Scrum Master I",
              issuer: "Scrum.org",
              date: "Sep 2023",
              id: "PSM-I-2023-67890",
            },
            {
              name: "React Advanced Patterns",
              issuer: "Frontend Masters",
              date: "Jun 2023",
              id: "FM-RAP-2023",
            },
            {
              name: "Docker & Kubernetes",
              issuer: "Udemy",
              date: "Mar 2023",
              id: "UC-DK-2023",
            },
          ].map((cert, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-secondary/10 flex-shrink-0">
                <Award className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold">{cert.name}</h4>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{cert.date}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
