'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/cartStore';

interface OrderData {
  orderNumber: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    weight: string;
    image: string;
  }>;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (sessionId) {
        // Récupérer le vrai orderNumber depuis l'API
        try {
          const response = await fetch(`/api/orders/by-session?sessionId=${sessionId}`);
          if (response.ok) {
            const { order } = await response.json();

            // Récupérer les données checkout pour les images
            let checkoutItems: any[] = [];
            try {
              const checkoutData = localStorage.getItem('checkoutData');
              if (checkoutData) {
                const parsed = JSON.parse(checkoutData);
                checkoutItems = parsed.items || [];
              }
            } catch {
              // Données corrompues, on continue sans images
            }

            const orderDisplay: OrderData = {
              orderNumber: order.orderNumber,
              items: order.items.map((item: any) => {
                const checkoutItem = checkoutItems.find((ci: any) => ci.id === item.productId);
                return {
                  id: item.productId,
                  name: item.productName,
                  price: item.unitPrice,
                  quantity: item.quantity,
                  weight: item.productWeight,
                  image: checkoutItem?.image || '/images/product-placeholder.jpg',
                };
              }),
              customerInfo: {
                email: order.email,
                firstName: order.firstName,
                lastName: order.lastName,
                address: order.address,
                city: order.city,
                postalCode: order.postalCode,
                phone: order.phone,
              },
              subtotal: order.subtotal,
              shipping: order.shipping,
              total: order.total,
              date: order.createdAt,
            };

            setOrderData(orderDisplay);
            // Vider le panier après confirmation réussie
            clearCart();
            // Nettoyer le localStorage
            localStorage.removeItem('checkoutData');
          } else {
            localStorage.removeItem('checkoutData');
            router.push('/');
          }
        } catch {
          localStorage.removeItem('checkoutData');
          router.push('/');
        }
      } else {
        localStorage.removeItem('checkoutData');
        router.push('/');
      }
    };

    loadOrder();
  }, [router, clearCart]);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">
              Commande confirmée !
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Merci pour votre commande {orderData.customerInfo.firstName}
            </p>
            <p className="text-sm text-gray-500">
              Numéro de commande:{' '}
              <span className="font-mono font-semibold">
                {orderData.orderNumber}
              </span>
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-black mb-6">
              Détails de la commande
            </h2>

            {/* Items */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.weight}</p>
                    <p className="text-sm text-gray-600">
                      Quantité: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Sous-total</span>
                <span>{orderData.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Livraison</span>
                <span>
                  {orderData.shipping === 0 ? (
                    <span className="text-green-600 font-semibold">
                      Gratuite
                    </span>
                  ) : (
                    `${orderData.shipping.toFixed(2)} €`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-black pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>{orderData.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-black mb-6">
              Adresse de livraison
            </h2>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold text-black">
                {orderData.customerInfo.firstName}{' '}
                {orderData.customerInfo.lastName}
              </p>
              <p>{orderData.customerInfo.address}</p>
              <p>
                {orderData.customerInfo.postalCode}{' '}
                {orderData.customerInfo.city}
              </p>
              <p className="pt-2">{orderData.customerInfo.phone}</p>
              <p>{orderData.customerInfo.email}</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">
              Et maintenant ?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  Un email de confirmation a été envoyé à{' '}
                  <strong>{orderData.customerInfo.email}</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <span>
                  Votre commande sera expédiée sous 24-48h ouvrées
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Vous recevrez un email avec le numéro de suivi dès l&apos;expédition
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/produit"
              className="flex-1 bg-black text-white py-4 px-8 rounded-lg text-center font-semibold hover:bg-gray-800 transition-colors"
            >
              Continuer mes achats
            </Link>
            <Link
              href="/"
              className="flex-1 border-2 border-black text-black py-4 px-8 rounded-lg text-center font-semibold hover:bg-gray-50 transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 text-center text-gray-600">
            <p className="mb-2">Une question sur votre commande ?</p>
            <Link
              href="/contact"
              className="text-black font-semibold hover:underline"
            >
              Contactez notre service client
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
