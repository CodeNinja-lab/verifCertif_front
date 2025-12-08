"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Briefcase, Shield, Smartphone, AlertCircle } from "lucide-react"

export default function TwoFactorPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    setError("")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("[v0] Verifying 2FA code:", code.join(""))
    setIsVerifying(false)
  }

  const handleBackupCode = () => {
    console.log("[v0] Using backup code")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="w-full max-w-md space-y-8">
        <Link href="/" className="flex items-center gap-2 group justify-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform group-hover:scale-105">
            <Briefcase className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ACADYS
          </span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Authentification à deux facteurs</h1>
              <p className="text-muted-foreground text-sm">
                Entrez le code de vérification généré par votre application d'authentification
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2 justify-center">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-bold"
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              onClick={handleVerify}
              disabled={isVerifying || code.some((d) => !d)}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              {isVerifying ? (
                <>
                  <span className="mr-2">Vérification...</span>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </>
              ) : (
                <>
                  Vérifier
                  <Shield className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Problème d'accès ?</span>
              </div>
            </div>

            <Button variant="outline" onClick={handleBackupCode} className="w-full bg-transparent">
              <Smartphone className="mr-2 h-4 w-4" />
              Utiliser un code de secours
            </Button>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground text-center">
              Assurez-vous que l'heure de votre appareil est correcte pour générer des codes valides
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}
