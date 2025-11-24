"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileCheck, Hash, Shield, QrCode, CheckCircle2, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function NewCertificationPage() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [certificationData, setCertificationData] = useState({
    studentId: "",
    degreeType: "",
    degreeTitle: "",
    graduationDate: "",
    grade: "",
    notes: "",
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      console.log("File uploaded:", selectedFile.name)
    }
  }

  const handleCertify = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log(" Certification completed:", certificationData)
    setIsProcessing(false)
    setStep(3)
  }

  if (step === 3) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-8">
            <div className="text-center space-y-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Diplôme certifié avec succès !</h2>
                <p className="text-muted-foreground">
                  Le diplôme a été enregistré sur la blockchain et est maintenant vérifiable publiquement.
                </p>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hash blockchain</span>
                    <code className="text-xs bg-background px-3 py-1 rounded font-mono">
                      a3f5e8c2d1b4f7e9c8d5a2b6f3e1d4c7
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ID de certification</span>
                    <code className="text-xs bg-background px-3 py-1 rounded font-mono">CERT-2024-0123</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bloc</span>
                    <code className="text-xs bg-background px-3 py-1 rounded font-mono">#892471</code>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-center gap-3 pt-4">
                <Button variant="outline" asChild>
                  <Link href="/university/degrees">Voir tous les diplômes</Link>
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90">
                  <QrCode className="mr-2 h-4 w-4" />
                  Télécharger QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certifier un nouveau diplôme</h1>
        <p className="text-muted-foreground">Créez une certification blockchain sécurisée pour un diplôme</p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 1 ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <span className={step >= 1 ? "font-medium" : "text-muted-foreground"}>Informations</span>
        </div>
        <div className="h-px w-16 bg-border" />
        <div className="flex items-center gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 2 ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <span className={step >= 2 ? "font-medium" : "text-muted-foreground"}>Document</span>
        </div>
        <div className="h-px w-16 bg-border" />
        <div className="flex items-center gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 3 ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
          <span className={step >= 3 ? "font-medium" : "text-muted-foreground"}>Confirmation</span>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informations du diplôme</CardTitle>
            <CardDescription>Renseignez les détails du diplôme à certifier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">ID Étudiant</Label>
              <Input
                id="studentId"
                placeholder="STU-2024-0001"
                value={certificationData.studentId}
                onChange={(e) => setCertificationData({ ...certificationData, studentId: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="degreeType">Type de diplôme</Label>
                <Select
                  value={certificationData.degreeType}
                  onValueChange={(value) => setCertificationData({ ...certificationData, degreeType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="licence">Licence</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="doctorat">Doctorat</SelectItem>
                    <SelectItem value="diplome">Diplôme d'ingénieur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationDate">Date d'obtention</Label>
                <Input
                  id="graduationDate"
                  type="date"
                  value={certificationData.graduationDate}
                  onChange={(e) => setCertificationData({ ...certificationData, graduationDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="degreeTitle">Intitulé du diplôme</Label>
              <Input
                id="degreeTitle"
                placeholder="Master en Informatique"
                value={certificationData.degreeTitle}
                onChange={(e) => setCertificationData({ ...certificationData, degreeTitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Mention</Label>
              <Select
                value={certificationData.grade}
                onValueChange={(value) => setCertificationData({ ...certificationData, grade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passable">Passable</SelectItem>
                  <SelectItem value="assez-bien">Assez bien</SelectItem>
                  <SelectItem value="bien">Bien</SelectItem>
                  <SelectItem value="tres-bien">Très bien</SelectItem>
                  <SelectItem value="felicitations">Félicitations du jury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes complémentaires</Label>
              <Textarea
                id="notes"
                placeholder="Informations additionnelles..."
                rows={3}
                value={certificationData.notes}
                onChange={(e) => setCertificationData({ ...certificationData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" asChild>
                <Link href="/university/degrees">Annuler</Link>
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90"
              >
                Continuer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload du document</CardTitle>
              <CardDescription>Téléversez le diplôme au format PDF pour certification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                <input type="file" id="file-upload" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">{file ? file.name : "Cliquez pour uploader un fichier"}</p>
                  <p className="text-sm text-muted-foreground">PDF uniquement, max 10MB</p>
                </label>
              </div>

              {file && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <FileCheck className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Document validé</p>
                        <p className="text-sm text-muted-foreground">{file.name}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span>Calcul du hash SHA-256</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>Signature numérique</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4 text-muted-foreground" />
                          <span>Génération QR Code</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Hash du document</p>
                      <code className="text-xs bg-background px-3 py-2 rounded block font-mono">
                        a3f5e8c2d1b4f7e9c8d5a2b6f3e1d4c7b8f9e2a5d3c6e8b1f4a7d9c2e5b8
                      </code>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Certification blockchain</p>
                        <p className="text-blue-700 dark:text-blue-300">
                          Une fois certifié, ce diplôme sera enregistré de manière permanente et immuable sur la
                          blockchain. Cette action est irréversible.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Retour
                </Button>
                <Button
                  onClick={handleCertify}
                  disabled={!file || isProcessing}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90"
                >
                  {isProcessing ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Certification en cours...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Certifier sur la blockchain
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isProcessing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Enregistrement sur la blockchain...</span>
                    <span className="text-muted-foreground">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Cette opération peut prendre quelques instants
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
