"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";

type ProductStatus = 'IN_STOCK' | 'PRE_ORDER' | 'OUT_OF_STOCK';

// Correspondance poids → dimensions
const DIMENSIONS: Record<string, string> = {
  "5kg": "45 × 35 × 12 cm",
  "10kg": "55 × 40 × 15 cm",
  "15kg": "60 × 45 × 18 cm",
};

interface Product {
  id: string;
  name: string;
  description: string;
  weight: string;
  status: ProductStatus;
  stock: number;
  originalPrice: number;
  currentPrice: number;
  hasPromo: boolean;
  promoLimit: number | null;
  promoSold: number;
  availableDate: string | null;
  images: string[];
  popular: boolean;
}

export default function ProductPage() {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();

      // Vérifier que data.products existe et est un tableau
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);

        // Sélectionner le produit populaire par défaut (10kg)
        const popularProduct = data.products.find((p: Product) => p.popular);
        if (popularProduct) {
          setSelectedProductId(popularProduct.id);
        } else if (data.products.length > 0) {
          setSelectedProductId(data.products[0].id);
        }
      } else {
        console.error('Error fetching products: Invalid data format', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.currentPrice,
      weight: selectedProduct.weight,
      image: selectedProduct.images[0] || "/litiere-1.jpg",
      quantity: quantity,
      status: selectedProduct.status,
      availableDate: selectedProduct.availableDate,
    });
    openCart();
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;

    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.currentPrice,
      weight: selectedProduct.weight,
      image: selectedProduct.images[0] || "/litiere-1.jpg",
      quantity: quantity,
      status: selectedProduct.status,
      availableDate: selectedProduct.availableDate,
    });
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xl">Chargement...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xl">Produit non trouvé</div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = selectedProduct.status === 'OUT_OF_STOCK';
  const isPreOrder = selectedProduct.status === 'PRE_ORDER';
  const promoRemaining = selectedProduct.hasPromo && selectedProduct.promoLimit
    ? selectedProduct.promoLimit - selectedProduct.promoSold
    : null;

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
                  src={selectedProduct.images[selectedImage] || "/litiere-1.jpg"}
                  alt="Litière SteelCat Premium"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Badge de statut */}
                {isPreOrder && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                    Précommande
                  </div>
                )}
                {isOutOfStock && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                    Rupture de stock
                  </div>
                )}
              </div>

              {/* Miniatures */}
              <div className="grid grid-cols-6 gap-2">
                {selectedProduct.images.map((image, index) => (
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
                  {selectedProduct.name}
                </h1>

                {/* Prix avec promo */}
                <div className="flex items-center gap-3 mb-2">
                  {selectedProduct.hasPromo && (
                    <p className="text-xl text-gray-400 line-through">
                      {selectedProduct.originalPrice.toFixed(2)}€
                    </p>
                  )}
                  <p className="text-3xl font-bold text-black">
                    {selectedProduct.currentPrice.toFixed(2)}€
                  </p>
                </div>

                {/* Badge promo */}
                {selectedProduct.hasPromo && promoRemaining !== null && promoRemaining > 0 && (
                  <div className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold text-sm mb-4">
                    Promo : Plus que {promoRemaining} places restantes !
                  </div>
                )}

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

                {/* Date de disponibilité précommande */}
                {isPreOrder && selectedProduct.availableDate && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-semibold">
                      Disponible à partir du{' '}
                      {new Date(selectedProduct.availableDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-b border-gray-200 py-6">
                <div className="max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">SteelCat</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Conçue en acier inoxydable premium, la litière SteelCat offre une hygiène incomparable et une durabilité exceptionnelle. Son système de tamis intégré permet une évacuation rapide et naturelle des déchets, simplifiant drastiquement le nettoyage et garantissant un environnement toujours propre pour votre chat.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>Pour une performance optimale</strong>, nous recommandons l&apos;utilisation de <strong>pellets de bois</strong>. Considérés comme l&apos;une des meilleures litières naturelles, les pellets sont <strong>100 % végétaux, sans toxines ni produits chimiques</strong>, et respectent parfaitement la santé de votre compagnon. Au contact de l&apos;urine, ils se transforment en une fine poussière qui tombe immédiatement à travers le tamis, laissant la partie supérieure propre, sèche et confortable.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Contrairement aux litières agglomérantes traditionnelles — souvent composées de poussières minérales et d&apos;additifs qui peuvent être irritants ou toxiques pour les voies respiratoires des chats — les pellets de bois offrent une solution saine, écologique et sans danger.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>SteelCat</strong> combine ainsi un design premium, une hygiène irréprochable et une litière 100 % naturelle pour garantir à votre chat un confort maximal au quotidien.
                  </p>
                </div>
              </div>

              {/* Sélection du format */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Choisissez vos dimensions
                </h3>
                <div className="space-y-3">
                  {products.map((product) => {
                    const promoRemaining = product.hasPromo && product.promoLimit
                      ? product.promoLimit - product.promoSold
                      : null;

                    return (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProductId(product.id)}
                        disabled={product.status === 'OUT_OF_STOCK'}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedProductId === product.id
                            ? "border-black bg-gray-50"
                            : product.status === 'OUT_OF_STOCK'
                            ? "border-gray-200 opacity-50 cursor-not-allowed"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-black">
                              {DIMENSIONS[product.weight] || product.weight}
                              {product.popular && " - Le plus populaire"}
                            </div>
                            {product.popular && (
                              <div className="text-xs text-gray-600">⭐ Le plus populaire</div>
                            )}
                            {product.status === 'PRE_ORDER' && (
                              <div className="text-xs text-blue-600">📦 Précommande</div>
                            )}
                            {product.status === 'OUT_OF_STOCK' && (
                              <div className="text-xs text-red-600">❌ Rupture de stock</div>
                            )}
                            {promoRemaining !== null && promoRemaining > 0 && (
                              <div className="text-xs text-red-600">🔥 Plus que {promoRemaining} en promo</div>
                            )}
                          </div>
                          <div className="text-right">
                            {product.hasPromo && (
                              <div className="text-sm text-gray-400 line-through">
                                {product.originalPrice.toFixed(2)}€
                              </div>
                            )}
                            <div className="text-lg font-bold text-black">
                              {product.currentPrice.toFixed(2)}€
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock disponible */}
              {!isOutOfStock && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">
                    ✓ {selectedProduct.stock} unités disponibles
                  </p>
                </div>
              )}

              {/* Quantité */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Quantité</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 border-gray-200 rounded-lg hover:border-gray-400 font-semibold disabled:opacity-50"
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    className="w-12 h-12 border-2 border-gray-200 rounded-lg hover:border-gray-400 font-semibold disabled:opacity-50"
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full bg-black text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOutOfStock
                    ? "Rupture de stock"
                    : isPreOrder
                    ? `Précommander - ${(selectedProduct.currentPrice * quantity).toFixed(2)}€`
                    : `Ajouter au panier - ${(selectedProduct.currentPrice * quantity).toFixed(2)}€`
                  }
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full border-2 border-black text-black py-4 px-8 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPreOrder ? "Précommander maintenant" : "Acheter maintenant"}
                </button>
              </div>

              {/* Garanties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-black flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-black">Garantie satisfait ou remboursé</div>
                    <div className="text-sm text-gray-600">Protection achat</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-black flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-black">Livraison sous 5 jours ouvrés</div>
                    <div className="text-sm text-gray-600">{isPreOrder ? 'À la disponibilité' : 'Livraison rapide'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
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
