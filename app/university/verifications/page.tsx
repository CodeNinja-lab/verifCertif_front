 "use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileCheck,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  Upload,
  AlertCircle,
  Search,
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

type VerificationLog = {
  id: number
  document?: {
    titre?: string
    type_document?: string
    etudiant?: {
      nom?: string
      prenom?: string
    }
  } | null
  verificateur_type?: string | null
  methode_verification?: string | null
  resultat?: string | null
  details_erreur?: string | null
  duree_ms?: number | null
  pays?: string | null
  ville?: string | null
  date_verification?: string | null
}

export default function VerificationsPage() {
  const [logs, setLogs] = useState<VerificationLog[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)
  const [logsError, setLogsError] = useState<string | null>(null)

  const [certId, setCertId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoadingLogs(true)
        setLogsError(null)

        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
        if (!token) {
          setLogsError("Vous devez être connecté pour voir l'historique des vérifications.")
          setIsLoadingLogs(false)
          return
        }

        const response = await fetch(`${API_URL}/verification-logs?per_page=20`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              `Erreur ${response.status}: ${response.statusText || "Erreur lors du chargement des vérifications"}`,
          )
        }

        setLogs(data?.data || [])
      } catch (error: any) {
        console.error("Erreur lors du chargement des logs de vérification:", error)
        setLogsError(
          error?.message || "Impossible de charger l'historique des vérifications pour le moment.",
        )
      } finally {
        setIsLoadingLogs(false)
      }
    }

    fetchLogs()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
  }

  const handleVerify = async () => {
    setVerifyError(null)

    if (!file && !certId.trim()) {
      setVerifyError("Veuillez saisir un identifiant OU téléverser le document du diplôme.")
      return
    }

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
        setVerifyError(message)
        setVerificationResult(null)
        setIsVerifying(false)
        return
      }

      setVerificationResult(data)
      setIsVerifying(false)
    } catch (err: any) {
      console.error("Erreur de vérification:", err)
      setVerifyError(
        err?.message ||
          "Erreur lors de la vérification du diplôme. Vérifiez votre connexion et réessayez.",
      )
      setIsVerifying(false)
    }
  }

  const totalVerifications = logs.length

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Historique des vérifications</h1>
        <p className="text-muted-foreground">
          Suivez et effectuez des vérifications de diplômes à partir de cette interface.
        </p>
      </div>

      {/* Bloc stats (on garde le design, chiffres basés sur les données si disponibles) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vérifications totales (page)
            </CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVerifications}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">Historique récent</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aujourd&apos;hui</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                logs.filter((log) =>
                  log.date_verification
                    ? new Date(log.date_verification).toDateString() === new Date().toDateString()
                    : false,
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nombre de vérifications enregistrées aujourd&apos;hui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Types de vérificateurs
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.from(new Set(logs.map((l) => l.verificateur_type || "public"))).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Public / recruteurs / universités</p>
          </CardContent>
        </Card>
      </div>

      {/* Bloc de vérification par identifiant ou upload (design inspiré de /verify) */}
      <Card>
        <CardHeader>
          <CardTitle>Vérifier un diplôme</CardTitle>
          <CardDescription>
            Saisissez l&apos;identifiant ou le hash du diplôme, ou téléversez directement le fichier à
            vérifier.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {verifyError && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{verifyError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="certId">ID de certification ou Hash blockchain</Label>
            <div className="relative">
              <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="certId"
                placeholder="UUID du diplôme ou hash SHA-256..."
                className="pl-10 h-11 font-mono"
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
              avec la clé publique de l&apos;université.
            </p>
          </div>

          <Button
            onClick={handleVerify}
            disabled={(!certId && !file) || isVerifying}
            className="w-full h-11 bg-[#009EE0] hover:bg-[#008AC0]"
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

          {verificationResult && (
            <div className="mt-4 border rounded-lg p-4 bg-muted/40 space-y-2">
              <div className="flex items-center gap-2">
                {verificationResult.resultat === "VALIDE" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <p className="font-semibold">
                  {verificationResult.resultat === "VALIDE"
                    ? "Diplôme vérifié avec succès"
                    : "Diplôme non valide ou erreur de vérification"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {verificationResult.message ||
                  "Résultat de la vérification de l'authenticité du diplôme."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique des vérifications (on garde le design du tableau existant) */}
      <Card>
        <CardHeader>
          <CardTitle>Vérifications récentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {logsError && (
            <div className="p-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{logsError}</AlertDescription>
              </Alert>
            </div>
          )}

          {!logsError && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vérificateur</TableHead>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Diplôme vérifié</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Résultat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingLogs ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-sm text-muted-foreground">
                      Chargement des vérifications...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-sm text-muted-foreground">
                      Aucune vérification enregistrée pour le moment.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium capitalize">
                            {log.verificateur_type || "public"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.document?.etudiant
                          ? `${log.document.etudiant.prenom ?? ""} ${
                              log.document.etudiant.nom ?? ""
                            }`.trim() || "Non renseigné"
                          : "Non renseigné"}
                      </TableCell>
                      <TableCell>{log.document?.titre ?? "Diplôme inconnu"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.date_verification
                          ? new Date(log.date_verification).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            log.resultat === "VALIDE"
                              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                          }
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          {log.resultat || "INCONNU"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
