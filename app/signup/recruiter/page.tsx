"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Briefcase, Mail, Lock, Eye, EyeOff, User, Phone, Building2, ArrowRight, ArrowLeft } from "lucide-react"

export default function RecruiterSignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companySize: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setError(null)
    setLoading(true)

    fetch(`${apiBaseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prenom: formData.firstName,
        nom: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        telephone: formData.phone,
        nom_entreprise: formData.companyName,
        role: "recruteur",
        langue: "fr",
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          const firstError =
            data?.message ||
            (data?.errors && Object.values<string[]>(data.errors)[0]?.[0]) ||
            "Impossible de créer le compte."
          throw new Error(firstError)
        }
        return res.json()
      })
      .then((data) => {
        const token = data.token as string | undefined
        const user = data.user as { role?: string } | undefined

        if (token && typeof window !== "undefined") {
          localStorage.setItem("auth_token", token)
          if (user) {
            localStorage.setItem("current_user", JSON.stringify(user))
          }
        }

        router.push("/recruiter")
      })
      .catch((err: Error) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="flex items-center gap-2 group justify-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform group-hover:scale-105">
              <Briefcase className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TalentHub Pro
            </span>
          </Link>

          <Button variant="ghost" asChild className="w-fit">
            <Link href="/signup">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Créer un compte Recruteur</h1>
            <p className="text-muted-foreground">Accédez aux meilleurs talents pour votre entreprise</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="Marie"
                    className="pl-9 h-11"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Martin"
                  className="h-11"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  placeholder="Ex: Entreprise Sénégal"
                  className="pl-9 h-11"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@entreprise.com"
                  className="pl-9 h-11"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+221 33 800 00 00"
                  className="pl-9 h-11"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-11"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-11"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                required
              />
              <label htmlFor="terms" className="text-sm leading-relaxed">
                J'accepte les{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  politique de confidentialité
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-secondary to-green-600 hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? "Création du compte..." : "Créer mon compte entreprise"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary/10 via-green-500/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:32px_32px]" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12">
          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-balance">Recrutez les meilleurs talents</h2>
              <p className="text-lg text-muted-foreground text-balance">
                Une plateforme complète pour gérer vos recrutements de A à Z.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/50 backdrop-blur rounded-xl p-6 border border-border">
                <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-green-600 bg-clip-text text-transparent mb-2">
                  10M+
                </div>
                <div className="text-sm text-muted-foreground">Candidats qualifiés</div>
              </div>
              <div className="bg-card/50 backdrop-blur rounded-xl p-6 border border-border">
                <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-green-600 bg-clip-text text-transparent mb-2">
                  85%
                </div>
                <div className="text-sm text-muted-foreground">Taux de matching</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
