import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4 py-16">
          <h1 className="text-8xl font-bold text-black mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/produit"
              className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Voir nos produits
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
