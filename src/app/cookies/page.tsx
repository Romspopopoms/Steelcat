import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Politique de Cookies - SteelCat',
  description: 'Découvrez comment SteelCat utilise les cookies sur son site.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-black mb-8">Politique de Cookies</h1>

          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-black mb-3">Qu&apos;est-ce qu&apos;un cookie ?</h2>
              <p className="text-gray-700 leading-relaxed">
                Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette, smartphone) lors de la visite d&apos;un site web. Il permet au site de se souvenir de vos actions et préférences pendant une période donnée.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-3">Cookies que nous utilisons</h2>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Cookies nécessaires</h3>
                  <p className="text-sm text-gray-600 mb-2">Ces cookies sont indispensables au fonctionnement du site.</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li><strong>steelcat-cart-storage</strong> - Sauvegarde du contenu de votre panier</li>
                    <li><strong>cookie-consent</strong> - Mémorise vos préférences de cookies</li>
                    <li><strong>admin_token</strong> - Session d&apos;administration (admins uniquement)</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Cookies analytiques</h3>
                  <p className="text-sm text-gray-600 mb-2">Ces cookies nous aident à comprendre comment les visiteurs interagissent avec le site.</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Nombre de pages visitées</li>
                    <li>Temps passé sur le site</li>
                    <li>Source de trafic</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Cookies marketing</h3>
                  <p className="text-sm text-gray-600 mb-2">Ces cookies permettent de vous proposer des contenus et publicités pertinents.</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Personnalisation des annonces</li>
                    <li>Mesure de performance des campagnes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-3">Gérer vos préférences</h2>
              <p className="text-gray-700 leading-relaxed">
                Vous pouvez modifier vos préférences de cookies à tout moment en supprimant le cookie &quot;cookie-consent&quot; de votre navigateur. La bannière de consentement s&apos;affichera à nouveau lors de votre prochaine visite.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les cookies. Consultez l&apos;aide de votre navigateur pour en savoir plus.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-3">Durée de conservation</h2>
              <ul className="text-gray-700 list-disc list-inside space-y-1">
                <li>Cookies nécessaires : durée de la session ou 30 jours</li>
                <li>Cookies analytiques : 13 mois maximum</li>
                <li>Cookies marketing : 13 mois maximum</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-3">Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                Pour toute question relative à notre utilisation des cookies, vous pouvez nous contacter à{' '}
                <a href="mailto:sav@steel-cat.com" className="text-black font-medium underline">sav@steel-cat.com</a>.
              </p>
            </section>

            <p className="text-sm text-gray-500 pt-4 border-t border-gray-200">
              Dernière mise à jour : Janvier 2026
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
