"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Bell, Globe, Save, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RecruiterSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // État pour les onglets
  const [activeTab, setActiveTab] = useState("profile")
  
  // État pour le profil
  const [profileData, setProfileData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    langue: "fr",
  })
  
  // État pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const { authApi } = await import("@/lib/api-client")
      const data = await authApi.me()
      const userInfo = data.user || data
      setUser(userInfo)
      setProfileData({
        prenom: userInfo.prenom || "",
        nom: userInfo.nom || "",
        email: userInfo.email || "",
        telephone: userInfo.telephone || "",
        langue: userInfo.langue || "fr",
      })
    } catch (error: any) {
      console.error("Erreur lors du chargement des données:", error)
      toast.error("Erreur lors du chargement des données", {
        description: error.message || "Veuillez réessayer.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const { authApi } = await import("@/lib/api-client")
      await authApi.updateProfile(profileData)
      toast.success("Profil mis à jour avec succès")
      loadUserData()
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error)
      toast.error("Erreur lors de la mise à jour", {
        description: error.message || "Veuillez réessayer.",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    if (passwordData.new_password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    try {
      setSaving(true)
      const { authApi } = await import("@/lib/api-client")
      const response = await authApi.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      })
      
      // Mettre à jour le token si fourni
      if (response.token && typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.token)
      }
      
      toast.success("Mot de passe modifié avec succès")
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })
    } catch (error: any) {
      console.error("Erreur lors du changement de mot de passe:", error)
      toast.error("Erreur lors du changement de mot de passe", {
        description: error.message || "Le mot de passe actuel est incorrect.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos préférences et votre compte</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="mr-2 h-4 w-4" />
            Mot de passe
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Globe className="mr-2 h-4 w-4" />
            Préférences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Modifiez vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={profileData.prenom}
                    onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={profileData.nom}
                    onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={profileData.telephone}
                  onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving} className="bg-gradient-to-r from-secondary to-primary">
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {passwordData.new_password && passwordData.confirm_password && (
                <div className={`flex items-center gap-2 text-sm ${
                  passwordData.new_password === passwordData.confirm_password ? "text-green-600" : "text-red-600"
                }`}>
                  <CheckCircle2 className="h-4 w-4" />
                  {passwordData.new_password === passwordData.confirm_password
                    ? "Les mots de passe correspondent"
                    : "Les mots de passe ne correspondent pas"}
                </div>
              )}
              <Button onClick={handleChangePassword} disabled={saving} className="bg-gradient-to-r from-secondary to-primary">
                <Lock className="mr-2 h-4 w-4" />
                {saving ? "Modification..." : "Changer le mot de passe"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>Personnalisez votre expérience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="langue">Langue</Label>
                <Select
                  value={profileData.langue}
                  onValueChange={(value) => setProfileData({ ...profileData, langue: value })}
                >
                  <SelectTrigger id="langue">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveProfile} disabled={saving} className="bg-gradient-to-r from-secondary to-primary">
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Enregistrement..." : "Enregistrer les préférences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

