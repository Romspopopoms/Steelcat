"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";

export default function ProductPage() {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("10kg");

  const images = [
    "/litiere-1.jpg",
    "/litiere-2.jpg",
    "/litiere-3.jpg",
    "/litiere-4.jpg",
    "/litiere-5.jpg",
    "/litiere-6.jpg",
  ];

  const weights = [
    { value: "5kg", price: 29.90, label: "5kg" },
    { value: "10kg", price: 49.90, label: "10kg - Le plus populaire", popular: true },
    { value: "15kg", price: 69.90, label: "15kg - Économisez 15%", savings: true },
  ];

  const currentPrice = weights.find(w => w.value === selectedWeight)?.price || 49.90;

  const handleAddToCart = () => {
    addItem({
      id: `steelcat-${selectedWeight}`,
      name: "SteelCat Premium",
      price: currentPrice,
      weight: selectedWeight,
      image: images[0],
      quantity: quantity,
    });
    openCart();
  };

  const handleBuyNow = () => {
    addItem({
      id: `steelcat-${selectedWeight}`,
      name: "SteelCat Premium",
      price: currentPrice,
      weight: selectedWeight,
      image: images[0],
      quantity: quantity,
    });
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galerie d'images */}
            <div className="space-y-4">
              {/* Image principale */}
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={images[selectedImage]}
                  alt="Litière SteelCat Premium"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Miniatures */}
              <div className="grid grid-cols-6 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-4 ring-black"
                        : "ring-2 ring-gray-200 hover:ring-gray-400"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Vue ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Informations produit */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-black mb-4">
                  SteelCat Premium
                </h1>
                <p className="text-2xl font-semibold text-black">
                  {currentPrice.toFixed(2)}€
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600">(127 avis)</span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  La litière premium qui révolutionne l'expérience de votre chat.
                  Avec sa formule 100% naturelle et ses performances exceptionnelles,
                  SteelCat offre 30 jours de fraîcheur garantie.
                </p>
              </div>

              {/* Sélection du poids */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Choisissez votre format
                </h3>
                <div className="space-y-3">
                  {weights.map((weight) => (
                    <button
                      key={weight.value}
                      onClick={() => setSelectedWeight(weight.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedWeight === weight.value
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-black">{weight.label}</div>
                          {weight.popular && (
                            <div className="text-xs text-gray-600">⭐ Le plus populaire</div>
                          )}
                          {weight.savings && (
                            <div className="text-xs text-green-600">💰 Meilleure offre</div>
                          )}
                        </div>
                        <div className="text-lg font-bold text-black">
                          {weight.price.toFixed(2)}€
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantité */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Quantité</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 border-gray-200 rounded-lg hover:border-gray-400 font-semibold"
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 border-2 border-gray-200 rounded-lg hover:border-gray-400 font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Ajouter au panier - {(currentPrice * quantity).toFixed(2)}€
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full border-2 border-black text-black py-4 px-8 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Acheter maintenant
                </button>
              </div>

              {/* Garanties */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-black flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <div className="font-semibold text-black">Livraison gratuite</div>
                    <div className="text-sm text-gray-600">Dès 50€ d'achat</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-black flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-black">Garantie satisfait</div>
                    <div className="text-sm text-gray-600">30 jours</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-black flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-black">Livraison rapide</div>
                    <div className="text-sm text-gray-600">2-3 jours ouvrés</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-black flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-black">Paiement sécurisé</div>
                    <div className="text-sm text-gray-600">CB, PayPal, Stripe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Caractéristiques détaillées */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-black mb-4">Composition</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 100% argile naturelle</li>
                <li>• Sans parfums artificiels</li>
                <li>• Biodégradable</li>
                <li>• Sans additifs chimiques</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-black mb-4">Performance</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Absorption ultra-rapide</li>
                <li>• Contrôle des odeurs 30j</li>
                <li>• Agglomération optimale</li>
                <li>• 99% sans poussière</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-black mb-4">Utilisation</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Remplir sur 7-10cm</li>
                <li>• Retirer les blocs 1x/jour</li>
                <li>• Compléter si nécessaire</li>
                <li>• Changement tous les 30j</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
