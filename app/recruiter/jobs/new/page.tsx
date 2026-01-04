"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Eye, Send, Plus, X, Sparkles, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function NewJobPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [competences, setCompetences] = useState<any[]>([])
  const [skills, setSkills] = useState<number[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [benefits, setBenefits] = useState<string[]>([])
  const [newBenefit, setNewBenefit] = useState("")
  
  // Form data
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    missions_principales: "",
    profil_recherche: "",
    nice_to_have: "",
    entreprise: "",
    secteur_activite: "",
    lieu: "",
    type_contrat: "",
    duree_contrat_mois: "",
    teletravail: "",
    salaire_min: "",
    salaire_max: "",
    niveau_etudes_requis: "",
    annees_experience_min: "",
  })
  
  const [processSteps, setProcessSteps] = useState<Array<{step: number, title: string, duration: string}>>([])
  const [newProcessStep, setNewProcessStep] = useState({ title: "", duration: "" })
  const [generatingAI, setGeneratingAI] = useState<string | null>(null)

  const getSavedCompanyInfo = () => {
    if (typeof window === "undefined") return {}
    try {
      return JSON.parse(localStorage.getItem("company_info") || "{}")
    } catch {
      return {}
    }
  }

  useEffect(() => {
    loadCompetences()
    // Charger les infos d'entreprise immédiatement depuis localStorage si disponibles
    const savedInfo = getSavedCompanyInfo()
    if (savedInfo.nom_entreprise || savedInfo.secteur_activite || savedInfo.localisation) {
      setFormData((prev) => ({
        ...prev,
        entreprise: savedInfo.nom_entreprise || prev.entreprise,
        secteur_activite: savedInfo.secteur_activite || prev.secteur_activite,
        lieu: savedInfo.localisation || prev.lieu,
      }))
    }
    // Ensuite charger depuis l'API pour avoir les dernières valeurs
    prefillCompanyInfo()
  }, [])

  const loadCompetences = async () => {
    try {
      const { competenceApi } = await import("@/lib/api-client")
      const data = await competenceApi.list()
      setCompetences(data.data || data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des compétences:", error)
    }
  }

  const prefillCompanyInfo = async () => {
    try {
      const { authApi, offreApi } = await import("@/lib/api-client")
      const [userData, offresData] = await Promise.all([
        authApi.me(),
        offreApi.list({ my_offres: true, per_page: 10 }),
      ])

      const userInfo = userData.user || userData
      const savedInfo = getSavedCompanyInfo()
      const offresList = offresData?.data || []
      const firstOffre = offresList[0]

      const defaults = {
        entreprise: savedInfo.nom_entreprise || userInfo.nom_entreprise || firstOffre?.entreprise || "",
        secteur_activite: savedInfo.secteur_activite || firstOffre?.secteur_activite || "",
        lieu: savedInfo.localisation || firstOffre?.lieu || "",
      }

      // Toujours appliquer les valeurs par défaut si elles existent
      setFormData((prev) => ({
        ...prev,
        entreprise: defaults.entreprise ? defaults.entreprise : prev.entreprise,
        secteur_activite: defaults.secteur_activite ? defaults.secteur_activite : prev.secteur_activite,
        lieu: defaults.lieu ? defaults.lieu : prev.lieu,
      }))
    } catch (error) {
      console.error("Erreur lors du pré-remplissage de l'entreprise:", error)
    }
  }

  const addSkill = () => {
    const competence = competences.find((c: any) => 
      c.nom?.toLowerCase().includes(newSkill.toLowerCase()) || 
      c.nom === newSkill
    )
    if (competence && !skills.includes(competence.id)) {
      setSkills([...skills, competence.id])
      setNewSkill("")
    } else if (newSkill.trim()) {
      // Si la compétence n'existe pas, on peut l'ajouter comme texte pour l'instant
      toast({
        title: "Compétence non trouvée",
        description: "Cette compétence n'existe pas dans la base. Veuillez en sélectionner une existante.",
      })
    }
  }

  const removeSkill = (skillId: number) => {
    setSkills(skills.filter((s) => s !== skillId))
  }

  const handleSubmit = async (publish: boolean = false) => {
    // Validation côté client
    if (!formData.titre?.trim()) {
      toast({
        title: "Champ requis manquant",
        description: "Le titre du poste est obligatoire.",
        variant: "destructive",
      })
      return
    }
    if (!formData.description?.trim()) {
      toast({
        title: "Champ requis manquant",
        description: "La description est obligatoire.",
        variant: "destructive",
      })
      return
    }
    if (!formData.entreprise?.trim()) {
      toast({
        title: "Champ requis manquant",
        description: "Le nom de l'entreprise est obligatoire.",
        variant: "destructive",
      })
      return
    }
    if (!formData.lieu?.trim()) {
      toast({
        title: "Champ requis manquant",
        description: "La localisation est obligatoire.",
        variant: "destructive",
      })
      return
    }
    if (!formData.type_contrat) {
      toast({
        title: "Champ requis manquant",
        description: "Le type de contrat est obligatoire.",
        variant: "destructive",
      })
      return
    }

    // Vérifier que le type de contrat est valide
    const validTypes = ['CDI', 'CDD', 'stage', 'alternance', 'freelance', 'interim']
    const typeContratUpper = formData.type_contrat.toUpperCase()
    if (!validTypes.includes(typeContratUpper)) {
      toast({
        title: "Type de contrat invalide",
        description: `Le type de contrat doit être l'un des suivants: ${validTypes.join(', ')}`,
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const { offreApi } = await import("@/lib/api-client")
      
      // Créer l'offre
      const offreData: any = {
        titre: formData.titre.trim(),
        description: formData.description.trim(),
        entreprise: formData.entreprise.trim(),
        lieu: formData.lieu.trim(),
        type_contrat: typeContratUpper,
        devise: 'XOF',
      }

      // Champs optionnels
      if (formData.missions_principales?.trim()) {
        offreData.missions_principales = formData.missions_principales.trim()
      }
      if (formData.profil_recherche?.trim()) {
        offreData.profil_recherche = formData.profil_recherche.trim()
      }
      if (formData.nice_to_have?.trim()) {
        offreData.nice_to_have = formData.nice_to_have.trim()
      }
      if (benefits.length > 0) {
        offreData.avantages = benefits
      }
      if (processSteps.length > 0) {
        offreData.processus_recrutement = processSteps
      }
      if (formData.secteur_activite?.trim()) {
        offreData.secteur_activite = formData.secteur_activite.trim()
      }
      if (formData.duree_contrat_mois && formData.duree_contrat_mois !== '') {
        const duree = parseInt(formData.duree_contrat_mois)
        if (!isNaN(duree) && duree > 0) {
          offreData.duree_contrat_mois = duree
        }
      }
      if (formData.teletravail) {
        offreData.teletravail = formData.teletravail
      }
      if (formData.salaire_min && formData.salaire_min !== '') {
        const salaireMin = parseInt(formData.salaire_min)
        if (!isNaN(salaireMin) && salaireMin >= 0) {
          offreData.salaire_min = salaireMin
        }
      }
      if (formData.salaire_max && formData.salaire_max !== '') {
        const salaireMax = parseInt(formData.salaire_max)
        if (!isNaN(salaireMax) && salaireMax >= 0) {
          offreData.salaire_max = salaireMax
        }
      }
      if (formData.niveau_etudes_requis) {
        offreData.niveau_etudes_requis = formData.niveau_etudes_requis
      }
      if (formData.annees_experience_min && formData.annees_experience_min !== '') {
        const exp = parseInt(formData.annees_experience_min)
        if (!isNaN(exp) && exp >= 0) {
          offreData.annees_experience_min = exp
        }
      }

      console.log("Données envoyées:", offreData)

      const offre = await offreApi.create(offreData)
      
      // Ajouter les compétences
      for (const competenceId of skills) {
        try {
          await offreApi.addCompetence(offre.offre.id, competenceId)
        } catch (error) {
          console.error("Erreur lors de l'ajout de la compétence:", error)
        }
      }

      // Publier si demandé
      if (publish) {
        await offreApi.publish(offre.offre.id)
        toast({
          title: "Offre publiée",
          description: "Votre offre a été publiée avec succès.",
        })
        router.push("/recruiter")
      } else {
        toast({
          title: "Offre créée",
          description: "Votre offre a été enregistrée comme brouillon.",
        })
        router.push("/recruiter")
      }
    } catch (error: any) {
      console.error("Erreur complète:", error)
      
      let errorMessage = "Une erreur est survenue lors de la création de l'offre."
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.response) {
        // Si c'est une erreur HTTP avec réponse
        const errorData = await error.response.json().catch(() => ({}))
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.errors) {
          // Erreurs de validation Laravel
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n')
          errorMessage = `Erreurs de validation:\n${validationErrors}`
        }
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()])
      setNewBenefit("")
    }
  }

  const removeBenefit = (benefit: string) => {
    setBenefits(benefits.filter((b) => b !== benefit))
  }

  const addProcessStep = () => {
    if (newProcessStep.title.trim() && newProcessStep.duration.trim()) {
      setProcessSteps([...processSteps, { ...newProcessStep, step: processSteps.length + 1 }])
      setNewProcessStep({ title: "", duration: "" })
    }
  }

  const removeProcessStep = (index: number) => {
    setProcessSteps(processSteps.filter((_, i) => i !== index).map((step, i) => ({ ...step, step: i + 1 })))
  }

  const generateWithAI = async (type: 'description' | 'missions' | 'requirements') => {
    if (!formData.titre || !formData.entreprise || !formData.lieu) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir au moins le titre, l'entreprise et la localisation avant d'utiliser l'IA.",
        variant: "destructive",
      })
      return
    }

    try {
      setGeneratingAI(type)
      const { offreApi } = await import("@/lib/api-client")
      
      // Appeler l'endpoint backend qui utilise Gemini
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/ai/generate-job-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          type,
          jobData: {
            titre: formData.titre,
            entreprise: formData.entreprise,
            lieu: formData.lieu,
            type_contrat: formData.type_contrat,
            secteur_activite: formData.secteur_activite,
            description: formData.description,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération')
      }

      const data = await response.json()
      
      if (type === 'description') {
        setFormData({ ...formData, description: data.content || data })
      } else if (type === 'missions') {
        setFormData({ ...formData, missions_principales: data.content || data })
      } else if (type === 'requirements') {
        setFormData({ ...formData, profil_recherche: data.content || data })
      }

      toast({
        title: "Contenu généré",
        description: "Le contenu a été généré avec succès par l'IA.",
      })
    } catch (error: any) {
      console.error("Erreur lors de la génération IA:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer le contenu avec l'IA.",
        variant: "destructive",
      })
    } finally {
      setGeneratingAI(null)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Créer une nouvelle offre</h1>
          <p className="text-muted-foreground mt-1">Remplissez les détails de votre offre d'emploi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <Eye className="mr-2 h-4 w-4" />
            Prévisualiser
          </Button>
          <Button variant="outline" onClick={() => handleSubmit(false)} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Enregistrement...' : 'Enregistrer brouillon'}
          </Button>
          <Button className="bg-gradient-to-r from-secondary to-primary" onClick={() => handleSubmit(true)} disabled={loading}>
            <Send className="mr-2 h-4 w-4" />
            {loading ? 'Publication...' : 'Publier l\'offre'}
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Intitulé du poste *</Label>
            <Input 
              id="title" 
              placeholder="Ex: Développeur Full-Stack Senior"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entreprise">Entreprise *</Label>
            <Input 
              id="entreprise" 
              placeholder="Ex: Entreprise Sénégal"
              value={formData.entreprise}
              onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secteur_activite">Secteur d'activité</Label>
            <Input 
              id="secteur_activite" 
              placeholder="Ex: Technologie, Finance, Santé..."
              value={formData.secteur_activite}
              onChange={(e) => setFormData({ ...formData, secteur_activite: e.target.value })}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contract">Type de contrat *</Label>
              <Select value={formData.type_contrat} onValueChange={(value) => setFormData({ ...formData, type_contrat: value })}>
                <SelectTrigger id="contract">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                  <SelectItem value="alternance">Alternance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Années d'expérience minimum</Label>
              <Input 
                id="experience"
                type="number"
                placeholder="Ex: 3"
                value={formData.annees_experience_min}
                onChange={(e) => setFormData({ ...formData, annees_experience_min: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Localisation *</Label>
              <Input 
                id="location" 
                placeholder="Ex: Dakar, Sénégal"
                value={formData.lieu}
                onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remote">Télétravail</Label>
              <Select value={formData.teletravail} onValueChange={(value) => setFormData({ ...formData, teletravail: value })}>
                <SelectTrigger id="remote">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Full Remote</SelectItem>
                  <SelectItem value="partiel">Hybride</SelectItem>
                  <SelectItem value="non">Présentiel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Salaire minimum (FCFA/mois)</Label>
              <Input 
                id="salaryMin" 
                type="number" 
                placeholder="500000"
                value={formData.salaire_min}
                onChange={(e) => setFormData({ ...formData, salaire_min: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryMax">Salaire maximum (FCFA/mois)</Label>
              <Input 
                id="salaryMax" 
                type="number" 
                placeholder="1000000"
                value={formData.salaire_max}
                onChange={(e) => setFormData({ ...formData, salaire_max: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Job Description */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Description du poste</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description générale *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => generateWithAI('description')}
                disabled={generatingAI === 'description'}
              >
                {generatingAI === 'description' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer avec IA
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder="Décrivez le poste, l'équipe et le contexte..."
              className="min-h-[150px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Une description claire et engageante attire 60% de candidatures en plus
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="responsibilities">Missions principales</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => generateWithAI('missions')}
                disabled={generatingAI === 'missions'}
              >
                {generatingAI === 'missions' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer avec IA
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="responsibilities"
              placeholder="Listez les responsabilités clés du poste (une par ligne)..."
              className="min-h-[120px] resize-none"
              value={formData.missions_principales}
              onChange={(e) => setFormData({ ...formData, missions_principales: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="requirements">Profil recherché</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => generateWithAI('requirements')}
                disabled={generatingAI === 'requirements'}
              >
                {generatingAI === 'requirements' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer avec IA
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="requirements"
              placeholder="Compétences requises, diplômes, certifications (une par ligne)..."
              className="min-h-[120px] resize-none"
              value={formData.profil_recherche}
              onChange={(e) => setFormData({ ...formData, profil_recherche: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nice_to_have">Compétences appréciées (optionnel)</Label>
            <Textarea
              id="nice_to_have"
              placeholder="Compétences supplémentaires appréciées (une par ligne)..."
              className="min-h-[100px] resize-none"
              value={formData.nice_to_have}
              onChange={(e) => setFormData({ ...formData, nice_to_have: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Compétences techniques</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skillId) => {
              const competence = competences.find((c: any) => c.id === skillId)
              return (
                <Badge key={skillId} variant="secondary" className="text-sm px-3 py-1.5">
                  {competence?.nom || skillId}
                  <button onClick={() => removeSkill(skillId)} className="ml-2 hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher une compétence..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            />
            <Button onClick={addSkill} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {competences.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Compétences disponibles: {competences.slice(0, 5).map((c: any) => c.nom).join(", ")}...
            </div>
          )}
        </div>
      </Card>

      {/* Processus de recrutement */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Processus de recrutement</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            {processSteps.map((step, idx) => (
              <div key={idx} className="flex gap-2 items-start p-3 border border-border rounded-lg">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Titre de l'étape"
                    value={step.title}
                    onChange={(e) => {
                      const updated = [...processSteps]
                      updated[idx].title = e.target.value
                      setProcessSteps(updated)
                    }}
                    className="mb-2"
                  />
                  <Input
                    placeholder="Durée (ex: 30 min, 1h, 2-3 jours)"
                    value={step.duration}
                    onChange={(e) => {
                      const updated = [...processSteps]
                      updated[idx].duration = e.target.value
                      setProcessSteps(updated)
                    }}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeProcessStep(idx)} className="h-8 w-8">
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Titre de l'étape"
              value={newProcessStep.title}
              onChange={(e) => setNewProcessStep({ ...newProcessStep, title: e.target.value })}
            />
            <Input
              placeholder="Durée"
              value={newProcessStep.duration}
              onChange={(e) => setNewProcessStep({ ...newProcessStep, duration: e.target.value })}
            />
            <Button onClick={addProcessStep} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Benefits */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Avantages</h2>
        <div className="space-y-4">
          <div className="grid gap-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm">{benefit}</span>
                <Button variant="ghost" size="icon" onClick={() => removeBenefit(benefit)} className="h-8 w-8">
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter un avantage (ex: Télétravail flexible...)"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
            />
            <Button onClick={addBenefit} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="pt-4 border-t space-y-3">
            <p className="text-sm font-medium">Avantages standards</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "Tickets restaurant",
                "Mutuelle premium",
                "RTT",
                "Formation continue",
                "Événements d'équipe",
                "Matériel au choix",
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox id={item} />
                  <label htmlFor={item} className="text-sm cursor-pointer">
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Options */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Options de publication</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="featured" />
            <label htmlFor="featured" className="text-sm cursor-pointer">
              Mettre en avant cette offre (augmente la visibilité de 3x)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="urgent" />
            <label htmlFor="urgent" className="text-sm cursor-pointer">
              Marquer comme recrutement urgent
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="matching" />
            <label htmlFor="matching" className="text-sm cursor-pointer">
              Activer le matching IA automatique
            </label>
          </div>
        </div>
      </Card>

      {/* Submit Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={() => router.back()}>Annuler</Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit(false)}
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            Enregistrer brouillon
          </Button>
          <Button 
            className="bg-gradient-to-r from-secondary to-primary"
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            <Send className="mr-2 h-4 w-4" />
            Publier l'offre
          </Button>
        </div>
      </div>
    </div>
  )
}
