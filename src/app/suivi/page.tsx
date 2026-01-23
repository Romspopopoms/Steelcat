'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface OrderData {
  orderNumber: string;
  status: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  isPreOrder: boolean;
  estimatedDelivery: string | null;
  items: Array<{
    productName: string;
    productWeight: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente de paiement',
  PAID: 'Payée',
  PRE_ORDER: 'Précommande confirmée',
  PROCESSING: 'En préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  PRE_ORDER: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function SuiviPage() {
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(
        `/api/orders?email=${encodeURIComponent(email)}&orderNumber=${encodeURIComponent(orderNumber)}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Commande non trouvée');
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSteps = (order: OrderData) => {
    const steps = [
      { label: 'Commande passée', date: formatDate(order.createdAt), done: true },
      { label: 'Paiement confirmé', date: formatDate(order.paidAt), done: !!order.paidAt },
      { label: 'En préparation', date: null, done: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) },
      { label: 'Expédiée', date: formatDate(order.shippedAt), done: ['SHIPPED', 'DELIVERED'].includes(order.status) },
      { label: 'Livrée', date: formatDate(order.deliveredAt), done: order.status === 'DELIVERED' },
    ];
    return steps;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-black mb-8">Suivi de commande</h1>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de commande
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                  placeholder="SC-XXXXXXXX"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Recherche...' : 'Rechercher ma commande'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Order Result */}
          {order && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-black">Commande {order.orderNumber}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Passée le {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>

                {/* Timeline */}
                {order.status !== 'CANCELLED' && (
                  <div className="relative">
                    <div className="space-y-4">
                      {getSteps(order).map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            step.done ? 'bg-green-500' : 'bg-gray-200'
                          }`}>
                            {step.done ? (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <div className="w-3 h-3 bg-gray-400 rounded-full" />
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${step.done ? 'text-black' : 'text-gray-400'}`}>
                              {step.label}
                            </p>
                            {step.date && (
                              <p className="text-xs text-gray-500">{step.date}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.isPreOrder && order.estimatedDelivery && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Précommande</strong> - Livraison estimée : {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-black mb-4">Articles</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-black">{item.productName}</p>
                        <p className="text-sm text-gray-500">{item.productWeight} x {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-black">{item.totalPrice.toFixed(2)} €</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Sous-total</span>
                    <span>{order.subtotal.toFixed(2)} €</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Réduction</span>
                      <span>-{order.discount.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Livraison</span>
                    <span>{order.shipping === 0 ? 'Gratuite' : `${order.shipping.toFixed(2)} €`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-black pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{order.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
