"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase, GraduationCap, Award, Plus, Edit, Trash2, Calendar, Building2, Download, Eye, Loader2, X, Save } from "lucide-react"
import { cvApi, profilEtudiantApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Experience {
  id: number
  titre: string
  entreprise: string
  localisation: string | null
  date_debut: string
  date_fin: string | null
  poste_actuel: boolean
  description: string | null
  realisations: string[]
}

interface Formation {
  id: number
  diplome: string
  etablissement: string
  localisation: string | null
  date_debut: string
  date_fin: string | null
  en_cours: boolean
  description: string | null
}

interface Certification {
  id: number
  nom: string
  organisme: string
  date_obtention: string
  date_expiration: string | null
  identifiant: string | null
  url_verification: string | null
}

interface Competence {
  competence_id: number
  niveau: string | null
  source: string
  source_document_id: number | null
  annees_experience: number | null
  competence?: {
    id: number
    nom: string
    categorie: string
  }
}

export default function CandidateCV() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Data
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [formations, setFormations] = useState<Formation[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [competences, setCompetences] = useState<Competence[]>([])
  
  // Dialog states
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false)
  const [formationDialogOpen, setFormationDialogOpen] = useState(false)
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false)
  
  // Edit mode
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  
  // Form fields - Experience
  const [expTitre, setExpTitre] = useState("")
  const [expEntreprise, setExpEntreprise] = useState("")
  const [expLocalisation, setExpLocalisation] = useState("")
  const [expDateDebut, setExpDateDebut] = useState("")
  const [expDateFin, setExpDateFin] = useState("")
  const [expPosteActuel, setExpPosteActuel] = useState(false)
  const [expDescription, setExpDescription] = useState("")
  const [expRealisations, setExpRealisations] = useState("")
  
  // Form fields - Formation
  const [formDiplome, setFormDiplome] = useState("")
  const [formEtablissement, setFormEtablissement] = useState("")
  const [formLocalisation, setFormLocalisation] = useState("")
  const [formDateDebut, setFormDateDebut] = useState("")
  const [formDateFin, setFormDateFin] = useState("")
  const [formEnCours, setFormEnCours] = useState(false)
  const [formDescription, setFormDescription] = useState("")
  
  // Form fields - Certification
  const [certNom, setCertNom] = useState("")
  const [certOrganisme, setCertOrganisme] = useState("")
  const [certDateObtention, setCertDateObtention] = useState("")
  const [certIdentifiant, setCertIdentifiant] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await cvApi.getAll()
      setExperiences(response.experiences || [])
      setFormations(response.formations || [])
      setCertifications(response.certifications || [])
      
      // Charger aussi les compétences depuis le profil
      try {
        const competencesResponse = await profilEtudiantApi.getCompetences()
        setCompetences(competencesResponse.data || [])
      } catch {
        setCompetences([])
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du CV",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // ========== EXPERIENCE HANDLERS ==========
  
  const openExperienceDialog = (exp?: Experience) => {
    if (exp) {
      setEditingExperience(exp)
      setExpTitre(exp.titre)
      setExpEntreprise(exp.entreprise)
      setExpLocalisation(exp.localisation || "")
      setExpDateDebut(exp.date_debut)
      setExpDateFin(exp.date_fin || "")
      setExpPosteActuel(exp.poste_actuel)
      setExpDescription(exp.description || "")
      setExpRealisations(exp.realisations?.join("\n") || "")
    } else {
      setEditingExperience(null)
      setExpTitre("")
      setExpEntreprise("")
      setExpLocalisation("")
      setExpDateDebut("")
      setExpDateFin("")
      setExpPosteActuel(false)
      setExpDescription("")
      setExpRealisations("")
    }
    setExperienceDialogOpen(true)
  }

  const saveExperience = async () => {
    try {
      setSaving(true)
      const data = {
        titre: expTitre,
        entreprise: expEntreprise,
        localisation: expLocalisation || undefined,
        date_debut: expDateDebut,
        date_fin: expPosteActuel ? undefined : expDateFin || undefined,
        poste_actuel: expPosteActuel,
        description: expDescription || undefined,
        realisations: expRealisations ? expRealisations.split("\n").filter(r => r.trim()) : undefined,
      }

      if (editingExperience) {
        await cvApi.updateExperience(editingExperience.id, data)
        toast({ title: "Succès", description: "Expérience mise à jour" })
      } else {
        await cvApi.createExperience(data)
        toast({ title: "Succès", description: "Expérience ajoutée" })
      }
      
      setExperienceDialogOpen(false)
      loadData()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder l'expérience",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteExperience = async (id: number) => {
    try {
      await cvApi.deleteExperience(id)
      toast({ title: "Succès", description: "Expérience supprimée" })
      loadData()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'expérience",
        variant: "destructive",
      })
    }
  }

  // ========== FORMATION HANDLERS ==========
  
  const openFormationDialog = (form?: Formation) => {
    if (form) {
      setEditingFormation(form)
      setFormDiplome(form.diplome)
      setFormEtablissement(form.etablissement)
      setFormLocalisation(form.localisation || "")
      setFormDateDebut(form.date_debut)
      setFormDateFin(form.date_fin || "")
      setFormEnCours(form.en_cours)
      setFormDescription(form.description || "")
    } else {
      setEditingFormation(null)
      setFormDiplome("")
      setFormEtablissement("")
      setFormLocalisation("")
      setFormDateDebut("")
      setFormDateFin("")
      setFormEnCours(false)
      setFormDescription("")
    }
    setFormationDialogOpen(true)
  }

  const saveFormation = async () => {
    try {
      setSaving(true)
      const data = {
        diplome: formDiplome,
        etablissement: formEtablissement,
        localisation: formLocalisation || undefined,
        date_debut: formDateDebut,
        date_fin: formEnCours ? undefined : formDateFin || undefined,
        en_cours: formEnCours,
        description: formDescription || undefined,
      }

      if (editingFormation) {
        await cvApi.updateFormation(editingFormation.id, data)
        toast({ title: "Succès", description: "Formation mise à jour" })
      } else {
        await cvApi.createFormation(data)
        toast({ title: "Succès", description: "Formation ajoutée" })
      }
      
      setFormationDialogOpen(false)
      loadData()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder la formation",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteFormation = async (id: number) => {
    try {
      await cvApi.deleteFormation(id)
      toast({ title: "Succès", description: "Formation supprimée" })
      loadData()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la formation",
        variant: "destructive",
      })
    }
  }

  // ========== CERTIFICATION HANDLERS ==========
  
  const openCertificationDialog = (cert?: Certification) => {
    if (cert) {
      setEditingCertification(cert)
      setCertNom(cert.nom)
      setCertOrganisme(cert.organisme)
      setCertDateObtention(cert.date_obtention)
      setCertIdentifiant(cert.identifiant || "")
    } else {
      setEditingCertification(null)
      setCertNom("")
      setCertOrganisme("")
      setCertDateObtention("")
      setCertIdentifiant("")
    }
    setCertificationDialogOpen(true)
  }

  const saveCertification = async () => {
    try {
      setSaving(true)
      const data = {
        nom: certNom,
        organisme: certOrganisme,
        date_obtention: certDateObtention,
        identifiant: certIdentifiant || undefined,
      }

      if (editingCertification) {
        await cvApi.updateCertification(editingCertification.id, data)
        toast({ title: "Succès", description: "Certification mise à jour" })
      } else {
        await cvApi.createCertification(data)
        toast({ title: "Succès", description: "Certification ajoutée" })
      }
      
      setCertificationDialogOpen(false)
      loadData()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder la certification",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteCertification = async (id: number) => {
    try {
      await cvApi.deleteCertification(id)
      toast({ title: "Succès", description: "Certification supprimée" })
      loadData()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la certification",
        variant: "destructive",
      })
    }
  }

  // Format date for display
  const formatPeriod = (dateDebut: string, dateFin: string | null, current: boolean) => {
    const start = new Date(dateDebut).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    if (current) return `${start} - Présent`
    if (!dateFin) return start
    const end = new Date(dateFin).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    return `${start} - ${end}`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
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
          <Button variant="outline" size="sm" onClick={() => openExperienceDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-6">
          {experiences.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucune expérience ajoutée. Cliquez sur "Ajouter" pour commencer.</p>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="relative border-l-2 border-primary/20 pl-6 pb-6 last:pb-0">
                <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary" />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{exp.titre}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Building2 className="h-4 w-4" />
                      <span>{exp.entreprise}</span>
                      {exp.localisation && (
                        <>
                          <span>•</span>
                          <span>{exp.localisation}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatPeriod(exp.date_debut, exp.date_fin, exp.poste_actuel)}</span>
                      {exp.poste_actuel && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Poste actuel
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openExperienceDialog(exp)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {exp.description && <p className="text-muted-foreground mb-3">{exp.description}</p>}

                {exp.realisations && exp.realisations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Réalisations clés:</p>
                    <ul className="space-y-1">
                      {exp.realisations.map((achievement, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
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
          <Button variant="outline" size="sm" onClick={() => openFormationDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-6">
          {formations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucune formation ajoutée. Cliquez sur "Ajouter" pour commencer.</p>
          ) : (
            formations.map((edu) => (
              <div key={edu.id} className="relative border-l-2 border-secondary/20 pl-6 pb-6 last:pb-0">
                <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-secondary" />

                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{edu.diplome}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Building2 className="h-4 w-4" />
                      <span>{edu.etablissement}</span>
                      {edu.localisation && (
                        <>
                          <span>•</span>
                          <span>{edu.localisation}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatPeriod(edu.date_debut, edu.date_fin, edu.en_cours)}</span>
                      {edu.en_cours && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          En cours
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openFormationDialog(edu)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteFormation(edu.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {edu.description && <p className="text-muted-foreground">{edu.description}</p>}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Certifications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Certifications</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => openCertificationDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {certifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8 col-span-2">Aucune certification ajoutée. Cliquez sur "Ajouter" pour commencer.</p>
          ) : (
            certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-start gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-secondary/10 flex-shrink-0">
                  <Award className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold">{cert.nom}</h4>
                  <p className="text-sm text-muted-foreground">{cert.organisme}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{formatDate(cert.date_obtention)}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openCertificationDialog(cert)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteCertification(cert.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Compétences */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Compétences</h2>
            <p className="text-sm text-muted-foreground">Gérez vos compétences dans votre profil</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Compétences certifiées */}
          {competences.filter(c => c.source_document_id !== null).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-green-600">Compétences certifiées</h3>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  ✓ Vérifié par blockchain
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {competences
                  .filter(c => c.source_document_id !== null)
                  .map((comp) => (
                    <Badge key={comp.competence_id} className="text-sm px-3 py-1.5 bg-green-100 text-green-800">
                      {comp.competence?.nom || "Compétence"}
                      {comp.niveau && <span className="ml-1 text-xs opacity-75">• {comp.niveau}</span>}
                      {comp.annees_experience && (
                        <span className="ml-1 text-xs opacity-75">• {comp.annees_experience} ans</span>
                      )}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Compétences déclarées */}
          {competences.filter(c => c.source_document_id === null).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-600">Compétences déclarées</h3>
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                  Auto-déclaré
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {competences
                  .filter(c => c.source_document_id === null)
                  .map((comp) => (
                    <Badge key={comp.competence_id} variant="secondary" className="text-sm px-3 py-1.5">
                      {comp.competence?.nom || "Compétence"}
                      {comp.niveau && <span className="ml-1 text-xs opacity-75">• {comp.niveau}</span>}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {competences.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Aucune compétence ajoutée. Rendez-vous dans votre profil pour ajouter des compétences.
            </p>
          )}
        </div>
      </Card>

      {/* Experience Dialog */}
      <Dialog open={experienceDialogOpen} onOpenChange={setExperienceDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingExperience ? "Modifier l'expérience" : "Ajouter une expérience"}</DialogTitle>
            <DialogDescription>Renseignez les détails de votre expérience professionnelle</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exp-titre">Titre du poste *</Label>
              <Input id="exp-titre" value={expTitre} onChange={(e) => setExpTitre(e.target.value)} placeholder="Développeur Full-Stack" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-entreprise">Entreprise *</Label>
              <Input id="exp-entreprise" value={expEntreprise} onChange={(e) => setExpEntreprise(e.target.value)} placeholder="TechSenegal" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-localisation">Localisation</Label>
              <Input id="exp-localisation" value={expLocalisation} onChange={(e) => setExpLocalisation(e.target.value)} placeholder="Dakar, Sénégal" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exp-date-debut">Date de début *</Label>
                <Input id="exp-date-debut" type="date" value={expDateDebut} onChange={(e) => setExpDateDebut(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-date-fin">Date de fin</Label>
                <Input id="exp-date-fin" type="date" value={expDateFin} onChange={(e) => setExpDateFin(e.target.value)} disabled={expPosteActuel} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="exp-actuel" checked={expPosteActuel} onChange={(e) => setExpPosteActuel(e.target.checked)} className="rounded" />
              <Label htmlFor="exp-actuel" className="font-normal">Poste actuel</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-description">Description</Label>
              <Textarea id="exp-description" value={expDescription} onChange={(e) => setExpDescription(e.target.value)} placeholder="Décrivez vos responsabilités..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-realisations">Réalisations clés (une par ligne)</Label>
              <Textarea id="exp-realisations" value={expRealisations} onChange={(e) => setExpRealisations(e.target.value)} placeholder="Augmentation des performances de 40%&#10;Réduction du temps de déploiement..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExperienceDialogOpen(false)}>Annuler</Button>
            <Button onClick={saveExperience} disabled={saving || !expTitre || !expEntreprise || !expDateDebut}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editingExperience ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Formation Dialog */}
      <Dialog open={formationDialogOpen} onOpenChange={setFormationDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingFormation ? "Modifier la formation" : "Ajouter une formation"}</DialogTitle>
            <DialogDescription>Renseignez les détails de votre formation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="form-diplome">Diplôme *</Label>
              <Input id="form-diplome" value={formDiplome} onChange={(e) => setFormDiplome(e.target.value)} placeholder="Master en Informatique" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-etablissement">Établissement *</Label>
              <Input id="form-etablissement" value={formEtablissement} onChange={(e) => setFormEtablissement(e.target.value)} placeholder="Université Cheikh Anta Diop" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-localisation">Localisation</Label>
              <Input id="form-localisation" value={formLocalisation} onChange={(e) => setFormLocalisation(e.target.value)} placeholder="Dakar, Sénégal" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="form-date-debut">Date de début *</Label>
                <Input id="form-date-debut" type="date" value={formDateDebut} onChange={(e) => setFormDateDebut(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-date-fin">Date de fin</Label>
                <Input id="form-date-fin" type="date" value={formDateFin} onChange={(e) => setFormDateFin(e.target.value)} disabled={formEnCours} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="form-en-cours" checked={formEnCours} onChange={(e) => setFormEnCours(e.target.checked)} className="rounded" />
              <Label htmlFor="form-en-cours" className="font-normal">En cours</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-description">Description</Label>
              <Textarea id="form-description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Spécialisation, mention..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormationDialogOpen(false)}>Annuler</Button>
            <Button onClick={saveFormation} disabled={saving || !formDiplome || !formEtablissement || !formDateDebut}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editingFormation ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certification Dialog */}
      <Dialog open={certificationDialogOpen} onOpenChange={setCertificationDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCertification ? "Modifier la certification" : "Ajouter une certification"}</DialogTitle>
            <DialogDescription>Renseignez les détails de votre certification</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cert-nom">Nom de la certification *</Label>
              <Input id="cert-nom" value={certNom} onChange={(e) => setCertNom(e.target.value)} placeholder="AWS Certified Solutions Architect" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-organisme">Organisme *</Label>
              <Input id="cert-organisme" value={certOrganisme} onChange={(e) => setCertOrganisme(e.target.value)} placeholder="Amazon Web Services" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-date">Date d'obtention *</Label>
              <Input id="cert-date" type="date" value={certDateObtention} onChange={(e) => setCertDateObtention(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-identifiant">Identifiant du certificat</Label>
              <Input id="cert-identifiant" value={certIdentifiant} onChange={(e) => setCertIdentifiant(e.target.value)} placeholder="AWS-SA-2023-12345" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertificationDialogOpen(false)}>Annuler</Button>
            <Button onClick={saveCertification} disabled={saving || !certNom || !certOrganisme || !certDateObtention}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editingCertification ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
