"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, Upload, Plus, X, Save } from "lucide-react"

export default function CandidateProfile() {
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js", "Python"])
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon profil</h1>
          <p className="text-muted-foreground mt-1">Gérez vos informations personnelles et professionnelles</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>

      {/* Profile Photo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Photo de profil</h2>
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-3xl font-bold">
            JD
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-3">Une photo professionnelle augmente vos chances de 40%</p>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
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
              <Input id="firstName" defaultValue="Jean" className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" defaultValue="Dupont" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" defaultValue="jean.dupont@email.com" className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="phone" defaultValue="+33 6 12 34 56 78" className="pl-10" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Localisation</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="location" defaultValue="Paris, France" className="pl-10" />
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
          defaultValue="Développeur Full-Stack passionné avec 5+ ans d'expérience dans la création d'applications web modernes. Expert en React, Node.js et architecture cloud. Toujours à la recherche de défis techniques stimulants."
        />
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Compétences</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm px-3 py-1.5">
                {skill}
                <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-destructive transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter une compétence"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            />
            <Button onClick={addSkill} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
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
              <Input id="linkedin" placeholder="linkedin.com/in/..." className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="github" placeholder="github.com/..." className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Site web / Portfolio</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="website" placeholder="votresite.com" className="pl-10" />
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
            <Input id="jobType" defaultValue="CDI, Freelance" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salaire souhaité (annuel)</Label>
            <Input id="salary" defaultValue="55 000 - 70 000 €" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availability">Disponibilité</Label>
            <Input id="availability" defaultValue="Immédiate" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remote">Télétravail</Label>
            <Input id="remote" defaultValue="Hybride préféré" />
          </div>
        </div>
      </Card>
    </div>
  )
}
