import Link from "next/link"
import { Shield, Linkedin, Twitter, Facebook, Instagram, Mail, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Brand section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ACADYS
                </span>
                <span className="text-[10px] text-muted-foreground font-medium -mt-1">
                  Academic Digital System
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Plateforme intelligente de certification numérique et de valorisation des documents académiques. 
              Sécurité blockchain, matching IA et vérification publique instantanée.
            </p>
            <div className="flex gap-3">
              <Button size="icon" variant="outline" className="rounded-full bg-transparent" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-5 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold mb-4">Étudiants</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/candidate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Espace étudiant
                  </Link>
                </li>
                <li>
                  <Link
                    href="/candidate/profile"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Mon profil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/candidate/matching"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Matching IA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jobs"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Offres d'emploi
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Recruteurs</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/recruiter"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Espace recruteur
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recruiter/candidates"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Candidats vérifiés
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recruiter/jobs"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Gérer mes offres
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recruiter/analytics"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Analytiques
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Universités</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/university" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Espace université
                  </Link>
                </li>
                <li>
                  <Link href="/university/certifications" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Certifier diplômes
                  </Link>
                </li>
                <li>
                  <Link href="/university/students" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Gérer étudiants
                  </Link>
                </li>
                <li>
                  <Link
                    href="/verify"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Vérifier diplôme
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Additional links section */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold mb-4">En savoir plus</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  À propos d'ACADYS
                </Link>
              </li>
              <li>
                <Link
                  href="/certification-explained"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Certification blockchain
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-matching-explained"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Matching IA
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter removed - replaced with security badge */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <span>Certification SHA-256 + Ed25519 | Conformité RGPD</span>
            </div>

            <div className="flex flex-wrap gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-muted-foreground">
              © {currentYear} ACADYS - Academic Digital System. Tous droits réservés.
            </p>
            <p className="text-xs text-muted-foreground">
              Développé avec ❤️ pour la modernisation de l'enseignement supérieur
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
