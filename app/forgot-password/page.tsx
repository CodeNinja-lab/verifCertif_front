"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Logo } from "@/components/logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("[v0] Password reset requested for:", email)
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="w-full max-w-md space-y-8">
          <Logo href="/" size="lg" className="justify-center" />

          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl text-center space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <CheckCircle2 className="h-8 w-8 text-secondary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Email envoyé !</h1>
              <p className="text-muted-foreground">
                Nous avons envoyé un lien de réinitialisation à{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4 text-left">
              <p className="text-sm text-muted-foreground">
                Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier spam ou{" "}
                <button onClick={() => setIsSubmitted(false)} className="text-primary hover:underline font-medium">
                  réessayez
                </button>
                .
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="w-full max-w-md space-y-8">
        <Logo href="/" size="lg" className="justify-center" />

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Mot de passe oublié ?</h1>
            <p className="text-muted-foreground text-sm">
              Pas de problème. Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  className="pl-10 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Envoi en cours...</span>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </>
              ) : (
                <>
                  Envoyer le lien
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <Button variant="ghost" asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
