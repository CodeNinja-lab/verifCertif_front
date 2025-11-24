"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  X, 
  Briefcase, 
  Users, 
  Building2, 
  BarChart3, 
  ChevronDown, 
  GraduationCap,
  Shield,
  ScanLine,
  Sparkles,
  FileCheck,
  Brain
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-4 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3 group">
            <div className="h-11 w-11 relative flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ACADYS
              </span>
              <span className="text-[10px] text-muted-foreground font-medium -mt-1">
                Academic Digital System
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Ouvrir le menu principal</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          <Link
            href="/verify"
            className="flex items-center gap-2 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            <ScanLine className="h-4 w-4" />
            Vérifier un diplôme
          </Link>
          <Link
            href="/jobs"
            className="flex items-center gap-2 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            Offres d'emploi
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
              Plateformes
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="rounded-xl bg-card border border-border shadow-xl p-2">
                <Link
                  href="/candidate"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-accent transition-colors"
                >
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-semibold text-sm">Espace Étudiant</div>
                    <div className="text-xs text-muted-foreground">Profil & Matching IA</div>
                  </div>
                </Link>
                <Link
                  href="/recruiter"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-accent transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-semibold text-sm">Espace Recruteur</div>
                    <div className="text-xs text-muted-foreground">Talents vérifiés</div>
                  </div>
                </Link>
                <Link
                  href="/university"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-accent transition-colors"
                >
                  <GraduationCap className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-semibold text-sm">Espace Université</div>
                    <div className="text-xs text-muted-foreground">Certification numérique</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
              En savoir plus
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="rounded-xl bg-card border border-border shadow-xl p-2">
                <Link
                  href="/certification-explained"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-accent transition-colors"
                >
                  <FileCheck className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Certification numérique</div>
                    <div className="text-xs text-muted-foreground">Comment ça marche</div>
                  </div>
                </Link>
                <Link
                  href="/ai-matching-explained"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-accent transition-colors"
                >
                  <Brain className="h-5 w-5 text-secondary" />
                  <div>
                    <div className="font-semibold text-sm">Matching IA</div>
                    <div className="text-xs text-muted-foreground">Notre technologie</div>
                  </div>
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-accent transition-colors"
                >
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-semibold text-sm">À propos</div>
                    <div className="text-xs text-muted-foreground">Notre mission</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3 lg:items-center">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
            <Link href="/signup">Créer un compte</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 px-4 pb-6 pt-2">
            <Link
              href="/verify"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
            >
              <ScanLine className="h-5 w-5" />
              Vérifier un diplôme
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
            >
              <Briefcase className="h-5 w-5" />
              Offres d'emploi
            </Link>
            <div className="border-t border-border my-2 pt-2">
              <div className="text-xs font-semibold text-muted-foreground px-3 py-2">PLATEFORMES</div>
              <Link
                href="/candidate"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
              >
                <Users className="h-5 w-5 text-blue-500" />
                Espace Étudiant
              </Link>
              <Link
                href="/recruiter"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
              >
                <BarChart3 className="h-5 w-5 text-green-500" />
                Espace Recruteur
              </Link>
              <Link
                href="/university"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
              >
                <GraduationCap className="h-5 w-5 text-purple-500" />
                Espace Université
              </Link>
            </div>
            <div className="border-t border-border my-2 pt-2">
              <div className="text-xs font-semibold text-muted-foreground px-3 py-2">EN SAVOIR PLUS</div>
              <Link
                href="/certification-explained"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
              >
                <FileCheck className="h-5 w-5" />
                Certification numérique
              </Link>
              <Link
                href="/ai-matching-explained"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
              >
                <Brain className="h-5 w-5" />
                Matching IA
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
              >
                <Sparkles className="h-5 w-5" />
                À propos
              </Link>
            </div>
            <div className="pt-4 space-y-2">
              <div className="flex justify-center pb-2">
                <ThemeToggle />
              </div>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary" asChild>
                <Link href="/signup">Créer un compte</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
