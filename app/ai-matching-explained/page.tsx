import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, Sparkles, BarChart3, Layers, Zap } from "lucide-react"
import Link from "next/link"

export default function AiMatchingExplainedPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-background to-muted/30 py-20 border-b">
          <div className="container px-4 text-center space-y-6">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4">
              Intelligence Artificielle
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
              Le Matching IA <span className="text-primary">Nouvelle Génération</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Comment notre algorithme révolutionne le recrutement en analysant bien plus que des mots-clés pour trouver
              la compatibilité parfaite.
            </p>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20">
          <div className="container px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Au-delà du CV traditionnel</h2>
                <p className="text-lg text-muted-foreground">
                  Les méthodes traditionnelles se basent sur des mots-clés simples. Notre IA comprend le contexte, les
                  compétences transférables et le potentiel.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Analyse Sémantique</h3>
                      <p className="text-muted-foreground">
                        Compréhension profonde des descriptions de poste et des parcours, au-delà du simple texte.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Soft Skills & Culture</h3>
                      <p className="text-muted-foreground">
                        Évaluation de la compatibilité culturelle et des compétences comportementales.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Prédiction de Réussite</h3>
                      <p className="text-muted-foreground">
                        Modèles prédictifs basés sur l'historique des recrutements réussis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl -z-10" />
                <Card className="border-2 border-primary/10 bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Score de Compatibilité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Compétences Techniques</span>
                        <span className="text-primary">95%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary w-[95%]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Expérience</span>
                        <span className="text-primary">88%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary w-[88%]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Soft Skills</span>
                        <span className="text-primary">92%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary w-[92%]" />
                      </div>
                    </div>
                    <div className="pt-4 border-t flex justify-between items-center">
                      <span className="font-bold text-lg">Score Global</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        92%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-muted/30 py-20">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Le processus d'analyse</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Layers className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">1. Extraction</h3>
                  <p className="text-muted-foreground">
                    Notre moteur NLP extrait et structure les données de milliers de profils et d'offres en temps réel.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">2. Matching Vectoriel</h3>
                  <p className="text-muted-foreground">
                    Comparaison multidimensionnelle pour identifier les alignements parfaits, même non évidents.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold">3. Ranking</h3>
                  <p className="text-muted-foreground">
                    Classement dynamique des candidats avec explication détaillée du "pourquoi" pour le recruteur.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="container px-4">
            <h2 className="text-3xl font-bold mb-6">Découvrez votre potentiel</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Laissez notre IA analyser votre profil et vous proposer les opportunités que vous méritez vraiment.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary" asChild>
              <Link href="/signup">Créer mon profil gratuit</Link>
            </Button>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
