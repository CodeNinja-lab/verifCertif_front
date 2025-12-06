"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Award,
  FileCheck,
  TrendingUp,
  ArrowUpRight,
  GraduationCap,
  CheckCircle2,
  Clock,
  Printer,
  Key,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react" // Added Printer icon
import Link from "next/link"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

function GenerateAccessCode() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedCode(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
      const token = localStorage.getItem("auth_token")

      if (!token) {
        setError("Vous devez être connecté pour générer un code d'accès")
        setIsGenerating(false)
        return
      }

      const response = await fetch(`${API_URL}/admin-access-codes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la génération du code")
      }

      const result = await response.json()
      setGeneratedCode(result.code)
    } catch (err: any) {
      console.error("Erreur de génération:", err)
      setError(err.message || "Une erreur est survenue lors de la génération du code")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-[#009EE0] hover:bg-[#008AC0]"
        >
          {isGenerating ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              Générer un code d'accès
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedCode && (
        <div className="space-y-3">
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Code d'accès généré avec succès !</p>
                <p className="text-sm text-muted-foreground">
                  Ce code peut être utilisé une seule fois pour l'inscription d'une nouvelle université. Partagez-le de manière sécurisée.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-2">
            <Input
              value={generatedCode}
              readOnly
              className="font-mono text-lg font-bold"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function UniversityDashboardPage() {
  const stats = [
    {
      title: "Étudiants actifs",
      value: "12,847",
      change: "+12.5%",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Diplômes délivrés",
      value: "3,256",
      change: "+8.2%",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Certifications blockchain",
      value: "2,891",
      change: "+15.3%",
      icon: Award,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Vérifications",
      value: "1,423",
      change: "+24.1%",
      icon: FileCheck,
      color: "from-orange-500 to-red-500",
    },
  ]

  const recentDegrees = [
    {
      id: 1,
      student: "Sophie Martin",
      degree: "Master en Informatique",
      date: "2024-06-15",
      status: "certified",
    },
    {
      id: 2,
      student: "Thomas Dubois",
      degree: "Licence en Mathématiques",
      date: "2024-06-14",
      status: "certified",
    },
    {
      id: 3,
      student: "Marie Laurent",
      degree: "Doctorat en Physique",
      date: "2024-06-13",
      status: "pending",
    },
    {
      id: 4,
      student: "Pierre Bernard",
      degree: "Master en Économie",
      date: "2024-06-12",
      status: "certified",
    },
  ]

  const recentVerifications = [
    {
      id: 1,
      company: "Entreprise Sénégal",
      student: "Sophie Martin",
      date: "Il y a 2 heures",
      status: "verified",
    },
    {
      id: 2,
      company: "Innovation Labs",
      student: "Thomas Dubois",
      date: "Il y a 5 heures",
      status: "verified",
    },
    {
      id: 3,
      company: "Digital Solutions",
      student: "Marie Laurent",
      date: "Il y a 1 jour",
      status: "verified",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Gérez vos certifications et diplômes</p>
        </div>
        <div className="flex gap-2">
          {" "}
          {/* Added container for buttons */}
          <Button variant="outline" asChild>
            <Link href="/admin/degrees/generate">
              <Printer className="mr-2 h-4 w-4" />
              Générateur PDF
            </Link>
          </Button>
          <Button className="bg-[#009EE0] hover:bg-[#008AC0]">
            {" "}
            {/* Updated color */}
            <Award className="mr-2 h-4 w-4" />
            Nouveau diplôme
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#009EE0]/20 to-[#005580]/20 p-6 rounded-xl border border-[#009EE0]/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <Printer className="h-6 w-6 text-[#009EE0]" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Démonstration : Générateur de Diplômes Certifiés</h3>
            <p className="text-muted-foreground">
              Générez un PDF officiel de l'UCAD avec signature et hash de vérification.
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="bg-[#009EE0] hover:bg-[#008AC0]">
          <Link href="/admin/degrees/generate">Lancer le générateur</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <div
                className={`absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${stat.color} opacity-10`}
              />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">{stat.change}</span>
                  <span>ce mois-ci</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Degrees */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Diplômes récents</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/university/degrees">
                Voir tout
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDegrees.map((degree) => (
                <div
                  key={degree.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{degree.student}</p>
                      <p className="text-sm text-muted-foreground truncate">{degree.degree}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{degree.date}</span>
                    {degree.status === "certified" ? (
                      <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        Certifié
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-950 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" />
                        En attente
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Verifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vérifications récentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/university/verifications">
                Voir tout
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVerifications.map((verification) => (
                <div
                  key={verification.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{verification.company}</p>
                      <p className="text-sm text-muted-foreground truncate">Vérifié pour {verification.student}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{verification.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Access Code Section */}
      <Card className="border-[#009EE0]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#009EE0]" />
            Générer un code d'accès administrateur
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Créez un code d'accès unique pour permettre à une nouvelle université de s'inscrire. Le code expire après une seule utilisation.
          </p>
        </CardHeader>
        <CardContent>
          <GenerateAccessCode />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-auto flex-col gap-3 py-6 bg-transparent" asChild>
              <Link href="/university/students">
                <Users className="h-8 w-8 text-[#009EE0]" /> {/* Updated color */}
                <div className="text-center">
                  <div className="font-semibold">Gérer les étudiants</div>
                  <div className="text-xs text-muted-foreground">Ajouter ou modifier</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-3 py-6 bg-transparent" asChild>
              <Link href="/university/certifications">
                <Award className="h-8 w-8 text-[#009EE0]" /> {/* Updated color */}
                <div className="text-center">
                  <div className="font-semibold">Certifier un diplôme</div>
                  <div className="text-xs text-muted-foreground">Blockchain sécurisée</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-3 py-6 bg-transparent" asChild>
              <Link href="/university/verifications">
                <FileCheck className="h-8 w-8 text-[#009EE0]" /> {/* Updated color */}
                <div className="text-center">
                  <div className="font-semibold">Historique</div>
                  <div className="text-xs text-muted-foreground">Voir les vérifications</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
