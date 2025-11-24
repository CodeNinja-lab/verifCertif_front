import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-background via-muted/20 to-background py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
                Politique de Confidentialité
              </h1>
              <p className="text-muted-foreground">Dernière mise à jour : 24 novembre 2024</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl prose prose-slate dark:prose-invert">
              <h2>1. Introduction</h2>
              <p>
                TalentHub s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous
                collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme
                de recrutement.
              </p>

              <h2>2. Informations que nous collectons</h2>
              <p>Nous collectons différents types d'informations :</p>
              <ul>
                <li>
                  <strong>Informations de profil :</strong> nom, prénom, email, téléphone, expérience professionnelle,
                  formation, compétences
                </li>
                <li>
                  <strong>Données d'utilisation :</strong> pages visitées, actions effectuées, durée de navigation
                </li>
                <li>
                  <strong>Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation
                </li>
                <li>
                  <strong>Documents :</strong> CV, lettres de motivation, portfolios
                </li>
              </ul>

              <h2>3. Utilisation des données</h2>
              <p>Vos données sont utilisées pour :</p>
              <ul>
                <li>Créer et gérer votre compte</li>
                <li>Faciliter le matching entre candidats et recruteurs</li>
                <li>Améliorer nos services et votre expérience utilisateur</li>
                <li>Vous envoyer des notifications pertinentes</li>
                <li>Assurer la sécurité de la plateforme</li>
              </ul>

              <h2>4. Partage des données</h2>
              <p>
                Nous ne vendons jamais vos données personnelles. Vos informations peuvent être partagées avec les
                recruteurs uniquement lorsque vous postulez à une offre ou que vous acceptez d'être contacté.
              </p>

              <h2>5. Vos droits</h2>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul>
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition au traitement</li>
              </ul>

              <h2>6. Sécurité</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger
                vos données contre tout accès non autorisé, modification, divulgation ou destruction.
              </p>

              <h2>7. Contact</h2>
              <p>
                Pour toute question concernant cette politique de confidentialité, contactez-nous à privacy@talenthub.io
              </p>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
