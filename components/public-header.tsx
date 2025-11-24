"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Briefcase, Users, Building2, BarChart3, ChevronDown, GraduationCap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-4 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
            <div className="h-10 w-10 relative">
              <img src="/ucad-logo.png" alt="Logo UCAD" className="object-contain h-full w-full rounded-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              UCAD
            </span>
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
            href="/jobs"
            className="flex items-center gap-2 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            Offres d'emploi
          </Link>
          <Link
            href="/companies"
            className="flex items-center gap-2 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            <Building2 className="h-4 w-4" />
            Entreprises
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
              Solutions
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="rounded-xl bg-card border border-border shadow-xl p-2">
                <Link
                  href="/candidate"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-accent transition-colors"
                >
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Pour les candidats</div>
                    <div className="text-xs text-muted-foreground">Trouvez votre emploi idéal</div>
                  </div>
                </Link>
                <Link
                  href="/recruiter"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-accent transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-secondary" />
                  <div>
                    <div className="font-semibold text-sm">Pour les recruteurs</div>
                    <div className="text-xs text-muted-foreground">Trouvez les meilleurs talents</div>
                  </div>
                </Link>
                <Link
                  href="/university"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-accent transition-colors"
                >
                  <GraduationCap className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-semibold text-sm">Pour les universités</div>
                    <div className="text-xs text-muted-foreground">Certifiez vos diplômes</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <Link
            href="/about"
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            À propos
          </Link>
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
              href="/jobs"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
            >
              <Briefcase className="h-5 w-5" />
              Offres d'emploi
            </Link>
            <Link
              href="/companies"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
            >
              <Building2 className="h-5 w-5" />
              Entreprises
            </Link>
            <Link
              href="/candidate"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
            >
              <Users className="h-5 w-5" />
              Espace candidat
            </Link>
            <Link
              href="/recruiter"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
            >
              <BarChart3 className="h-5 w-5" />
              Espace recruteur
            </Link>
            <Link
              href="/university"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
            >
              <GraduationCap className="h-5 w-5" />
              Espace université
            </Link>
            <Link
              href="/about"
              className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
            >
              À propos
            </Link>
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
