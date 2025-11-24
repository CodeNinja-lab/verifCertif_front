"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Briefcase,
  Search,
  Shield,
  CheckCircle2,
  XCircle,
  FileCheck,
  GraduationCap,
  Building2,
  Calendar,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function VerifyPage() {
  const [certId, setCertId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const handleVerify = async () => {
    setIsVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setVerificationResult({
      valid: true,
      student: {
        name: "Mamadou Diop", // Localized name
        email: "mamadou.diop@ucad.edu.sn", // Localized email
      },
      degree: {
        title: "Master en Informatique",
        type: "Master",
        date: "15 juin 2024",
        grade: "Très bien",
      },
      university: {
        name: "Université Cheikh Anta Diop", // Localized university
        location: "Dakar, Sénégal", // Localized location
      },
      blockchain: {
        hash: "a3f5e8c2d1b4f7e9c8d5a2b6f3e1d4c7",
        block: "892471",
        timestamp: "2024-06-15 14:30:22",
      },
    })

    setIsVerifying(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform group-hover:scale-105">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TalentHub Pro
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009EE0] shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Vérifier un diplôme</h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Vérifiez l'authenticité d'un diplôme grâce à la blockchain
          </p>
        </div>

        {!verificationResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Entrez l'ID de certification</CardTitle>
              <CardDescription>
                Vous pouvez trouver cet identifiant sur le diplôme ou scanner le QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="certId">ID de certification ou Hash blockchain</Label>
                <div className="relative">
                  <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="certId"
                    placeholder="CERT-2024-0123 ou a3f5e8c2d1b4f7e9..."
                    className="pl-10 h-12 font-mono"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleVerify}
                disabled={!certId || isVerifying}
                className="w-full h-12 bg-[#009EE0] hover:bg-[#008AC0] transition-opacity"
              >
                {isVerifying ? (
                  <>
                    <div className="mr-2 h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Vérification en cours...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Vérifier le diplôme
                  </>
                )}
              </Button>

              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  La vérification s'effectue directement sur la blockchain pour garantir l'authenticité et l'intégrité
                  du diplôme. Ce processus est instantané et sécurisé.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                    {verificationResult.valid ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-1">
                      Diplôme vérifié avec succès
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Ce diplôme est authentique et a été certifié sur la blockchain
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations du diplôme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">Étudiant</Label>
                      <p className="font-semibold text-lg">{verificationResult.student.name}</p>
                      <p className="text-sm text-muted-foreground">{verificationResult.student.email}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm flex items-center gap-2 mb-1">
                        <GraduationCap className="h-4 w-4" />
                        Diplôme
                      </Label>
                      <p className="font-semibold">{verificationResult.degree.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{verificationResult.degree.type}</Badge>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                          {verificationResult.degree.grade}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4" />
                        Date d'obtention
                      </Label>
                      <p className="font-medium">{verificationResult.degree.date}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-sm flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4" />
                        Établissement
                      </Label>
                      <p className="font-semibold">{verificationResult.university.name}</p>
                      <p className="text-sm text-muted-foreground">{verificationResult.university.location}</p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <Label className="text-muted-foreground text-sm">Données blockchain</Label>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hash:</span>
                          <code className="text-xs bg-background px-2 py-1 rounded">
                            {verificationResult.blockchain.hash.substring(0, 16)}...
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bloc:</span>
                          <code className="text-xs bg-background px-2 py-1 rounded">
                            #{verificationResult.blockchain.block}
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horodatage:</span>
                          <code className="text-xs bg-background px-2 py-1 rounded">
                            {verificationResult.blockchain.timestamp}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setVerificationResult(null)}>
                Vérifier un autre diplôme
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
