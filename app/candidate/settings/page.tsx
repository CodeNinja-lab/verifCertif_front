"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  User,
  Lock,
  Bell,
  Shield,
  Trash2,
  Loader2,
  Save,
  Upload,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
} from "lucide-react"
import { authApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: number
  prenom: string
  nom: string
  email: string
  telephone?: string
  photo_url?: string
  langue?: string
  role: string
  email_verified_at?: string
  two_factor_enabled?: boolean
}

export default function CandidateSettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const { toast } = useToast()

  // Formulaire profil
  const [prenom, setPrenom] = useState("")
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [langue, setLangue] = useState("fr")

  // Formulaire mot de passe
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // Préférences de notifications
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [matchingNotifications, setMatchingNotifications] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)
  const [applicationNotifications, setApplicationNotifications] = useState(true)

  // Préférences de confidentialité
  const [profilPublic, setProfilPublic] = useState(true)
  const [showEmail, setShowEmail] = useState(false)
  const [showTelephone, setShowTelephone] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      const response = await authApi.me()
      const userData = response.user
      setUser(userData)
      setPrenom(userData.prenom || "")
      setNom(userData.nom || "")
      setEmail(userData.email || "")
      setTelephone(userData.telephone || "")
      setLangue(userData.langue || "fr")
    } catch (error: any) {
      console.error("Erreur lors du chargement du profil:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger vos informations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      await authApi.updateProfile({
        prenom,
        nom,
        email,
        telephone,
        langue,
      })
      toast({
        title: "Succès",
        description: "Vos informations ont été mises à jour",
      })
      loadUser()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder les modifications",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      })
      return
    }

    try {
      setChangingPassword(true)
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié",
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer le mot de passe",
        variant: "destructive",
      })
    } finally {
      setChangingPassword(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "La photo ne doit pas dépasser 5 Mo",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingPhoto(true)
      await authApi.uploadPhoto(file)
      toast({
        title: "Succès",
        description: "Photo de profil mise à jour",
      })
      loadUser()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'uploader la photo",
        variant: "destructive",
      })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleDeletePhoto = async () => {
    try {
      await authApi.deletePhoto()
      toast({
        title: "Succès",
        description: "Photo de profil supprimée",
      })
      loadUser()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la photo",
        variant: "destructive",
      })
    }
  }

  const getInitials = () => {
    const firstInitial = user?.prenom?.charAt(0)?.toUpperCase() || ""
    const lastInitial = user?.nom?.charAt(0)?.toUpperCase() || ""
    return firstInitial + lastInitial || "?"
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Confidentialité</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
              <CardDescription>
                Cette photo sera visible par les recruteurs
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.photo_url || ""} alt="Photo de profil" />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" asChild disabled={uploadingPhoto}>
                    <label className="cursor-pointer">
                      {uploadingPhoto ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Changer
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                      />
                    </label>
                  </Button>
                  {user?.photo_url && (
                    <Button variant="ghost" onClick={handleDeletePhoto}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG ou GIF. Taille max 5 Mo.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations de contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="flex-1"
                  />
                  {user?.email_verified_at ? (
                    <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-600">
                      <Check className="h-3 w-3" />
                      Vérifié
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-amber-600 border-amber-600">
                      <AlertTriangle className="h-3 w-3" />
                      Non vérifié
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+221 77 123 45 67"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="langue">Langue préférée</Label>
                <Select value={langue} onValueChange={setLangue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>
                Mettez à jour votre mot de passe régulièrement pour sécuriser votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 8 caractères avec lettres et chiffres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  onClick={handleChangePassword} 
                  disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                >
                  {changingPassword ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  Changer le mot de passe
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentification à deux facteurs</CardTitle>
              <CardDescription>
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Authentification 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.two_factor_enabled 
                      ? "L'authentification à deux facteurs est activée" 
                      : "Protégez votre compte avec un code de vérification"}
                  </p>
                </div>
                <Badge variant={user?.two_factor_enabled ? "default" : "secondary"}>
                  {user?.two_factor_enabled ? "Activé" : "Désactivé"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>
                Choisissez comment et quand vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Matchings d'offres</Label>
                  <p className="text-sm text-muted-foreground">
                    Être notifié quand une offre correspond à votre profil
                  </p>
                </div>
                <Switch
                  checked={matchingNotifications}
                  onCheckedChange={setMatchingNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouveaux messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Être notifié quand vous recevez un nouveau message
                  </p>
                </div>
                <Switch
                  checked={messageNotifications}
                  onCheckedChange={setMessageNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mises à jour des candidatures</Label>
                  <p className="text-sm text-muted-foreground">
                    Être notifié quand le statut d'une candidature change
                  </p>
                </div>
                <Switch
                  checked={applicationNotifications}
                  onCheckedChange={setApplicationNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Confidentialité */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visibilité du profil</CardTitle>
              <CardDescription>
                Contrôlez qui peut voir vos informations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profil public</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux recruteurs de voir votre profil
                  </p>
                </div>
                <Switch
                  checked={profilPublic}
                  onCheckedChange={setProfilPublic}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Afficher l'email</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux recruteurs de voir votre email
                  </p>
                </div>
                <Switch
                  checked={showEmail}
                  onCheckedChange={setShowEmail}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Afficher le téléphone</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux recruteurs de voir votre numéro
                  </p>
                </div>
                <Switch
                  checked={showTelephone}
                  onCheckedChange={setShowTelephone}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Supprimer mon compte</p>
                  <p className="text-sm text-muted-foreground">
                    Cette action est irréversible et supprimera toutes vos données
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Votre compte et toutes vos données
                        (candidatures, messages, CV, etc.) seront définitivement supprimés.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
