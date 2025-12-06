import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-background via-muted/20 to-background py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
                Conditions Générales d'Utilisation
              </h1>
              <p className="text-muted-foreground">Dernière mise à jour : 24 novembre 2024</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl prose prose-slate dark:prose-invert">
              <h2>1. Acceptation des conditions</h2>
              <p>
                En accédant et en utilisant TalentHub, vous acceptez d'être lié par les présentes conditions générales
                d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
              </p>

              <h2>2. Description du service</h2>
              <p>
                TalentHub est une plateforme de recrutement en ligne qui connecte les candidats à la recherche
                d'opportunités professionnelles avec des recruteurs et des entreprises à la recherche de talents.
              </p>

              <h2>3. Inscription et compte utilisateur</h2>
              <ul>
                <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
                <li>Vous devez fournir des informations exactes et à jour</li>
                <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                <li>Un compte par personne ou entreprise</li>
              </ul>

              <h2>4. Utilisation acceptable</h2>
              <p>Vous vous engagez à :</p>
              <ul>
                <li>Ne pas publier de contenu frauduleux, trompeur ou illégal</li>
                <li>Respecter les autres utilisateurs</li>
                <li>Ne pas utiliser la plateforme à des fins de spam ou de harcèlement</li>
                <li>Ne pas tenter d'accéder de manière non autorisée à nos systèmes</li>
              </ul>

              <h2>5. Propriété intellectuelle</h2>
              <p>
                Tous les contenus, designs, logos et marques présents sur TalentHub sont la propriété de TalentHub ou de
                ses concédants de licence. Vous ne pouvez pas les utiliser sans autorisation écrite préalable.
              </p>

              <h2>6. Responsabilité</h2>
              <p>
                TalentHub agit comme intermédiaire entre candidats et recruteurs. Nous ne sommes pas responsables de la
                qualité des offres d'emploi, de l'exactitude des informations des candidats, ni des résultats des
                processus de recrutement.
              </p>

              <h2>7. Résiliation</h2>
              <p>
                Nous nous réservons le droit de suspendre ou de supprimer votre compte en cas de violation de ces
                conditions générales d'utilisation.
              </p>

              <h2>8. Modifications</h2>
              <p>
                Nous pouvons modifier ces conditions à tout moment. Les modifications seront effectives dès leur
                publication sur la plateforme.
              </p>

              <h2>9. Droit applicable</h2>
              <p>
                Ces conditions sont régies par le droit sénégalais. Tout litige sera soumis à la juridiction exclusive des
                tribunaux de Dakar.
              </p>

              <h2>10. Contact</h2>
              <p>Pour toute question concernant ces conditions, contactez-nous à legal@talenthub.io</p>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
