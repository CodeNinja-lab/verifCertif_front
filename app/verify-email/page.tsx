"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Briefcase, Mail, CheckCircle2, AlertCircle } from "lucide-react"

export default function VerifyEmailPage() {
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
    console.log("[v0] Verifying code:", code.join(""))
    setIsVerifying(false)
  }

  const handleResend = () => {
    console.log("[v0] Resending verification email")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="w-full max-w-md space-y-8">
        <Link href="/" className="flex items-center gap-2 group justify-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform group-hover:scale-105">
            <Briefcase className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TalentHub Pro
          </span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Vérifiez votre email</h1>
              <p className="text-muted-foreground text-sm">
                Nous avons envoyé un code de vérification à{" "}
                <span className="font-medium text-foreground">exemple@email.com</span>
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
                  <CheckCircle2 className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Vous n'avez pas reçu le code ?</p>
            <Button variant="ghost" onClick={handleResend} className="text-primary hover:text-primary/80">
              Renvoyer le code
            </Button>
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
