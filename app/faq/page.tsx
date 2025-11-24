import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="bg-muted/30 py-16">
          <div className="container px-4 text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Questions Fréquentes</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur TalentHub, la certification blockchain et le matching IA.
            </p>
            <div className="max-w-md mx-auto relative mt-8">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une question..." className="pl-10 h-10" />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 max-w-3xl">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Général</h2>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Comment fonctionne TalentHub ?</AccordionTrigger>
                  <AccordionContent>
                    TalentHub est une plateforme de recrutement nouvelle génération qui utilise l'intelligence
                    artificielle pour connecter les candidats aux entreprises. Nous utilisons également la blockchain
                    pour certifier les diplômes et compétences, garantissant une transparence totale.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Est-ce gratuit pour les candidats ?</AccordionTrigger>
                  <AccordionContent>
                    Oui, l'inscription et l'utilisation de la plateforme sont entièrement gratuites pour les candidats.
                    Vous pouvez créer votre profil, postuler aux offres et faire certifier vos compétences sans frais.
                  </AccordionContent>
                </AccordionItem>
              </div>

              <div className="space-y-4 pt-8">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Certification Blockchain</h2>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Qu'est-ce que la certification numérique ?</AccordionTrigger>
                  <AccordionContent>
                    La certification numérique permet de valider l'authenticité de vos diplômes et compétences grâce à
                    la technologie blockchain. Chaque certification est unique, infalsifiable et vérifiable
                    instantanément.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Comment faire certifier mon diplôme ?</AccordionTrigger>
                  <AccordionContent>
                    Si votre université est partenaire de TalentHub, elle peut émettre directement votre diplôme
                    certifié sur la plateforme. Sinon, vous pouvez demander une certification individuelle via notre
                    processus de vérification.
                  </AccordionContent>
                </AccordionItem>
              </div>

              <div className="space-y-4 pt-8">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Matching IA</h2>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Comment fonctionne le score de compatibilité ?</AccordionTrigger>
                  <AccordionContent>
                    Notre IA analyse plus de 50 points de données (compétences techniques, soft skills, culture
                    d'entreprise, aspirations) pour calculer un score de compatibilité précis entre votre profil et
                    chaque offre d'emploi.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>Mes données sont-elles protégées ?</AccordionTrigger>
                  <AccordionContent>
                    Absolument. Nous utilisons un chiffrement de bout en bout et respectons strictement le RGPD. Vos
                    données personnelles ne sont partagées qu'avec votre consentement explicite lors d'une candidature.
                  </AccordionContent>
                </AccordionItem>
              </div>
            </Accordion>

            <div className="mt-16 text-center space-y-4 bg-muted/30 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold">Vous n'avez pas trouvé votre réponse ?</h3>
              <p className="text-muted-foreground">Notre équipe support est là pour vous aider.</p>
              <Button>Contacter le support</Button>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
