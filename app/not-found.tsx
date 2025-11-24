import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background px-4">
      <div className="mx-auto max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Page introuvable</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Peut-être cherchez-vous votre prochaine
            opportunité ?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-secondary to-primary">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/jobs">
              <Search className="mr-2 h-4 w-4" />
              Voir les offres
            </Link>
          </Button>
        </div>

        <div className="pt-8">
          <Button asChild variant="ghost">
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la page précédente
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
