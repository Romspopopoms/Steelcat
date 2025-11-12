import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Mentions Légales - SteelCat',
  description: 'Mentions légales du site SteelCat',
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-black mb-8">
            Mentions Légales
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                1. Éditeur du site
              </h2>
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>Raison sociale :</strong> SteelCat SAS
                </p>
                <p>
                  <strong>Forme juridique :</strong> Société par Actions
                  Simplifiée
                </p>
                <p>
                  <strong>Capital social :</strong> 50 000€
                </p>
                <p>
                  <strong>SIRET :</strong> 123 456 789 00012
                </p>
                <p>
                  <strong>RCS :</strong> Paris B 123 456 789
                </p>
                <p>
                  <strong>TVA intracommunautaire :</strong> FR12345678900
                </p>
                <p>
                  <strong>Siège social :</strong> 123 Rue du Commerce, 75001
                  Paris, France
                </p>
                <p>
                  <strong>Téléphone :</strong> 01 23 45 67 89
                </p>
                <p>
                  <strong>Email :</strong>{' '}
                  <a
                    href="mailto:contact@steelcat.fr"
                    className="text-black font-semibold hover:underline"
                  >
                    contact@steelcat.fr
                  </a>
                </p>
                <p>
                  <strong>Directeur de la publication :</strong> [Nom du
                  Directeur]
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                2. Hébergement
              </h2>
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>Hébergeur :</strong> Vercel Inc.
                </p>
                <p>
                  <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA
                  91789, USA
                </p>
                <p>
                  <strong>Site web :</strong>{' '}
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-semibold hover:underline"
                  >
                    vercel.com
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                3. Propriété intellectuelle
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                L&apos;ensemble du contenu de ce site (textes, images, vidéos,
                logos, icônes, etc.) est la propriété exclusive de SteelCat ou
                de ses partenaires. Toute reproduction, distribution,
                modification, adaptation, retransmission ou publication de ces
                différents éléments est strictement interdite sans l&apos;accord
                exprès par écrit de SteelCat.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Les marques et logos présents sur le site sont des marques
                déposées. Toute reproduction totale ou partielle de ces marques
                sans autorisation est prohibée.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                4. Protection des données personnelles
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conformément au Règlement Général sur la Protection des Données
                (RGPD) et à la loi Informatique et Libertés, vous disposez d&apos;un
                droit d&apos;accès, de rectification, de suppression et
                d&apos;opposition aux données personnelles vous concernant.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Pour exercer ces droits ou pour toute question sur le traitement
                de vos données, vous pouvez nous contacter :
              </p>
              <ul className="list-none text-gray-700 mt-2 space-y-1">
                <li>• Par email : dpo@steelcat.fr</li>
                <li>• Par courrier : SteelCat - DPO, 123 Rue du Commerce, 75001 Paris</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Pour plus d&apos;informations, consultez notre{' '}
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
              <h2 className="text-2xl font-bold text-black mb-4">5. Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ce site utilise des cookies pour améliorer l&apos;expérience
                utilisateur et réaliser des statistiques de visite. Les cookies
                sont de petits fichiers texte stockés sur votre appareil.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Types de cookies utilisés :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Cookies essentiels :</strong> Nécessaires au
                  fonctionnement du panier et de la navigation
                </li>
                <li>
                  <strong>Cookies de performance :</strong> Permettent
                  d&apos;analyser l&apos;utilisation du site pour l&apos;améliorer
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Vous pouvez à tout moment désactiver les cookies depuis les
                paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                6. Responsabilité
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SteelCat s&apos;efforce d&apos;assurer au mieux l&apos;exactitude et
                la mise à jour des informations diffusées sur ce site.
                Toutefois, SteelCat ne peut garantir l&apos;exactitude, la
                précision ou l&apos;exhaustivité des informations mises à
                disposition sur ce site.
              </p>
              <p className="text-gray-700 leading-relaxed">
                SteelCat ne pourra être tenu responsable des dommages directs ou
                indirects résultant de l&apos;utilisation de ce site ou de
                l&apos;impossibilité d&apos;y accéder.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                7. Liens hypertextes
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ce site peut contenir des liens vers des sites externes. SteelCat
                n&apos;exerce aucun contrôle sur ces sites et décline toute
                responsabilité quant à leur contenu.
              </p>
              <p className="text-gray-700 leading-relaxed">
                La création de liens hypertextes vers ce site est soumise à
                l&apos;accord préalable de SteelCat. Pour toute demande,
                contactez-nous à contact@steelcat.fr.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                8. Droit applicable et juridiction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Les présentes mentions légales sont régies par le droit français.
                En cas de litige et à défaut d&apos;accord amiable, le litige sera
                porté devant les tribunaux français compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                9. Médiation
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conformément à l&apos;article L.612-1 du Code de la consommation,
                nous vous informons que vous avez la possibilité, en cas de
                litige, de recourir gratuitement à un médiateur de la
                consommation.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Pour plus d&apos;informations :{' '}
                <a
                  href="https://www.economie.gouv.fr/mediation-conso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black font-semibold hover:underline"
                >
                  economie.gouv.fr/mediation-conso
                </a>
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
