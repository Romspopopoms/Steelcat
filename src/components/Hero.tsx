import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="produit" className="relative bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
              L'élégance au service de votre chat
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              SteelCat révolutionne l'expérience de la litière avec un design épuré,
              des matériaux premium et une efficacité incomparable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/produit" className="bg-black text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors text-center">
                Commander maintenant
              </Link>
              <a href="#caracteristiques" className="border-2 border-black text-black px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors text-center">
                En savoir plus
              </a>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-black">99%</div>
                <div className="text-sm text-gray-600">Anti-odeur</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">100%</div>
                <div className="text-sm text-gray-600">Naturel</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">30j</div>
                <div className="text-sm text-gray-600">Durée</div>
              </div>
            </div>
          </div>

          {/* Image produit */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/litiere-1.jpg"
                alt="Litière SteelCat Premium"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Badge */}
            <div className="absolute -top-4 -right-4 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
              Premium
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
