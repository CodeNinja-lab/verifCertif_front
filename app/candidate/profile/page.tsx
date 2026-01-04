"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, Upload, Plus, X, Save, Loader2 } from "lucide-react"
import { authApi, profilEtudiantApi, competenceApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface UserData {
  id: number
  prenom: string
  nom: string
  email: string
  telephone: string
  photo_url: string | null
  profil_etudiant?: ProfilEtudiant
}

interface ProfilEtudiant {
  id: number
  bio: string | null
  linkedin_url: string | null
  github_url: string | null
  portfolio_url: string | null
  disponibilite: string | null
  localisation_actuelle: string | null
  localisation_souhaitee: string[] | null
  mobilite: string | null
  salaire_minimum_souhaite: number | null
  types_contrat_souhaites: string[] | null
  competences?: ProfilCompetence[]
}

interface ProfilCompetence {
  id: number
  competence_id: number
  competence: {
    id: number
    nom: string
  }
  niveau: string | null
  annees_experience: number | null
  source: string | null
  validee_par_etudiant: boolean
}

interface Competence {
  id: number
  nom: string
}

export default function CandidateProfile() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Loading states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  
  // User data
  const [userData, setUserData] = useState<UserData | null>(null)
  const [profilExists, setProfilExists] = useState(false)
  
  // Form fields - User info
  const [prenom, setPrenom] = useState("")
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  
  // Form fields - Profile
  const [bio, setBio] = useState("")
  const [localisation, setLocalisation] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [portfolioUrl, setPortfolioUrl] = useState("")
  const [typesContrat, setTypesContrat] = useState("")
  const [salaire, setSalaire] = useState("")
  const [disponibilite, setDisponibilite] = useState("")
  const [mobilite, setMobilite] = useState("")
  
  // Skills
  const [skills, setSkills] = useState<ProfilCompetence[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [allCompetences, setAllCompetences] = useState<Competence[]>([])
  const [filteredCompetences, setFilteredCompetences] = useState<Competence[]>([])
  const [showCompetenceDropdown, setShowCompetenceDropdown] = useState(false)

  // Load user data and profile on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load user info
      const userResponse = await authApi.me()
      const user = userResponse.user
      setUserData(user)
      setPrenom(user.prenom || "")
      setNom(user.nom || "")
      setEmail(user.email || "")
      setTelephone(user.telephone || "")
      setPhotoUrl(user.photo_url)
      
      // Load profile if exists
      if (user.profil_etudiant) {
        setProfilExists(true)
        const profil = user.profil_etudiant
        setBio(profil.bio || "")
        setLocalisation(profil.localisation_actuelle || "")
        setLinkedinUrl(profil.linkedin_url || "")
        setGithubUrl(profil.github_url || "")
        setPortfolioUrl(profil.portfolio_url || "")
        setTypesContrat(profil.types_contrat_souhaites?.join(", ") || "")
        setSalaire(profil.salaire_minimum_souhaite?.toString() || "")
        setDisponibilite(profil.disponibilite || "")
        setMobilite(profil.mobilite || "")
      }

      // Load competences from profile
      try {
        const competencesResponse = await profilEtudiantApi.getCompetences()
        setSkills(competencesResponse.data || [])
      } catch {
        // Profile might not exist yet
        setSkills([])
      }

      // Load all available competences for autocomplete
      try {
        const allCompetencesResponse = await competenceApi.list()
        setAllCompetences(allCompetencesResponse.data || [])
      } catch {
        setAllCompetences([])
      }
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du profil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Update user info
      await authApi.updateProfile({
        prenom,
        nom,
        telephone,
      })

      // Prepare profile data
      const profileData = {
        bio: bio || undefined,
        localisation_actuelle: localisation || undefined,
        linkedin_url: linkedinUrl || undefined,
        github_url: githubUrl || undefined,
        portfolio_url: portfolioUrl || undefined,
        types_contrat_souhaites: typesContrat ? typesContrat.split(",").map(s => s.trim()) : undefined,
        salaire_minimum_souhaite: salaire ? parseInt(salaire) : undefined,
        disponibilite: disponibilite || undefined,
        mobilite: mobilite || undefined,
      }

      // Create or update profile
      if (profilExists) {
        await profilEtudiantApi.update(profileData)
      } else {
        await profilEtudiantApi.create(profileData)
        setProfilExists(true)
      }

      toast({
        title: "Succès",
        description: "Profil enregistré avec succès",
      })

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder le profil",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingPhoto(true)
      const response = await authApi.uploadPhoto(file)
      setPhotoUrl(response.photo_url)
      toast({
        title: "Succès",
        description: "Photo de profil mise à jour",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de télécharger la photo",
        variant: "destructive",
      })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSkillSearch = (query: string) => {
    setNewSkill(query)
    if (query.length > 0) {
      const filtered = allCompetences.filter(c => 
        c.nom.toLowerCase().includes(query.toLowerCase()) &&
        !skills.find(s => s.competence_id === c.id)
      )
      setFilteredCompetences(filtered)
      setShowCompetenceDropdown(true)
    } else {
      setShowCompetenceDropdown(false)
    }
  }

  const addSkill = async (competence: Competence) => {
    try {
      // Ensure profile exists first
      if (!profilExists) {
        await profilEtudiantApi.create({})
        setProfilExists(true)
      }

      const response = await profilEtudiantApi.addCompetence({
        competence_id: competence.id,
      })
      
      setSkills([...skills, response.competence])
      setNewSkill("")
      setShowCompetenceDropdown(false)
      
      toast({
        title: "Succès",
        description: `Compétence "${competence.nom}" ajoutée`,
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter la compétence",
        variant: "destructive",
      })
    }
  }

  const removeSkill = async (competenceId: number, skillName: string) => {
    try {
      await profilEtudiantApi.removeCompetence(competenceId)
      setSkills(skills.filter((s) => s.competence_id !== competenceId))
      toast({
        title: "Succès",
        description: `Compétence "${skillName}" supprimée`,
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la compétence",
        variant: "destructive",
      })
    }
  }

  const getInitials = () => {
    const firstInitial = prenom?.charAt(0)?.toUpperCase() || ""
    const lastInitial = nom?.charAt(0)?.toUpperCase() || ""
    return firstInitial + lastInitial || "?"
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
          <h1 className="text-3xl font-bold">Mon profil</h1>
          <p className="text-muted-foreground mt-1">Gérez vos informations personnelles et professionnelles</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Enregistrer
        </Button>
      </div>

      {/* Profile Photo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Photo de profil</h2>
        <div className="flex items-center gap-6">
          {photoUrl ? (
            <div className="h-24 w-24 rounded-full overflow-hidden relative">
              <Image
                src={photoUrl}
                alt="Photo de profil"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-3xl font-bold">
              {getInitials()}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-3">Une photo professionnelle augmente vos chances de 40%</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
              className="hidden"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}>
              {uploadingPhoto ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Télécharger une photo
            </Button>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="firstName" value={prenom ?? ""} onChange={(e) => setPrenom(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" value={nom ?? ""} onChange={(e) => setNom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" value={email ?? ""} className="pl-10" disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="phone" value={telephone ?? ""} onChange={(e) => setTelephone(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Localisation</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="location" value={localisation ?? ""} onChange={(e) => setLocalisation(e.target.value)} className="pl-10" placeholder="Dakar, Sénégal" />
            </div>
          </div>
        </div>
      </Card>

      {/* Professional Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">À propos de moi</h2>
        <Textarea
          placeholder="Parlez de votre parcours, vos objectifs et ce qui vous distingue..."
          className="min-h-[150px] resize-none"
          value={bio ?? ""}
          onChange={(e) => setBio(e.target.value)}
        />
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Compétences</h2>
        <div className="space-y-6">
          {/* Compétences certifiées */}
          {skills.filter(s => s.source === 'diplome' || s.source === 'certification' || s.source === 'document').length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-green-600">Compétences certifiées</h3>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Vérifié
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter(s => s.source === 'diplome' || s.source === 'certification' || s.source === 'document')
                  .map((skill) => (
                    <Badge key={skill.competence_id} className="text-sm px-3 py-1.5 bg-green-100 text-green-800 hover:bg-green-200">
                      {skill.competence?.nom || "Compétence"}
                      <button onClick={() => removeSkill(skill.competence_id, skill.competence?.nom || "")} className="ml-2 hover:text-destructive transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Compétences non certifiées */}
          {skills.filter(s => s.source === 'manuel' || !s.source).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-600">Compétences déclarées</h3>
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                  Non vérifié
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter(s => s.source === 'manuel' || !s.source)
                  .map((skill) => (
                    <Badge key={skill.competence_id} variant="secondary" className="text-sm px-3 py-1.5">
                      {skill.competence?.nom || "Compétence"}
                      <button onClick={() => removeSkill(skill.competence_id, skill.competence?.nom || "")} className="ml-2 hover:text-destructive transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Ajouter une nouvelle compétence */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="text-sm font-medium">Ajouter une compétence</Label>
            <div className="flex gap-2 relative">
              <Input
                placeholder="Rechercher une compétence"
                value={newSkill ?? ""}
                onChange={(e) => handleSkillSearch(e.target.value)}
                onFocus={() => newSkill && setShowCompetenceDropdown(true)}
                onBlur={() => setTimeout(() => setShowCompetenceDropdown(false), 200)}
              />
              <Button variant="outline" disabled>
                <Plus className="h-4 w-4" />
              </Button>
              {showCompetenceDropdown && filteredCompetences.length > 0 && (
                <div className="absolute top-full left-0 right-12 mt-1 bg-background border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredCompetences.slice(0, 10).map((competence) => (
                    <button
                      key={competence.id}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                      onClick={() => addSkill(competence)}
                    >
                      {competence.nom}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Liens professionnels</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="linkedin" placeholder="linkedin.com/in/..." className="pl-10" value={linkedinUrl ?? ""} onChange={(e) => setLinkedinUrl(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="github" placeholder="github.com/..." className="pl-10" value={githubUrl ?? ""} onChange={(e) => setGithubUrl(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Site web / Portfolio</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="website" placeholder="votresite.com" className="pl-10" value={portfolioUrl ?? ""} onChange={(e) => setPortfolioUrl(e.target.value)} />
            </div>
          </div>
        </div>
      </Card>

      {/* Job Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Préférences de recherche</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="jobType">Type de contrat</Label>
            <Input id="jobType" value={typesContrat ?? ""} onChange={(e) => setTypesContrat(e.target.value)} placeholder="CDI, Freelance" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salaire souhaité (annuel en FCFA)</Label>
            <Input id="salary" value={salaire ?? ""} onChange={(e) => setSalaire(e.target.value)} placeholder="800000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availability">Disponibilité</Label>
            <Input id="availability" value={disponibilite ?? ""} onChange={(e) => setDisponibilite(e.target.value)} placeholder="Immédiate" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remote">Télétravail</Label>
            <Input id="remote" value={mobilite ?? ""} onChange={(e) => setMobilite(e.target.value)} placeholder="Hybride préféré" />
          </div>
        </div>
      </Card>
    </div>
  )
}
