import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Database, FileCheck, Lock, Globe, QrCode } from "lucide-react"
import Link from "next/link"

export default function CertificationExplainedPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-muted/20 to-background py-20 border-b">
          <div className="container px-4 text-center space-y-6">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-4">
              Nouvelle Technologie
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              La Certification Numérique
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Sécurisez votre avenir professionnel grâce à la technologie Blockchain. Des diplômes infalsifiables et
              instantanément vérifiables.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
                Certifier un diplôme
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/verify">Vérifier une certification</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it works steps */}
        <section className="py-20">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Comment ça marche ?</h2>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -z-10" />

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center relative z-10">
                  <FileCheck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">1. Émission</h3>
                <p className="text-muted-foreground">
                  L'université ou l'organisme de formation émet le diplôme numérique. Une empreinte unique (hash) est
                  générée.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center relative z-10">
                  <Database className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">2. Ancrage Blockchain</h3>
                <p className="text-muted-foreground">
                  L'empreinte du diplôme est inscrite de manière immuable sur la blockchain. Elle devient impossible à
                  modifier ou falsifier.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center relative z-10">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">3. Vérification</h3>
                <p className="text-muted-foreground">
                  Recruteurs et tiers peuvent vérifier l'authenticité instantanément via un QR code ou le fichier du
                  diplôme.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="bg-muted/30 py-20">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Les avantages</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Infalsifiable</h3>
                  <p className="text-muted-foreground">
                    La cryptographie avancée garantit que le document n'a jamais été altéré depuis son émission.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Universel</h3>
                  <p className="text-muted-foreground">
                    Vérifiable partout dans le monde, sans avoir besoin de contacter l'université émettrice.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Instantané</h3>
                  <p className="text-muted-foreground">
                    Fini les délais de vérification de background check. La validation se fait en quelques
                    millisecondes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container px-4 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12 max-w-4xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">Prêt à sécuriser vos diplômes ?</h2>
              <p className="text-lg text-muted-foreground">
                Rejoignez les universités et entreprises innovantes qui font confiance à notre technologie.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
                Commencer maintenant
              </Button>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
