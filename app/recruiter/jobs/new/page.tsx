"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Eye, Send, Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewJobPage() {
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [benefits, setBenefits] = useState<string[]>([])
  const [newBenefit, setNewBenefit] = useState("")

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
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

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Créer une nouvelle offre</h1>
          <p className="text-muted-foreground mt-1">Remplissez les détails de votre offre d'emploi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Prévisualiser
          </Button>
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer brouillon
          </Button>
          <Button className="bg-gradient-to-r from-secondary to-primary">
            <Send className="mr-2 h-4 w-4" />
            Publier l'offre
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Intitulé du poste *</Label>
            <Input id="title" placeholder="Ex: Développeur Full-Stack Senior" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contract">Type de contrat *</Label>
              <Select>
                <SelectTrigger id="contract">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cdi">CDI</SelectItem>
                  <SelectItem value="cdd">CDD</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                  <SelectItem value="alternance">Alternance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Niveau d'expérience *</Label>
              <Select>
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior (0-2 ans)</SelectItem>
                  <SelectItem value="confirmed">Confirmé (3-5 ans)</SelectItem>
                  <SelectItem value="senior">Senior (5+ ans)</SelectItem>
                  <SelectItem value="expert">Expert (10+ ans)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Localisation *</Label>
              <Input id="location" placeholder="Ex: Paris, France" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remote">Télétravail *</Label>
              <Select>
                <SelectTrigger id="remote">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Remote</SelectItem>
                  <SelectItem value="hybrid">Hybride</SelectItem>
                  <SelectItem value="onsite">Présentiel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Salaire minimum (€/an)</Label>
              <Input id="salaryMin" type="number" placeholder="50000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryMax">Salaire maximum (€/an)</Label>
              <Input id="salaryMax" type="number" placeholder="70000" />
            </div>
          </div>
        </div>
      </Card>

      {/* Job Description */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Description du poste</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Description générale *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le poste, l'équipe et le contexte..."
              className="min-h-[150px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Une description claire et engageante attire 60% de candidatures en plus
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Missions principales *</Label>
            <Textarea
              id="responsibilities"
              placeholder="Listez les responsabilités clés du poste..."
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Profil recherché *</Label>
            <Textarea
              id="requirements"
              placeholder="Compétences requises, diplômes, certifications..."
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Compétences techniques</h2>
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
              placeholder="Ajouter une compétence (ex: React, Python...)"
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
        <Button variant="outline">Annuler</Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer brouillon
          </Button>
          <Button className="bg-gradient-to-r from-secondary to-primary">
            <Send className="mr-2 h-4 w-4" />
            Publier l'offre
          </Button>
        </div>
      </div>
    </div>
  )
}
