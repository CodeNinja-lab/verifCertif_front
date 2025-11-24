import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Users,
  Sparkles,
  Shield,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Target,
  BarChart3,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10">
          <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="animate-slide-in-up">
                <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Matching IA Nouvelle Génération
                </Badge>
                <h1 className="text-5xl font-bold tracking-tight lg:text-7xl text-balance mb-6">
                  Trouvez le{" "}
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                    talent parfait
                  </span>{" "}
                  en quelques clics
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8 text-pretty">
                  La plateforme de recrutement premium qui révolutionne la connexion entre talents exceptionnels et
                  entreprises innovantes. Intelligence artificielle, processus optimisé, résultats garantis.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg h-14 px-8"
                    asChild
                  >
                    <Link href="/signup">
                      Commencer gratuitement
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-transparent" asChild>
                    <Link href="/jobs">Explorer les offres</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-8 mt-10">
                  <div>
                    <div className="text-3xl font-bold text-primary">50K+</div>
                    <div className="text-sm text-muted-foreground">Offres actives</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold text-secondary">120K+</div>
                    <div className="text-sm text-muted-foreground">Candidats inscrits</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold text-primary">98%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in">
                <div className="absolute -top-4 -right-4 h-72 w-72 bg-primary/20 rounded-full blur-3xl animate-float" />
                <div
                  className="absolute -bottom-4 -left-4 h-72 w-72 bg-secondary/20 rounded-full blur-3xl animate-float"
                  style={{ animationDelay: "3s" }}
                />
                <div className="relative">
                  <img
                    src="/modern-job-search-dashboard-interface.jpg"
                    alt="TalentHub Dashboard"
                    className="rounded-2xl shadow-2xl border border-border"
                  />
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
                Fonctionnalités Premium
              </Badge>
              <h2 className="text-4xl font-bold mb-4 text-balance">Une plateforme pensée pour votre succès</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Des outils professionnels de pointe pour simplifier et accélérer vos recrutements
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Sparkles,
                  title: "Matching IA Intelligent",
                  description:
                    "Notre algorithme analyse compétences, expériences et préférences pour des recommandations ultra-précises.",
                  color: "text-primary",
                },
                {
                  icon: Search,
                  title: "Filtres Avancés",
                  description:
                    "Recherche multicritères sophistiquée : localisation, salaire, télétravail, compétences techniques...",
                  color: "text-secondary",
                },
                {
                  icon: Clock,
                  title: "Gain de Temps",
                  description:
                    "Réduisez votre temps de recrutement de 70% grâce à notre processus optimisé et automatisé.",
                  color: "text-primary",
                },
                {
                  icon: Shield,
                  title: "Vérification Profils",
                  description:
                    "Tous les profils sont vérifiés et validés pour garantir authenticité et professionnalisme.",
                  color: "text-secondary",
                },
                {
                  icon: BarChart3,
                  title: "Analytics Avancés",
                  description:
                    "Tableaux de bord complets avec métriques temps réel et insights pour optimiser vos performances.",
                  color: "text-primary",
                },
                {
                  icon: Zap,
                  title: "Notifications Temps Réel",
                  description: "Restez informé instantanément : nouvelles candidatures, messages, matchs parfaits...",
                  color: "text-secondary",
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
                Processus Simplifié
              </Badge>
              <h2 className="text-4xl font-bold mb-4 text-balance">Comment ça fonctionne ?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Trois étapes simples pour transformer votre recherche d'emploi ou vos recrutements
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Créez votre profil",
                  description:
                    "Remplissez votre profil complet en quelques minutes. CV, compétences, préférences... Notre interface intuitive vous guide à chaque étape.",
                  icon: Users,
                },
                {
                  step: "02",
                  title: "IA trouve les matchs",
                  description:
                    "Notre intelligence artificielle analyse votre profil et identifie automatiquement les meilleures opportunités ou candidats selon vos critères.",
                  icon: Sparkles,
                },
                {
                  step: "03",
                  title: "Connectez et recrutez",
                  description:
                    "Communiquez directement via notre messagerie sécurisée, planifiez des entretiens et finalisez vos recrutements en toute simplicité.",
                  icon: Target,
                },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  {idx < 2 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
                  )}
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6">
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
              {/* Candidates */}
              <Card className="p-8 lg:p-10 border-2 hover:border-primary/50 transition-colors">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Pour les candidats</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Accédez aux meilleures opportunités et boostez votre carrière
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Recommandations personnalisées par IA",
                    "Profil visible par 10,000+ recruteurs",
                    "Alertes emploi en temps réel",
                    "CV builder professionnel",
                    "Préparation entretiens & conseils carrière",
                    "Suivi candidatures centralisé",
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary" size="lg" asChild>
                  <Link href="/candidate">
                    Créer mon profil candidat
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </Card>

              {/* Recruiters */}
              <Card className="p-8 lg:p-10 border-2 hover:border-secondary/50 transition-colors">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 mb-6">
                  <Building2 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Pour les recruteurs</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Trouvez les talents parfaits et accélérez vos recrutements
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Matching intelligent candidats qualifiés",
                    "Base de 120,000+ profils vérifiés",
                    "Gestion simplifiée des candidatures",
                    "Analytics & reporting avancés",
                    "Branding employeur premium",
                    "Support dédié & accompagnement",
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-secondary to-primary" size="lg" asChild>
                  <Link href="/recruiter">
                    Commencer à recruter
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </Card>

              {/* Universities */}
              <Card className="p-8 lg:p-10 border-2 hover:border-purple-500/50 transition-colors">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 mb-6">
                  <GraduationCap className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Pour les universités</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Certifiez et sécurisez vos diplômes avec la blockchain
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Certification blockchain sécurisée",
                    "Vérification instantanée des diplômes",
                    "Gestion centralisée des étudiants",
                    "Hash cryptographique unique",
                    "QR codes de vérification",
                    "Lutte contre la fraude",
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500" size="lg" asChild>
                  <Link href="/university">
                    Accéder au portail université
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20">
                Témoignages
              </Badge>
              <h2 className="text-4xl font-bold mb-4 text-balance">Ils nous font confiance</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Découvrez comment TalentHub Pro transforme les carrières et les recrutements
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Sophie Martin",
                  role: "Développeuse Full-Stack",
                  company: "Passée chez TechCorp",
                  content:
                    "J'ai trouvé mon emploi de rêve en moins de 2 semaines. Le matching IA est incroyablement précis et m'a proposé exactement ce que je cherchais.",
                  rating: 5,
                },
                {
                  name: "Thomas Dubois",
                  role: "Directeur RH",
                  company: "InnovateLabs",
                  content:
                    "Nous avons réduit notre temps de recrutement de 60%. La qualité des candidats proposés est exceptionnelle. Un outil indispensable.",
                  rating: 5,
                },
                {
                  name: "Marie Leclerc",
                  role: "Data Scientist",
                  company: "Embauchée chez DataFlow",
                  content:
                    "Interface intuitive, processus fluide, résultats rapides. TalentHub Pro dépasse largement les autres plateformes que j'ai essayées.",
                  rating: 5,
                },
              ].map((testimonial, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
                Prêt à transformer votre carrière ou vos recrutements ?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto text-pretty">
                Rejoignez 120,000+ professionnels qui ont déjà fait le choix de l'excellence
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" className="text-lg h-14 px-8" asChild>
                  <Link href="/signup">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg h-14 px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/contact">Demander une démo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
