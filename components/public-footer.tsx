import Link from "next/link"
import { Briefcase, Linkedin, Twitter, Facebook, Instagram, Mail } from "lucide-react"
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
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TalentHub Pro
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              La plateforme premium de recrutement qui connecte les meilleurs talents avec les entreprises innovantes.
              Matching intelligent par IA, processus simplifié, résultats garantis.
            </p>
            <div className="flex gap-3">
              <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-5 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold mb-4">Candidats</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Rechercher un emploi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/candidate/profile"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Créer un profil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/companies"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Explorer les entreprises
                  </Link>
                </li>
                <li>
                  <Link
                    href="/candidate/resources"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Ressources carrière
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Recruteurs</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/recruiter/post-job"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Poster une offre
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recruiter/search"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Trouver des candidats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recruiter/features"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Fonctionnalités
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certification-explained"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Certification Blockchain
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
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Carrières
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold mb-4">Restez informé</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recevez nos dernières offres et conseils carrière directement dans votre boîte mail.
            </p>
            <form className="flex gap-2 mb-4">
              <Input type="email" placeholder="votre@email.com" className="flex-1" />
              <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              En vous inscrivant, vous acceptez notre politique de confidentialité.
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-muted-foreground">© {currentYear} TalentHub Pro. Tous droits réservés.</p>
            <div className="flex flex-wrap gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
              <Link href="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
