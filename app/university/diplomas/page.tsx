"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { diplomeApi, competenceApi } from "@/lib/api-client"
import { toast } from "sonner"

interface Competence {
  id: number
  nom: string
  categorie: string
}

interface Diplome {
  id: number
  nom: string
  description?: string
  code?: string
  actif: boolean
  ordre: number
  competences?: Competence[]
}

export default function UniversityDiplomasPage() {
  const [diplomes, setDiplomes] = useState<Diplome[]>([])
  const [competences, setCompetences] = useState<Competence[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDiplome, setEditingDiplome] = useState<Diplome | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    code: "",
    actif: true,
    ordre: 0,
    competences: [] as number[],
  })

  useEffect(() => {
    loadDiplomes()
    loadCompetences()
  }, [])

  const loadDiplomes = async () => {
    try {
      setLoading(true)
      const response = await diplomeApi.list({ per_page: 100 })
      // Laravel peut retourner soit response.data soit directement le tableau
      const diplomesData = response.data || response
      setDiplomes(Array.isArray(diplomesData) ? diplomesData : diplomesData.data || [])
    } catch (error: any) {
      toast.error("Erreur lors du chargement des diplômes", {
        description: error.message || "Une erreur est survenue",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCompetences = async () => {
    try {
      const response = await competenceApi.list()
      setCompetences(response.data || [])
    } catch (error: any) {
      console.error("Erreur lors du chargement des compétences:", error)
    }
  }

  const handleOpenDialog = (diplome?: Diplome) => {
    if (diplome) {
      setEditingDiplome(diplome)
      setFormData({
        nom: diplome.nom,
        description: diplome.description || "",
        code: diplome.code || "",
        actif: diplome.actif,
        ordre: diplome.ordre,
        competences: diplome.competences?.map((c) => c.id) || [],
      })
    } else {
      setEditingDiplome(null)
      setFormData({
        nom: "",
        description: "",
        code: "",
        actif: true,
        ordre: 0,
        competences: [],
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Vérifier qu'on a au moins une compétence
      if (formData.competences.length === 0) {
        toast.error("Erreur", {
          description: "Veuillez sélectionner au moins une compétence",
        })
        return
      }
      
      // Préparer les données pour l'API
      const codeValue = formData.code?.trim()
      const dataToSend = {
        nom: formData.nom.trim(),
        description: formData.description?.trim() || null,
        code: codeValue && codeValue.length > 0 ? codeValue : null,
        actif: Boolean(formData.actif),
        ordre: parseInt(String(formData.ordre)) || 0,
        competences: formData.competences.map(id => parseInt(String(id))).filter(id => !isNaN(id)),
      }
      
      console.log("Données envoyées:", dataToSend)

      if (editingDiplome) {
        await diplomeApi.update(editingDiplome.id, dataToSend)
        toast.success("Diplôme mis à jour avec succès")
      } else {
        await diplomeApi.create(dataToSend)
        toast.success("Diplôme créé avec succès")
      }
      setIsDialogOpen(false)
      loadDiplomes()
    } catch (error: any) {
      console.error("Erreur détaillée:", error)
      let errorMessage = "Une erreur est survenue"
      
      if (error.data) {
        // Erreur de validation Laravel
        if (error.data.errors) {
          const errors = Object.entries(error.data.errors)
            .map(([field, messages]: [string, any]) => {
              const fieldName = field === 'code' ? 'Code' : field === 'nom' ? 'Nom' : field === 'competences' ? 'Compétences' : field
              const message = Array.isArray(messages) ? messages.join(', ') : messages
              return `${fieldName}: ${message}`
            })
            .join('\n')
          errorMessage = errors
        } else if (error.data.message) {
          errorMessage = error.data.message
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      // Message spécifique pour le code dupliqué
      if (errorMessage.includes('code') && errorMessage.includes('already been taken')) {
        errorMessage = "Ce code de diplôme existe déjà. Veuillez utiliser un code différent ou laisser le champ vide."
      }
      
      toast.error("Erreur lors de la sauvegarde", {
        description: errorMessage,
        duration: 6000,
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce diplôme ?")) return

    try {
      await diplomeApi.delete(id)
      toast.success("Diplôme supprimé avec succès")
      loadDiplomes()
    } catch (error: any) {
      toast.error("Erreur lors de la suppression", {
        description: error.message || "Une erreur est survenue",
      })
    }
  }

  const filteredDiplomes = diplomes.filter((diplome) =>
    diplome.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diplome.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration des Diplômes</h1>
          <p className="text-muted-foreground">Configurez les diplômes proposés et leurs compétences associées.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau diplôme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDiplome ? "Modifier le diplôme" : "Nouveau diplôme"}</DialogTitle>
              <DialogDescription>
                {editingDiplome ? "Modifiez les informations du diplôme." : "Créez un nouveau diplôme et associez-lui des compétences."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du diplôme *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                  placeholder="Ex: Master en Informatique"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ex: MASTER_INFO"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du diplôme..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ordre">Ordre d'affichage</Label>
                  <Input
                    id="ordre"
                    type="number"
                    value={formData.ordre}
                    onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="actif"
                    checked={formData.actif}
                    onCheckedChange={(checked) => setFormData({ ...formData, actif: checked })}
                  />
                  <Label htmlFor="actif">Actif</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="competences">Compétences associées *</Label>
                <select
                  id="competences"
                  multiple
                  className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.competences.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (option) => parseInt(option.value))
                    setFormData({ ...formData, competences: selected })
                  }}
                  required
                >
                  {competences.map((competence) => (
                    <option key={competence.id} value={competence.id}>
                      {competence.nom} ({competence.categorie})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs compétences
                </p>
                {formData.competences.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.competences.map((compId) => {
                      const comp = competences.find((c) => c.id === compId)
                      return comp ? (
                        <Badge key={compId} variant="secondary">
                          {comp.nom}
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">{editingDiplome ? "Mettre à jour" : "Créer"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des diplômes</CardTitle>
          <CardDescription>Gérez tous les diplômes configurés dans le système.</CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un diplôme..."
                className="pl-9 max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : filteredDiplomes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Aucun diplôme trouvé</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Compétences</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Ordre</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiplomes.map((diplome) => (
                  <TableRow key={diplome.id}>
                    <TableCell className="font-medium">{diplome.nom}</TableCell>
                    <TableCell>
                      {diplome.code ? (
                        <Badge variant="outline">{diplome.code}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {diplome.competences && diplome.competences.length > 0 ? (
                          diplome.competences.slice(0, 3).map((comp) => (
                            <Badge key={comp.id} variant="secondary" className="text-xs">
                              {comp.nom}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">Aucune</span>
                        )}
                        {diplome.competences && diplome.competences.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{diplome.competences.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {diplome.actif ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          Inactif
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{diplome.ordre}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(diplome)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(diplome.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

