import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Politique de Confidentialité - SteelCat',
  description: 'Politique de confidentialité et protection des données de SteelCat',
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-black mb-8">
            Politique de Confidentialité
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <p className="text-gray-700 leading-relaxed mb-6">
                Chez SteelCat, nous accordons une grande importance à la
                protection de vos données personnelles. Cette politique de
                confidentialité vous informe sur la manière dont nous collectons,
                utilisons et protégeons vos données conformément au Règlement
                Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                1. Responsable du traitement
              </h2>
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>SteelCat SAS</strong>
                </p>
                <p>123 Rue du Commerce, 75001 Paris, France</p>
                <p>
                  Email :{' '}
                  <a
                    href="mailto:dpo@steelcat.fr"
                    className="text-black font-semibold hover:underline"
                  >
                    dpo@steelcat.fr
                  </a>
                </p>
                <p>Téléphone : 01 23 45 67 89</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                2. Données collectées
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous collectons les données personnelles suivantes :
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    2.1 Données de commande
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse de livraison</li>
                    <li>Historique de commandes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    2.2 Données de navigation
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Adresse IP</li>
                    <li>Type de navigateur</li>
                    <li>Pages visitées</li>
                    <li>Durée de visite</li>
                    <li>Données de cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    2.3 Données de paiement
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Les données de paiement (numéro de carte bancaire, etc.) sont
                    directement traitées par notre prestataire de paiement Stripe
                    et ne sont jamais stockées sur nos serveurs.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                3. Finalités du traitement
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vos données sont collectées pour les finalités suivantes :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Traitement et gestion de vos commandes</li>
                <li>Livraison des produits commandés</li>
                <li>Service client et support</li>
                <li>Gestion des retours et remboursements</li>
                <li>Envoi d&apos;emails de confirmation et de suivi</li>
                <li>Respect de nos obligations légales et comptables</li>
                <li>Amélioration de nos services</li>
                <li>
                  Communications marketing (avec votre consentement préalable)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                4. Base légale du traitement
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le traitement de vos données repose sur :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>L&apos;exécution du contrat :</strong> pour traiter vos
                  commandes et assurer la livraison
                </li>
                <li>
                  <strong>Obligations légales :</strong> pour respecter nos
                  obligations comptables et fiscales
                </li>
                <li>
                  <strong>Intérêts légitimes :</strong> pour améliorer nos
                  services et prévenir la fraude
                </li>
                <li>
                  <strong>Consentement :</strong> pour les communications
                  marketing et certains cookies
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                5. Destinataires des données
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vos données peuvent être transmises à :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Services internes :</strong> équipes de vente, service
                  client, comptabilité
                </li>
                <li>
                  <strong>Prestataires de services :</strong>
                  <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                    <li>Stripe (paiement sécurisé)</li>
                    <li>Transporteurs (livraison)</li>
                    <li>Vercel (hébergement)</li>
                    <li>Services d&apos;emailing (avec votre consentement)</li>
                  </ul>
                </li>
                <li>
                  <strong>Autorités :</strong> si requis par la loi ou une
                  décision judiciaire
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Tous nos prestataires sont tenus par des obligations de
                confidentialité et ne peuvent utiliser vos données qu&apos;aux fins
                pour lesquelles nous les leur transmettons.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                6. Durée de conservation
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous conservons vos données pour les durées suivantes :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Données de commande :</strong> 10 ans (obligations
                  comptables)
                </li>
                <li>
                  <strong>Données de compte client :</strong> 3 ans après la
                  dernière activité
                </li>
                <li>
                  <strong>Données de navigation :</strong> 13 mois maximum
                </li>
                <li>
                  <strong>Données de prospection :</strong> 3 ans après le
                  dernier contact
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                7. Vos droits
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Droit d&apos;accès :</strong> obtenir une copie de vos
                  données
                </li>
                <li>
                  <strong>Droit de rectification :</strong> corriger vos données
                  inexactes
                </li>
                <li>
                  <strong>Droit à l&apos;effacement :</strong> supprimer vos
                  données (sous conditions)
                </li>
                <li>
                  <strong>Droit à la limitation :</strong> limiter le traitement
                  de vos données
                </li>
                <li>
                  <strong>Droit à la portabilité :</strong> récupérer vos
                  données dans un format structuré
                </li>
                <li>
                  <strong>Droit d&apos;opposition :</strong> vous opposer au
                  traitement de vos données
                </li>
                <li>
                  <strong>Droit de retirer votre consentement :</strong> à tout
                  moment
                </li>
              </ul>

              <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">
                  Comment exercer vos droits ?
                </h3>
                <p className="text-gray-700 mb-2">
                  Pour exercer vos droits, contactez-nous :
                </p>
                <ul className="list-none text-gray-700 space-y-1">
                  <li>
                    • Par email :{' '}
                    <a
                      href="mailto:dpo@steelcat.fr"
                      className="text-black font-semibold hover:underline"
                    >
                      dpo@steelcat.fr
                    </a>
                  </li>
                  <li>
                    • Par courrier : SteelCat - DPO, 123 Rue du Commerce, 75001
                    Paris
                  </li>
                </ul>
                <p className="text-gray-700 mt-3 text-sm">
                  Nous vous répondrons dans un délai d&apos;un mois. Une pièce
                  d&apos;identité pourra être demandée pour vérifier votre
                  identité.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                8. Sécurité des données
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous mettons en œuvre des mesures techniques et
                organisationnelles appropriées pour protéger vos données :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Chiffrement SSL/TLS pour les connexions sécurisées</li>
                <li>Hébergement sécurisé avec Vercel</li>
                <li>Accès limité aux données personnelles</li>
                <li>Sauvegardes régulières</li>
                <li>
                  Audit de sécurité et mise à jour des systèmes régulières
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Malgré ces mesures, aucun système n&apos;est totalement infaillible.
                En cas de violation de données, nous vous en informerons dans les
                72 heures conformément au RGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">9. Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous utilisons des cookies pour améliorer votre expérience sur
                notre site. Vous pouvez gérer vos préférences de cookies à tout
                moment depuis les paramètres de votre navigateur.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Pour plus d&apos;informations sur les cookies, consultez nos{' '}
                <a
                  href="/mentions-legales#cookies"
                  className="text-black font-semibold hover:underline"
                >
                  Mentions Légales
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                10. Transferts internationaux
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Vos données sont principalement traitées au sein de l&apos;Union
                Européenne. Certains prestataires (comme Vercel) peuvent être
                situés en dehors de l&apos;UE. Dans ce cas, nous nous assurons que
                des garanties appropriées sont en place (clauses contractuelles
                types de la Commission Européenne).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                11. Modifications
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nous pouvons modifier cette politique de confidentialité à tout
                moment. Les modifications seront publiées sur cette page avec une
                nouvelle date de mise à jour. Nous vous encourageons à consulter
                régulièrement cette page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                12. Réclamation
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez
                introduire une réclamation auprès de la Commission Nationale de
                l&apos;Informatique et des Libertés (CNIL) :
              </p>
              <div className="mt-4 text-gray-700">
                <p>
                  <strong>CNIL</strong>
                </p>
                <p>3 Place de Fontenoy - TSA 80715</p>
                <p>75334 PARIS CEDEX 07</p>
                <p>
                  Site web :{' '}
                  <a
                    href="https://www.cnil.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-semibold hover:underline"
                  >
                    www.cnil.fr
                  </a>
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
