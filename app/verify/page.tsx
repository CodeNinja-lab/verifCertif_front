"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Upload,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import Image from "next/image"

export default function VerifyPage() {
  const [certId, setCertId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
  }

  const handleVerify = async () => {
    setError(null)

    if (!file && !certId.trim()) {
      setError("Veuillez saisir un identifiant OU téléverser le document du diplôme.")
      return
    }

    // Construire la requête vers l'API de vérification publique
    try {
      const formData = new FormData()

      if (file) {
        formData.append("file", file)
      } else if (certId.trim()) {
        const value = certId.trim()
        if (value.length === 36 && value.includes("-")) {
          formData.append("uuid", value)
        } else {
          formData.append("hash_sha256", value)
        }
      }

      setIsVerifying(true)

      const response = await fetch(`${API_URL}/documents/verify`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          data?.message ||
          data?.error ||
          `Erreur ${response.status}: ${response.statusText || "Erreur de vérification"}`
        setError(message)
        setVerificationResult(null)
        setIsVerifying(false)
        return
      }

      setVerificationResult(data)
      setIsVerifying(false)
    } catch (err: any) {
      console.error("Erreur de vérification:", err)
      setError(
        err?.message ||
          "Erreur lors de la vérification du diplôme. Vérifiez votre connexion et réessayez.",
      )
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Logo href="/" size="md" />
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-block relative h-28 w-28 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/50">
            <Image
              src="/logo-acadys.png"
              alt="ACADYS Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Vérifier un diplôme</h1>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Vérifiez l'authenticité d'un diplôme grâce à la technologie blockchain
            </p>
          </div>
        </div>

        {!verificationResult ? (
          <Card className="shadow-lg border-2">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl">Vérifier un diplôme</CardTitle>
              <CardDescription className="text-base">
                Saisissez l'identifiant ou le hash du diplôme, ou téléversez directement le fichier à
                vérifier.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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

              <div className="space-y-2">
                <Label htmlFor="file">Ou téléverser le diplôme (PDF, HTML)</Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.html,application/pdf"
                      className="pl-10 h-11"
                      onChange={handleFileChange}
                    />
                  </div>
                  {file && (
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {file.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Le fichier sera analysé pour recalculer son empreinte (hash) et vérifier sa signature
                  avec la clé publique de l'université.
                </p>
              </div>

              <Button
                onClick={handleVerify}
                disabled={(!certId && !file) || isVerifying}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
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

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    La vérification s'effectue sur la base du hash cryptographique du document, de sa
                    signature numérique (Ed25519) et, lorsque disponible, de son ancrage sur la blockchain.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                      {verificationResult.resultat === "VALIDE" ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-1">
                      {verificationResult.resultat === "VALIDE"
                        ? "Diplôme vérifié avec succès"
                        : "Diplôme non valide"}
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {verificationResult.message ||
                        "Résultat de la vérification de l'authenticité du diplôme."}
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
                      <p className="font-semibold text-lg">
                        {verificationResult.document?.etudiant
                          ? `${verificationResult.document.etudiant.prenom ?? ""} ${
                              verificationResult.document.etudiant.nom ?? ""
                            }`.trim() || "Non renseigné"
                          : "Non renseigné"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {verificationResult.document?.details?.student_id ?? ""}
                      </p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm flex items-center gap-2 mb-1">
                        <GraduationCap className="h-4 w-4" />
                        Diplôme
                      </Label>
                      <p className="font-semibold">
                        {verificationResult.document?.titre ?? "Titre non renseigné"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {verificationResult.document?.type && (
                          <Badge variant="secondary">{verificationResult.document.type}</Badge>
                        )}
                        {verificationResult.document?.details?.grade && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                            {verificationResult.document.details.grade}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4" />
                        Date d'obtention
                      </Label>
                      <p className="font-medium">
                        {verificationResult.document?.date_emission ?? "Non renseignée"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-sm flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4" />
                        Établissement
                      </Label>
                      <p className="font-semibold">
                        {verificationResult.document?.administration?.nom ?? "Non renseigné"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {verificationResult.document?.administration?.type ?? ""}
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <Label className="text-muted-foreground text-sm">Données blockchain</Label>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hash:</span>
                          <code className="text-xs bg-background px-2 py-1 rounded">
                            {verificationResult.document?.hash_sha256
                              ? `${verificationResult.document.hash_sha256.substring(0, 16)}...`
                              : "N/A"}
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bloc:</span>
                          <code className="text-xs bg-background px-2 py-1 rounded">
                            {verificationResult.document?.blockchain?.tx_hash
                              ? "#on-chain"
                              : "Hors chaîne"}
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horodatage:</span>
                          <code className="text-xs bg-background px-2 py-1 rounded">
                            {verificationResult.document?.date_certification ??
                              verificationResult.verification?.date ??
                              "Non disponible"}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setVerificationResult(null)
                  setError(null)
                  setFile(null)
                  setCertId("")
                }}
              >
                Vérifier un autre diplôme
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
