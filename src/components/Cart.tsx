'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';

export default function Cart() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const total = getTotalPrice();
  const itemCount = getTotalItems();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity"
        onClick={closeCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col text-black">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">
            Panier ({itemCount} {itemCount > 1 ? 'articles' : 'article'})
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-black transition-colors"
            aria-label="Fermer le panier"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-24 h-24 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-700 text-lg mb-2">Votre panier est vide</p>
              <p className="text-gray-500 text-sm mb-6">
                Ajoutez des produits pour commencer
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded-lg"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 truncate text-black">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">{item.weight}</p>

                    {/* Badge précommande */}
                    {item.status === 'PRE_ORDER' && (
                      <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mb-1">
                        Précommande
                        {item.availableDate && (
                          <span className="ml-1">
                            - Dispo le {new Date(item.availableDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-sm font-bold text-black">{item.price.toFixed(2)} €</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center border border-gray-300 hover:border-black transition-colors text-black"
                        aria-label="Diminuer la quantité"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-8 text-center text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-gray-300 hover:border-black transition-colors text-black"
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors self-start"
                    aria-label="Retirer du panier"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold text-black">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3 bg-black text-white text-center font-semibold hover:bg-gray-800 transition-colors rounded-lg"
            >
              Passer la commande
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full py-3 border border-gray-300 text-center font-semibold hover:border-black transition-colors text-black rounded-lg"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
