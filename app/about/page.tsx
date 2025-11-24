import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Award, Users, Briefcase, TrendingUp, Target, Heart, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-background via-muted/20 to-background py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
                Notre Mission : Connecter les Talents
              </h1>
              <p className="text-lg text-muted-foreground text-balance">
                Nous transformons le recrutement en créant des opportunités qui changent des vies
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Qui sommes-nous ?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  TalentHub est née d'une vision simple : rendre le recrutement plus humain, plus efficace et plus
                  accessible. Fondée en 2020, notre plateforme a déjà aidé plus de 50,000 candidats à trouver leur
                  prochain défi professionnel et permis à 5,000 entreprises de rencontrer leurs talents idéaux.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Nous croyons que chaque personne mérite une opportunité qui correspond vraiment à ses aspirations, et
                  que chaque entreprise mérite des talents qui partagent ses valeurs. C'est pourquoi nous avons
                  développé une technologie d'IA avancée pour créer des matches parfaits.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-secondary to-primary">
                  Rejoignez l'aventure
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary text-white mb-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm text-muted-foreground">Candidats actifs</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary text-white mb-4">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold">5K+</div>
                    <div className="text-sm text-muted-foreground">Entreprises partenaires</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary text-white mb-4">
                      <Award className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-sm text-muted-foreground">Taux de satisfaction</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary text-white mb-4">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold">2x</div>
                    <div className="text-sm text-muted-foreground">Plus rapide</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/30 py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Nos Valeurs</h2>
              <p className="text-muted-foreground">Les principes qui guident chacune de nos actions</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary text-white">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Excellence</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nous visons l'excellence dans chaque fonctionnalité, chaque interaction et chaque résultat pour nos
                    utilisateurs.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary text-white">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Humanité</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Derrière chaque profil se cache une personne avec des rêves. Nous plaçons l'humain au cœur de notre
                    technologie.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary text-white">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Innovation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nous repoussons constamment les limites de la technologie pour créer l'expérience de recrutement du
                    futur.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-secondary/20 via-primary/20 to-background border p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Prêt à transformer votre carrière ?</h2>
              <p className="text-muted-foreground text-balance">
                Rejoignez des milliers de professionnels qui ont déjà trouvé leur opportunité idéale sur TalentHub
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-secondary to-primary">
                  Je suis candidat
                </Button>
                <Button size="lg" variant="outline">
                  Je recrute
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
