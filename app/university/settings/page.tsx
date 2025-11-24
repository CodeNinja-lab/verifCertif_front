import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Building2, Mail, Phone, MapPin, Globe } from "lucide-react"

export default function UniversitySettingsPage() {
  return (
    <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les informations de votre établissement</p>
      </div>

      {/* Institution Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'établissement</CardTitle>
          <CardDescription>Informations publiques visibles lors des vérifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'établissement</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="name" defaultValue="Université Cheikh Anta Diop (UCAD)" className="pl-9" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue="Première université francophone d'Afrique de l'Ouest, pôle d'excellence en enseignement et recherche."
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" defaultValue="contact@ucad.edu.sn" className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" type="tel" defaultValue="+221 33 825 05 30" className="pl-9" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                defaultValue="Avenue Cheikh Anta Diop, BP 5005, Dakar-Fann, Sénégal"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="website" type="url" defaultValue="https://www.ucad.sn" className="pl-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres blockchain</CardTitle>
          <CardDescription>Configuration de la certification numérique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Certification automatique</Label>
              <p className="text-sm text-muted-foreground">Certifier automatiquement les diplômes sur la blockchain</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications de vérification</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir une notification à chaque vérification de diplôme
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>QR Code sur les diplômes</Label>
              <p className="text-sm text-muted-foreground">Ajouter un QR code de vérification sur les documents PDF</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Gérez vos préférences de notification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Nouveaux étudiants</Label>
              <p className="text-sm text-muted-foreground">Notification lors de l'ajout d'un nouvel étudiant</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Diplômes en attente</Label>
              <p className="text-sm text-muted-foreground">Rappel des diplômes en attente de certification</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rapports mensuels</Label>
              <p className="text-sm text-muted-foreground">Recevoir un rapport mensuel d'activité</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-[#009EE0] hover:bg-[#008AC0]">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  )
}
