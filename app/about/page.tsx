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
                ACADYS : Academic Digital System
              </h1>
              <p className="text-lg text-muted-foreground text-balance">
                Révolutionner la certification académique et le recrutement grâce à la blockchain
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
                  ACADYS est une plateforme innovante qui combine la certification numérique des diplômes via la blockchain 
                  et le matching intelligent entre étudiants et recruteurs. Notre mission est de garantir l'authenticité 
                  des diplômes tout en facilitant l'insertion professionnelle des jeunes diplômés.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Nous croyons en un monde où chaque diplôme est vérifiable instantanément, où la fraude académique n'existe plus, 
                  et où chaque talent trouve l'opportunité qui correspond à ses compétences réelles. C'est pourquoi nous avons 
                  développé une solution complète alliant sécurité blockchain et intelligence artificielle.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600">
                  Rejoignez l'aventure
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm text-muted-foreground">Étudiants inscrits</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm text-muted-foreground">Entreprises partenaires</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4">
                      <Award className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold">100%</div>
                    <div className="text-sm text-muted-foreground">Diplômes sécurisés</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold">5+</div>
                    <div className="text-sm text-muted-foreground">Universités partenaires</div>
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Sécurité</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    La blockchain garantit l'authenticité et l'intégrité de chaque diplôme certifié sur notre plateforme.
                    Vos données académiques sont protégées et infalsifiables.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Transparence</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nous croyons en la transparence totale. Chaque vérification de diplôme est traçable et 
                    chaque matching est expliqué pour comprendre les recommandations.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Innovation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    En combinant blockchain et intelligence artificielle, nous créons une solution unique qui 
                    révolutionne la certification académique et le recrutement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-600/20 to-background border p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Rejoignez la révolution numérique</h2>
              <p className="text-muted-foreground text-balance">
                Que vous soyez étudiant, recruteur ou université, ACADYS vous accompagne dans votre transformation digitale
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600">
                  Je suis étudiant
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
