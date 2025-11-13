import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
              SteelCat
            </h1>
            <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed font-medium">
              La litière en acier inoxydable pensée pour l'hygiène, conçue pour durer.
            </p>

            {/* Badges de bénéfices */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-lg font-semibold text-gray-900">100% Anti-odeurs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-lg font-semibold text-gray-900">100% Anti-bactéries</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-lg font-semibold text-gray-900">Durabilité à vie</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-lg font-semibold text-gray-900">Nettoyage ultra-rapide</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-lg font-semibold text-gray-900">Sans produits chimiques</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/produit"
                className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors text-center shadow-lg"
              >
                Commander maintenant
              </Link>
              <a
                href="#pourquoi"
                className="border-2 border-black text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                En savoir plus
              </a>
            </div>

            {/* Message écologique */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-lg text-gray-700 italic">
                « Une seule litière en acier = plusieurs dizaines de litières en plastique évitées. »
              </p>
            </div>
          </div>

          {/* Image produit */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/litiere-1.jpg"
                alt="Litière SteelCat en acier inoxydable"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Badge Premium */}
            <div className="absolute -top-4 -right-4 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
              Premium
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
