import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  FileCheck,
  Brain,
  ScanLine,
  Lock,
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
  Sparkles,
  Target,
  BarChart3,
  GraduationCap,
  Award,
  Fingerprint,
  Briefcase,
  TrendingUp,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { UniversityLogo } from "@/components/university-logo"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="animate-slide-in-up space-y-8">
                <div>
                  <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-sm px-4 py-1.5">
                    <Shield className="mr-2 h-4 w-4" />
                    Certification Blockchain & IA
                  </Badge>
                  <h1 className="text-5xl font-bold tracking-tight lg:text-7xl text-balance leading-tight">
                    Sécurisez vos{" "}
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      diplômes
                    </span>{" "}
                    <br />avec la blockchain
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  ACADYS révolutionne la certification académique avec une infrastructure cryptographique sécurisée, 
                  un matching IA intelligent et une vérification publique instantanée.
                </p>
                <div>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 h-14 px-8 text-base shadow-lg" asChild>
                    <Link href="/verify">
                      <ScanLine className="mr-2 h-5 w-5" />
                      Vérifier un diplôme
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground mt-1">Diplômes certifiés</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground mt-1">Universités</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground mt-1">Sécurisé</div>
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in">
                <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
                <div
                  className="absolute -bottom-10 -left-10 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-primary/20 rounded-full blur-3xl animate-pulse"
                  style={{ animationDelay: "2s" }}
                />
                <div className="relative">
                  <div className="-mt-100">
                    <img 
                      src="/hero-acadys.png" 
                      alt="ACADYS - Plateforme de certification académique" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20">
                Technologies de pointe
              </Badge>
              <h2 className="text-4xl font-bold mb-4 text-balance">Une plateforme complète et sécurisée</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Certification cryptographique, intelligence artificielle et vérification publique réunis
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Shield,
                  title: "Certification Blockchain",
                  description:
                    "Signature numérique SHA-256 + Ed25519 avec ancrage blockchain pour une sécurité maximale et une traçabilité totale.",
                  color: "text-primary",
                },
                {
                  icon: ScanLine,
                  title: "QR Code de Vérification",
                  description:
                    "Chaque diplôme génère un QR code unique permettant une vérification instantanée et publique de l'authenticité.",
                  color: "text-secondary",
                },
                {
                  icon: Brain,
                  title: "Matching IA Intelligent",
                  description:
                    "Extraction automatique des compétences via NLP et correspondance intelligente avec les offres d'emploi.",
                  color: "text-primary",
                },
                {
                  icon: Fingerprint,
                  title: "Hash Cryptographique",
                  description:
                    "Chaque document possède une empreinte unique et infalsifiable garantissant son intégrité à vie.",
                  color: "text-primary",
                },
                {
                  icon: BarChart3,
                  title: "Analytics en Temps Réel",
                  description:
                    "Tableaux de bord dynamiques avec indicateurs de certification, vérifications et tendances du marché.",
                  color: "text-primary",
                },
                {
                  icon: Lock,
                  title: "Conformité RGPD",
                  description: "Protection des données personnelles, consentement explicite et droit à l'oubli respectés.",
                  color: "text-primary",
                },
              ].map((feature, idx) => (
                <Card
                  key={idx}
                  className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br from-${feature.color === "text-primary" ? "primary" : "secondary"}/10 to-${feature.color === "text-primary" ? "primary" : "secondary"}/5 mb-4`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Processus de Certification
              </Badge>
              <h2 className="text-4xl font-bold mb-4 text-balance">Comment fonctionne la certification ?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Un processus cryptographique sécurisé en trois étapes simples
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Émission du diplôme",
                  description:
                    "L'université téléverse le document officiel. Le système calcule automatiquement son hash SHA-256 et le signe avec une clé privée Ed25519.",
                  icon: FileCheck,
                },
                {
                  step: "02",
                  title: "Génération QR Code",
                  description:
                    "Un QR code unique est généré et apposé sur le diplôme. Le hash est ancré sur la blockchain pour garantir l'antériorité et l'immuabilité.",
                  icon: ScanLine,
                },
                {
                  step: "03",
                  title: "Vérification publique",
                  description:
                    "Toute personne peut scanner le QR code ou soumettre le document pour vérifier instantanément son authenticité et consulter les métadonnées.",
                  icon: Shield,
                },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  {idx < 2 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
                  )}
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-6">
                      <step.icon className="h-12 w-12 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -left-2 text-6xl font-bold text-primary/10">{step.step}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Split */}
        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Students */}
              <Card className="p-8 lg:p-10 border-2 hover:border-primary/50 transition-colors">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Espace Étudiant</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Valorisez vos compétences et trouvez les meilleures opportunités
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Profil enrichi automatiquement",
                    "Extraction IA des compétences (NLP)",
                    "Matching intelligent avec offres",
                    "Diplômes certifiés blockchain",
                    "Notifications ciblées personnalisées",
                    "Portfolio de compétences visualisé",
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80" size="lg" asChild>
                  <Link href="/candidate">
                    Créer mon profil étudiant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </Card>

              {/* Recruiters */}
              <Card className="p-8 lg:p-10 border-2 hover:border-primary/40 transition-colors">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 mb-6">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Espace Recruteur</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Accédez à des talents vérifiés avec diplômes authentifiés
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Profils avec diplômes certifiés",
                    "Vérification instantanée blockchain",
                    "Matching IA compétences-offres",
                    "Analytics et reporting temps réel",
                    "Messagerie intégrée sécurisée",
                    "Détection automatique compétences",
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-primary/90 to-primary/70" size="lg" asChild>
                  <Link href="/recruiter">
                    Accéder à l'espace recruteur
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </Card>

              {/* Universities */}
              <Card className="p-8 lg:p-10 border-2 hover:border-primary/60 transition-colors">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Espace Université</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Émettez et gérez des diplômes numériques sécurisés
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Certification SHA-256 + Ed25519",
                    "Génération QR codes uniques",
                    "Ancrage blockchain immutable",
                    "Tableau de bord analytique",
                    "Gestion étudiants centralisée",
                    "Conformité RGPD & eIDAS",
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-primary to-primary/60" size="lg" asChild>
                  <Link href="/university">
                    Accéder au portail université
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Impact & Performance
              </Badge>
              <h2 className="text-4xl font-bold mb-4 text-balance">ACADYS en chiffres</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                La confiance des institutions académiques et professionnelles
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Award,
                  value: "10,000+",
                  label: "Diplômes certifiés",
                  description: "Documents académiques sécurisés",
                  color: "text-primary",
                },
                {
                  icon: GraduationCap,
                  value: "50+",
                  label: "Universités partenaires",
                  description: "Établissements de confiance",
                  color: "text-primary",
                },
                {
                  icon: TrendingUp,
                  value: "95%",
                  label: "Taux de matching",
                  description: "Précision de l'IA",
                  color: "text-primary",
                },
                {
                  icon: Clock,
                  value: "< 2 sec",
                  label: "Vérification instantanée",
                  description: "Via QR code ou URL",
                  color: "text-primary",
                },
              ].map((stat, idx) => (
                <Card key={idx} className="p-6 text-center hover:shadow-lg transition-all duration-300 border-border/50">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-4">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                  <div className="text-lg font-semibold mb-1">{stat.label}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Universités Partenaires Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-primary-foreground">
                Universités Partenaires au Sénégal
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Les grandes institutions académiques qui font confiance à ACADYS
              </p>
            </div>

            <div className="relative overflow-hidden">
              <div className="flex animate-scroll">
                {/* Premier groupe */}
                {[
                  { name: "UCAD", logo: "/logos/ucad.png", color: "text-sky-500" },
                  { name: "UADB", logo: "/logos/uadb.png", color: "text-blue-600" },
                  { name: "UIDT", logo: "/logos/uidt.png", color: "text-blue-700" },
                  { name: "UGB", logo: "/logos/ugb.png", color: "text-orange-600" },
                  { name: "USSEIN", logo: "/logos/ussein.png", color: "text-lime-600" },
                  { name: "UASZ", logo: "/logos/uasz.png", color: "text-green-600" },
                  { name: "UAM", logo: "/logos/uam.png", color: "text-sky-400" },
                ].map((university, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3 group flex-shrink-0 mx-8">
                    <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                      <UniversityLogo 
                        src={university.logo}
                        alt={`${university.name} Logo`}
                        fallbackColor={university.color}
                      />
                    </div>
                    <span className="text-sm font-semibold text-primary-foreground">{university.name}</span>
                  </div>
                ))}
                {/* Duplication pour effet infini */}
                {[
                  { name: "UCAD", logo: "/logos/ucad.png", color: "text-sky-500" },
                  { name: "UADB", logo: "/logos/uadb.png", color: "text-blue-600" },
                  { name: "UIDT", logo: "/logos/uidt.png", color: "text-blue-700" },
                  { name: "UGB", logo: "/logos/ugb.png", color: "text-orange-600" },
                  { name: "USSEIN", logo: "/logos/ussein.png", color: "text-lime-600" },
                  { name: "UASZ", logo: "/logos/uasz.png", color: "text-green-600" },
                  { name: "UAM", logo: "/logos/uam.png", color: "text-sky-400" },
                ].map((university, idx) => (
                  <div key={`duplicate-${idx}`} className="flex flex-col items-center gap-3 group flex-shrink-0 mx-8">
                    <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                      <UniversityLogo 
                        src={university.logo}
                        alt={`${university.name} Logo`}
                        fallbackColor={university.color}
                      />
                    </div>
                    <span className="text-sm font-semibold text-primary-foreground">{university.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-primary-foreground/70 max-w-5xl mx-auto leading-relaxed">
                <span className="font-semibold">UCAD</span> - Université Cheikh Anta Diop (Dakar) • 
                <span className="font-semibold"> UADB</span> - Université Alioune Diop de Bambey • 
                <span className="font-semibold"> UIDT</span> - Université Iba Der Thiam de Thiès • 
                <span className="font-semibold"> UGB</span> - Université Gaston Berger (Saint-Louis) • 
                <span className="font-semibold"> USSEIN</span> - Université du Sine Saloum El-Hâdj Ibrahima Niass (Kaolack) • 
                <span className="font-semibold"> UASZ</span> - Université Assane Seck (Ziguinchor) • 
                <span className="font-semibold"> UAM</span> - Université Amadou Mahtar Mbow (Dakar)
              </p>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
