"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Users, Building2, GraduationCap, ArrowRight, Check, ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"

const userTypes = [
  {
    type: "candidate",
    icon: Users,
    title: "Candidat",
    description: "Je recherche un emploi ou une opportunité professionnelle",
    benefits: [
      "Accès à des milliers d'offres",
      "CV Builder intelligent",
      "Matching IA personnalisé",
      "Alertes emploi en temps réel",
    ],
    color: "from-blue-500 to-blue-600",
  },
  {
    type: "recruiter",
    icon: Building2,
    title: "Recruteur / Entreprise",
    description: "Je recrute des talents pour mon entreprise",
    benefits: [
      "Publication d'offres illimitée",
      "Base de données de candidats",
      "Outils de tri automatique",
      "Analytics avancés",
    ],
    color: "from-blue-600 to-blue-700",
  },
  {
    type: "university",
    icon: GraduationCap,
    title: "Université / École",
    description: "Je certifie les diplômes de mes étudiants",
    benefits: ["Certification numérique", "Gestion des étudiants", "Blockchain sécurisée", "Vérification instantanée"],
    color: "from-blue-700 to-blue-800",
  },
]

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Logo href="/" size="md" />
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Créez votre compte gratuitement
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Choisissez le type de compte qui correspond à vos besoins
          </p>
        </div>

        {/* User type cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {userTypes.map((userType) => {
            const Icon = userType.icon
            return (
              <Card
                key={userType.type}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${userType.color}`} />
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${userType.color} shadow-lg`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{userType.title}</h3>
                      <p className="text-muted-foreground text-balance">{userType.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {userType.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-br ${userType.color} flex items-center justify-center mt-0.5`}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    className={`w-full h-12 bg-gradient-to-r ${userType.color} hover:opacity-90 transition-opacity text-white`}
                  >
                    <Link href={`/signup/${userType.type}`}>
                      Créer un compte {userType.title}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Already have account */}
        <p className="text-center text-muted-foreground mt-12">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Connectez-vous
          </Link>
        </p>
      </main>
    </div>
  )
}
