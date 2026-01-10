"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileCheck, Hash, Shield, QrCode, CheckCircle2, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { diplomeApi, profilEtudiantApi, documentApi } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"

interface Diplome {
  id: number
  nom: string
  description?: string
  code?: string
  competences?: Array<{ id: number; nom: string; categorie: string }>
}

export default function NewCertificationPage() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [diplomaSource, setDiplomaSource] = useState<"existing" | "generate" | "">("")
  const [diplomes, setDiplomes] = useState<Diplome[]>([])
  const [selectedDiplomeId, setSelectedDiplomeId] = useState<string>("")
  const [selectedDiplome, setSelectedDiplome] = useState<Diplome | null>(null)
  const [loadingDiplomes, setLoadingDiplomes] = useState(false)
  const [certificationData, setCertificationData] = useState({
    studentId: "",
    studentName: "",
    studentFirstName: "",
    degreeType: "",
    degreeTitle: "",
    graduationDate: "",
    grade: "",
    notes: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [createdDocument, setCreatedDocument] = useState<any>(null)

  // Nettoyer le localStorage au montage pour éviter les vieux documents
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("lastCertifiedDocument")
    }
  }, [])

  useEffect(() => {
    loadDiplomes()
  }, [])

  useEffect(() => {
    if (selectedDiplomeId) {
      loadDiplomeDetails(selectedDiplomeId)
    } else {
      setSelectedDiplome(null)
    }
  }, [selectedDiplomeId])

  const loadDiplomes = async () => {
    try {
      setLoadingDiplomes(true)
      const response = await diplomeApi.list({ actif: true, per_page: 100 })
      setDiplomes(response.data || [])
    } catch (error: any) {
      console.error("Erreur lors du chargement des diplômes:", error)
    } finally {
      setLoadingDiplomes(false)
    }
  }

  const loadDiplomeDetails = async (id: string) => {
    try {
      const response = await diplomeApi.get(id)
      setSelectedDiplome(response.data || response)
      // Mettre à jour automatiquement le titre du diplôme si vide
      if (!certificationData.degreeTitle && response.data?.nom) {
        setCertificationData({ ...certificationData, degreeTitle: response.data.nom })
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des détails du diplôme:", error)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      console.log("File uploaded:", selectedFile.name)
    }
  }

  const handleCertify = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
      const token = localStorage.getItem("auth_token")

      if (!token) {
        setError("Vous devez être connecté pour certifier un diplôme")
        setIsProcessing(false)
        return
      }

      // Vérifier que l'URL de l'API est correcte
      if (!API_URL || !API_URL.startsWith('http')) {
        setError("Configuration API incorrecte. Vérifiez NEXT_PUBLIC_API_URL.")
        setIsProcessing(false)
        return
      }

      // Vérification optionnelle du serveur (ne bloque pas si elle échoue)
      // On essaie quand même la requête principale même si le check échoue
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000) // Timeout de 2 secondes
        
        await fetch(`${API_URL.replace('/api/v1', '')}/up`, {
          method: 'GET',
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
      } catch (testError: any) {
        // On ignore l'erreur du check de santé et on continue quand même
        console.warn("Check de santé du serveur échoué, mais on continue:", testError)
      }

      const formData = new FormData()
      
      // Si on a un fichier existant, l'ajouter
      if (diplomaSource === "existing" && file) {
        formData.append("file", file)
      } else if (diplomaSource === "generate") {
        // Flag pour indiquer qu'on doit générer le PDF
        formData.append("generate_pdf", "true")
      }

      // Ajouter les métadonnées
      formData.append("type_document", "diplome")
      formData.append("titre", certificationData.degreeTitle || "Diplôme")
      formData.append("date_emission", certificationData.graduationDate || new Date().toISOString().split("T")[0])
      
      // Métadonnées supplémentaires (pour génération PDF ou informations complémentaires)
      const metadata = {
        student_id: certificationData.studentId,
        student_name: certificationData.studentName,
        student_first_name: certificationData.studentFirstName,
        degree_type: certificationData.degreeType,
        grade: certificationData.grade,
        notes: certificationData.notes,
        diploma_source: diplomaSource,
        diplome_id: selectedDiplomeId ? parseInt(selectedDiplomeId) : null, // Ajouter l'ID du diplôme sélectionné
      }
      formData.append("metadata", JSON.stringify(metadata))

      let response: Response
      try {
        response = await fetch(`${API_URL}/documents`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Ne pas mettre Content-Type pour FormData, le navigateur le fait automatiquement
          },
          body: formData,
        })
      } catch (networkError: any) {
        console.error("Erreur réseau:", networkError)
        setError(
          `Erreur de connexion au serveur: ${networkError.message || "Impossible de contacter le serveur. Vérifiez que le serveur Laravel est en cours d'exécution."}`
        )
        setIsProcessing(false)
        return
      }

      if (!response.ok) {
        let errorData: any = {}
        const status = response.status
        const statusText = response.statusText
        
        try {
          const contentType = response.headers.get("content-type")
          
          if (contentType && contentType.includes("application/json")) {
            errorData = await response.json()
          } else {
            const text = await response.text()
            errorData = { message: text || "Erreur serveur" }
          }
        } catch (e) {
          console.error("Erreur lors de la lecture de la réponse:", e)
          errorData = { message: "Impossible de lire la réponse du serveur" }
        }
        
        console.error("Erreur API complète:", {
          status,
          statusText,
          url: `${API_URL}/documents`,
          errorData,
        })
        
        // Construire un message d'erreur détaillé
        let errorMessage = errorData?.message || errorData?.error || `Erreur ${status}: ${statusText || "Erreur serveur"}`
        
        // Si c'est une erreur 500, ajouter plus de détails
        if (status === 500 && errorData?.error) {
          errorMessage = errorData.error
        }
        
        // Si le message contient "DomPDF", afficher un message plus clair
        if (errorMessage.includes('DomPDF') || errorMessage.includes('dompdf')) {
          errorMessage = "DomPDF n'est pas installé sur le serveur. Veuillez installer DomPDF avec: composer require dompdf/dompdf"
        }
        
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("Certification completed:", result)
      console.log("Document structure:", JSON.stringify(result.document, null, 2))
      
      // Les compétences sont maintenant liées automatiquement côté backend
      // lors de la création du document si un diplôme a été sélectionné
      
      // Stocker les infos du document pour l'étape 3
      const documentData = result.document?.data || result.document || result
      console.log("Document data:", documentData)
      console.log("Document ID:", documentData.id)
      setCreatedDocument(documentData)
      localStorage.setItem("lastCertifiedDocument", JSON.stringify(documentData))
      
      setIsProcessing(false)
      setStep(3)
    } catch (err: any) {
      console.error("Erreur de certification:", err)
      setError(err.message || "Une erreur est survenue lors de la certification")
      setIsProcessing(false)
    }
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
                  {createdDocument?.blockchain_tx_hash && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Hash blockchain</span>
                      <code className="text-xs bg-background px-3 py-1 rounded font-mono">
                        {createdDocument.blockchain_tx_hash.substring(0, 24)}...
                      </code>
                    </div>
                  )}
                  {createdDocument?.uuid_document && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">UUID du diplôme</span>
                      <code className="text-xs bg-background px-3 py-1 rounded font-mono">{createdDocument.uuid_document}</code>
                    </div>
                  )}
                  {createdDocument?.id && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">ID</span>
                      <code className="text-xs bg-background px-3 py-1 rounded font-mono">#{createdDocument.id}</code>
                    </div>
                  )}
                  {createdDocument?.statut && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Statut</span>
                      <Badge variant="default" className="bg-green-500">{createdDocument.statut}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedDiplome && selectedDiplome.competences && selectedDiplome.competences.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Compétences Certifiées</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                      Les compétences suivantes ont été automatiquement liées au profil de l'étudiant :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDiplome.competences.map((comp) => (
                        <Badge key={comp.id} variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                          {comp.nom}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center justify-center gap-3 pt-4">
                <Button variant="outline" asChild>
                  <Link href="/university/degrees">Voir tous les diplômes</Link>
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90"
                  onClick={async () => {
                    try {
                      if (typeof window === 'undefined') return
                      
                      // Utiliser le document du state d'abord, sinon localStorage
                      let doc = createdDocument
                      if (!doc) {
                        const documentStr = localStorage.getItem("lastCertifiedDocument")
                        if (!documentStr) {
                          alert("Aucun document trouvé")
                          return
                        }
                        doc = JSON.parse(documentStr)
                      }
                      
                      if (!doc?.id) {
                        alert("ID du document introuvable. Document: " + JSON.stringify(doc))
                        return
                      }
                      
                      console.log("Téléchargement du document ID:", doc.id)
                      console.log("Document complet:", doc)
                      
                      // Vérifier d'abord que le document existe
                      try {
                        await documentApi.get(doc.id)
                      } catch (checkError: any) {
                        alert(`Le document n'existe pas encore dans la base de données. Veuillez patienter quelques instants et réessayer.`)
                        console.error("Document not found:", checkError)
                        return
                      }
                      
                      // Utiliser documentApi.download pour gérer correctement le téléchargement
                      const blob = await documentApi.download(doc.id)
                      
                      // Créer un lien de téléchargement
                      const url = window.URL.createObjectURL(blob)
                      const a = window.document.createElement("a")
                      a.href = url
                      const extension = blob.type.includes("pdf") ? "pdf" : 
                                       blob.type.includes("html") ? "html" : 
                                       doc.file_url?.endsWith(".html") ? "html" : "pdf"
                      a.download = `diplome_${doc.uuid_document || doc.id}.${extension}`
                      window.document.body.appendChild(a)
                      a.click()
                      window.URL.revokeObjectURL(url)
                      window.document.body.removeChild(a)
                      
                      alert("Diplôme téléchargé avec succès !")
                    } catch (error: any) {
                      console.error("Erreur de téléchargement:", error)
                      let errorMessage = error.message || 'Erreur inconnue'
                      
                      if (errorMessage.includes('No query results')) {
                        errorMessage = "Le fichier du diplôme n'est pas encore disponible. Le système est peut-être en train de le générer. Veuillez patienter quelques instants et réessayer."
                      }
                      
                      alert(`Erreur lors du téléchargement: ${errorMessage}`)  
                    }
                  }}
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  Télécharger le diplôme
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
              <Label htmlFor="diplome">Diplôme *</Label>
              <Select
                value={selectedDiplomeId}
                onValueChange={(value) => {
                  setSelectedDiplomeId(value)
                  if (value) {
                    const diplome = diplomes.find((d) => d.id.toString() === value)
                    if (diplome) {
                      setSelectedDiplome(diplome)
                      setCertificationData({ ...certificationData, degreeTitle: diplome.nom })
                    }
                  } else {
                    setSelectedDiplome(null)
                  }
                }}
                disabled={loadingDiplomes}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingDiplomes ? "Chargement..." : "Sélectionner un diplôme"} />
                </SelectTrigger>
                <SelectContent>
                  {diplomes.map((diplome) => (
                    <SelectItem key={diplome.id} value={diplome.id.toString()}>
                      {diplome.nom} {diplome.code && `(${diplome.code})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Sélectionnez le diplôme à certifier. Les compétences associées seront automatiquement liées au profil de l'étudiant.
              </p>
              {selectedDiplome && selectedDiplome.competences && selectedDiplome.competences.length > 0 && (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Compétences qui seront certifiées :</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDiplome.competences.map((comp) => (
                      <Badge key={comp.id} variant="secondary">
                        {comp.nom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diplomaSource">Source du document *</Label>
              <Select
                value={diplomaSource}
                onValueChange={(value: "existing" | "generate") => setDiplomaSource(value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="existing">J'ai déjà le diplôme (PDF)</SelectItem>
                  <SelectItem value="generate">Diplôme à générer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {diplomaSource === "existing"
                  ? "Vous allez téléverser votre diplôme existant au format PDF"
                  : diplomaSource === "generate"
                    ? "Le système générera automatiquement le PDF du diplôme"
                    : "Choisissez si vous avez déjà un diplôme ou si vous souhaitez le générer"}
              </p>
            </div>

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
                <Label htmlFor="studentFirstName">Prénom de l'étudiant</Label>
                <Input
                  id="studentFirstName"
                  placeholder="Jean"
                  value={certificationData.studentFirstName}
                  onChange={(e) => setCertificationData({ ...certificationData, studentFirstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentName">Nom de l'étudiant</Label>
                <Input
                  id="studentName"
                  placeholder="Dupont"
                  value={certificationData.studentName}
                  onChange={(e) => setCertificationData({ ...certificationData, studentName: e.target.value })}
                />
              </div>
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
                disabled={!diplomaSource || !selectedDiplomeId}
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
              <CardTitle>
                {diplomaSource === "existing" ? "Upload du document" : "Prévisualisation du diplôme"}
              </CardTitle>
              <CardDescription>
                {diplomaSource === "existing"
                  ? "Téléversez le diplôme au format PDF pour certification"
                  : "Aperçu du diplôme qui sera généré et certifié"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {diplomaSource === "existing" ? (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                  <input type="file" id="file-upload" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">{file ? file.name : "Cliquez pour uploader un fichier"}</p>
                    <p className="text-sm text-muted-foreground">PDF uniquement, max 10MB</p>
                  </label>
                </div>
              ) : (
                <div className="border-2 border-border rounded-lg p-8 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 space-y-6">
                    {/* Header du diplôme */}
                    <div className="text-center border-b pb-6">
                      <h2 className="text-3xl font-bold mb-2">UNIVERSITÉ CHEIKH ANTA DIOP</h2>
                      <p className="text-muted-foreground">Dakar, Sénégal</p>
                    </div>

                    {/* Contenu du diplôme */}
                    <div className="space-y-4 text-center">
                      <p className="text-lg">DIPLÔME DE {certificationData.degreeType?.toUpperCase() || "MASTER"}</p>
                      <div className="py-4">
                        <p className="text-base mb-2">
                          L'Université Cheikh Anta Diop certifie que
                        </p>
                        <p className="text-xl font-bold">
                          {certificationData.studentFirstName || "Prénom"} {certificationData.studentName || "Nom"}
                        </p>
                        <p className="text-base mt-2">
                          a obtenu le diplôme de
                        </p>
                        <p className="text-lg font-semibold mt-2">
                          {certificationData.degreeTitle || "Master en Informatique"}
                        </p>
                        {certificationData.grade && (
                          <p className="text-base mt-2">
                            avec la mention : <span className="font-semibold">{certificationData.grade}</span>
                          </p>
                        )}
                        {certificationData.graduationDate && (
                          <p className="text-base mt-4">
                            Délivré le {new Date(certificationData.graduationDate).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Zone QR Code (sera ajouté après certification) */}
                    <div className="border-t pt-6 mt-6">
                      <div className="flex items-center justify-center gap-4">
                        <div className="h-24 w-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                          <QrCode className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Code QR de vérification</p>
                          <p className="text-xs">Sera généré lors de la certification</p>
                        </div>
                      </div>
                    </div>

                    {certificationData.notes && (
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm text-muted-foreground">{certificationData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(file || diplomaSource === "generate") && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <FileCheck className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {diplomaSource === "existing" ? "Document validé" : "Prévisualisation validée"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {diplomaSource === "existing" ? file?.name : "Diplôme prêt à être généré"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span>Calcul du hash SHA-256</span>
                        </div>
                        <span className="text-xs text-muted-foreground">À faire lors de la certification</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>Signature numérique (Ed25519)</span>
                        </div>
                        <span className="text-xs text-muted-foreground">À faire lors de la certification</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4 text-muted-foreground" />
                          <span>Génération QR Code</span>
                        </div>
                        <span className="text-xs text-muted-foreground">À faire lors de la certification</span>
                      </div>
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

              {error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-red-900 dark:text-red-100 mb-1">Erreur de certification</p>
                      <p className="text-red-700 dark:text-red-300">{error}</p>
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
                  disabled={(diplomaSource === "existing" && !file) || (diplomaSource === "generate" && !certificationData.degreeTitle) || isProcessing}
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