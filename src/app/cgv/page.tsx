import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Conditions Générales de Vente - SteelCat',
  description: 'Conditions générales de vente de SteelCat',
};

export default function CGVPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-black mb-8">
            Conditions Générales de Vente
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Informations légales</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                <strong>Raison sociale :</strong> SteelCat
              </p>
              <p className="text-gray-700 leading-relaxed mb-2">
                <strong>SIREN :</strong> 990723421
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>SIRET :</strong> 99072342100014
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">1. Objet</h2>
              <p className="text-gray-700 leading-relaxed">
                Les présentes Conditions Générales de Vente (CGV) régissent les
                ventes de produits SteelCat réalisées sur le site steelcat.fr.
                Toute commande passée sur le site implique l&apos;acceptation sans
                réserve des présentes CGV.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">2. Produits</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les produits proposés sont ceux qui figurent sur le site au jour
                de la consultation par l&apos;acheteur. Les photographies et
                graphismes présentés sont aussi fidèles que possible mais ne
                peuvent assurer une similitude parfaite avec le produit.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Nos produits sont disponibles dans les formats suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                <li>5kg - Idéal pour essayer</li>
                <li>10kg - Format populaire</li>
                <li>15kg - Meilleur rapport qualité/prix</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">3. Prix</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les prix sont indiqués en euros TTC (TVA applicable au jour de
                la commande). SteelCat se réserve le droit de modifier ses prix
                à tout moment, mais les produits seront facturés sur la base des
                tarifs en vigueur au moment de l&apos;enregistrement de la
                commande.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Les frais de livraison sont offerts pour toute commande
                supérieure à 50€. En dessous, des frais de 5,90€ s&apos;appliquent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">4. Commande</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour passer commande, vous devez :
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Sélectionner les produits et les ajouter au panier</li>
                <li>Valider le contenu du panier</li>
                <li>Remplir le formulaire de livraison</li>
                <li>Accepter les présentes CGV</li>
                <li>Procéder au paiement</li>
              </ol>
              <p className="text-gray-700 leading-relaxed mt-4">
                La validation de la commande entraîne l&apos;acceptation des
                présentes CGV et constitue une preuve du contrat de vente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">5. Paiement</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le paiement s&apos;effectue de manière sécurisée par :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Carte bancaire (Visa, Mastercard, American Express)</li>
                <li>PayPal</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Les données de paiement sont cryptées et sécurisées par notre
                prestataire Stripe. SteelCat ne conserve aucune donnée bancaire.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">6. Livraison</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les livraisons sont assurées en France métropolitaine par notre
                partenaire de transport. Les délais de livraison sont de 2 à 3
                jours ouvrés à compter de la validation de la commande.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vous recevrez un email avec le numéro de suivi dès l&apos;expédition
                de votre colis.
              </p>
              <p className="text-gray-700 leading-relaxed">
                En cas d&apos;absence lors de la livraison, un avis de passage sera
                déposé dans votre boîte aux lettres.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                7. Droit de rétractation
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conformément à l&apos;article L221-18 du Code de la consommation,
                vous disposez d&apos;un délai de 14 jours à compter de la réception
                de votre commande pour exercer votre droit de rétractation sans
                avoir à justifier de motifs ni à payer de pénalité.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour exercer ce droit, contactez-nous à l&apos;adresse
                sav@steel-cat.com. Les produits doivent être retournés dans
                leur emballage d&apos;origine, en parfait état.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Le remboursement sera effectué dans un délai de 14 jours suivant
                la réception du produit retourné.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">8. Garantie</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tous nos produits bénéficient de la garantie légale de
                conformité (articles L217-4 et suivants du Code de la
                consommation) et de la garantie contre les vices cachés (articles
                1641 et suivants du Code civil).
              </p>
              <p className="text-gray-700 leading-relaxed">
                En cas de défaut de conformité, vous pouvez obtenir le
                remplacement ou le remboursement du produit dans les conditions
                prévues par la loi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                9. Réclamations
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour toute réclamation, merci de nous contacter :
              </p>
              <ul className="list-none text-gray-700 space-y-1">
                <li>• Par email : sav@steel-cat.com</li>
                <li>• Par courrier : SteelCat, 123 Rue du Commerce, 75001 Paris</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                10. Données personnelles
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Les données personnelles collectées sont nécessaires au
                traitement de votre commande. Conformément au RGPD, vous
                disposez d&apos;un droit d&apos;accès, de rectification et de
                suppression de vos données. Pour plus d&apos;informations,
                consultez notre{' '}
                <a
                  href="/confidentialite"
                  className="text-black font-semibold hover:underline"
                >
                  Politique de Confidentialité
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                11. Droit applicable
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Les présentes CGV sont soumises au droit français. En cas de
                litige, et à défaut d&apos;accord amiable, le tribunal compétent
                sera celui du ressort du siège social de SteelCat.
              </p>
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
