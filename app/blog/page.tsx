import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import Image from "next/image"

const articles = [
  {
    id: 1,
    title: "10 conseils pour réussir votre entretien d'embauche en 2024",
    excerpt:
      "Découvrez les meilleures stratégies pour impressionner les recruteurs et décrocher le poste de vos rêves.",
    category: "Candidats",
    author: "Sophie Martin",
    date: "15 Nov 2024",
    readTime: "5 min",
    image: "/professional-interview.jpg",
    trending: true,
  },
  {
    id: 2,
    title: "Comment rédiger un CV qui se démarque",
    excerpt: "Les erreurs à éviter et les bonnes pratiques pour créer un CV percutant qui attire l'attention.",
    category: "Candidats",
    author: "Thomas Dubois",
    date: "12 Nov 2024",
    readTime: "7 min",
    image: "/resume-writing-concept.png",
    trending: false,
  },
  {
    id: 3,
    title: "L'art du sourcing : trouver les meilleurs talents",
    excerpt: "Techniques avancées pour identifier et attirer les candidats les plus qualifiés pour votre entreprise.",
    category: "Recruteurs",
    author: "Marie Leroy",
    date: "10 Nov 2024",
    readTime: "6 min",
    image: "/talent-sourcing.jpg",
    trending: true,
  },
  {
    id: 4,
    title: "Les tendances du marché de l'emploi en 2024",
    excerpt: "Analyse des secteurs en croissance, des compétences recherchées et des évolutions salariales.",
    category: "Insights",
    author: "Jean Pierre",
    date: "8 Nov 2024",
    readTime: "8 min",
    image: "/job-market-trends.jpg",
    trending: true,
  },
  {
    id: 5,
    title: "Télétravail : négocier les meilleures conditions",
    excerpt: "Comment aborder le sujet du télétravail avec votre futur employeur et obtenir la flexibilité souhaitée.",
    category: "Candidats",
    author: "Lucas Bernard",
    date: "5 Nov 2024",
    readTime: "4 min",
    image: "/remote-work-setup.png",
    trending: false,
  },
  {
    id: 6,
    title: "Optimiser votre marque employeur sur les réseaux sociaux",
    excerpt: "Stratégies pour améliorer votre image et attirer plus de candidats qualifiés via les réseaux sociaux.",
    category: "Recruteurs",
    author: "Sophie Martin",
    date: "3 Nov 2024",
    readTime: "6 min",
    image: "/employer-branding.jpg",
    trending: false,
  },
]

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-background via-muted/20 to-background py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
                Blog & Ressources
              </h1>
              <p className="text-lg text-muted-foreground text-balance">
                Conseils d'experts, tendances du marché et guides pratiques pour candidats et recruteurs
              </p>
              <div className="flex justify-center pt-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher un article..." className="pl-10 h-11" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Tous
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Candidats
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Recruteurs
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Insights
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Guides
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card key={article.id} className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {article.trending && (
                      <div className="absolute right-3 top-3">
                        <Badge className="bg-gradient-to-r from-secondary to-primary">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Tendance
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-balance group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-accent bg-transparent">
                      Lire l'article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
