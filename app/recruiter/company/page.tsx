"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, Mail, Phone, MapPin, Edit, Save, X, Briefcase, Users, TrendingUp } from "lucide-react"
import { toast } from "sonner"

export default function RecruiterCompanyPage() {
  const [user, setUser] = useState<any>(null)
  const [offres, setOffres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    photo_url: "",
    nom_entreprise: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const { authApi, offreApi } = await import("@/lib/api-client")
      const [userData, offresData] = await Promise.all([
        authApi.me(),
        offreApi.list({ my_offres: true, per_page: 100 }),
      ])
      
      const userInfo = userData.user || userData
      setUser(userInfo)
      setFormData({
        prenom: userInfo.prenom || "",
        nom: userInfo.nom || "",
        email: userInfo.email || "",
        telephone: userInfo.telephone || "",
        photo_url: userInfo.photo_url || "",
        nom_entreprise: userInfo.nom_entreprise || "",
      })
      
      setOffres(offresData.data || [])
    } catch (error: any) {
      console.error("Erreur lors du chargement des données:", error)
      toast.error("Erreur lors du chargement des données", {
        description: error.message || "Veuillez réessayer.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { authApi } = await import("@/lib/api-client")
      await authApi.updateProfile(formData)
      toast.success("Profil mis à jour avec succès")
      setEditing(false)
      loadData()
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error)
      toast.error("Erreur lors de la mise à jour", {
        description: error.message || "Veuillez réessayer.",
      })
    }
  }

  // Agréger les informations d'entreprise depuis les offres (en fallback si pas dans le profil)
  const companyInfo = offres.reduce((acc: any, offre: any) => {
    if (offre.entreprise && !acc.nom) {
      acc.nom = offre.entreprise
    }
    if (offre.secteur_activite && !acc.secteur) {
      acc.secteur = offre.secteur_activite
    }
    if (offre.lieu && !acc.localisation) {
      acc.localisation = offre.lieu
    }
    return acc
  }, {})

  // Utiliser le nom_entreprise de l'utilisateur en priorité
  const companyName = user?.nom_entreprise || companyInfo.nom || "Non renseigné"

  const totalOffres = offres.length
  const publishedOffres = offres.filter((o) => o.statut === "PUBLIEE").length
  const totalCandidatures = offres.reduce((sum, offre) => sum + (offre.matchings_count || offre.nombre_candidatures || 0), 0)

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Entreprise</h1>
          <p className="text-muted-foreground">Gérez les informations de votre entreprise</p>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-secondary to-primary">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Informations principales */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>Vos coordonnées principales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  {editing ? (
                    <Input
                      id="prenom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <span>{user?.prenom || "Non renseigné"}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  {editing ? (
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <span>{user?.nom || "Non renseigné"}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {editing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email || "Non renseigné"}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                {editing ? (
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.telephone || "Non renseigné"}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations entreprise</CardTitle>
              <CardDescription>Détails de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom_entreprise">Nom de l'entreprise</Label>
                {editing ? (
                  <Input
                    id="nom_entreprise"
                    value={formData.nom_entreprise}
                    onChange={(e) => setFormData({ ...formData, nom_entreprise: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{companyName}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Secteur d'activité</Label>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{companyInfo.secteur || "Non renseigné"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Localisation</Label>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{companyInfo.localisation || "Non renseigné"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total offres</span>
                </div>
                <span className="text-2xl font-bold">{totalOffres}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Offres publiées</span>
                </div>
                <span className="text-2xl font-bold">{publishedOffres}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Candidatures</span>
                </div>
                <span className="text-2xl font-bold">{totalCandidatures}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
                  {user?.prenom?.[0] || ""}
                  {user?.nom?.[0] || ""}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{user?.name || `${user?.prenom || ""} ${user?.nom || ""}`}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge className="mt-2" variant="secondary">
                    Recruteur
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

