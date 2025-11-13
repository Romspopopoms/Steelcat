'use client';

import { useEffect, useState } from 'react';

interface PreOrder {
  id: string;
  orderNumber: string;
  status: string;
  email: string;
  firstName: string;
  lastName: string;
  total: number;
  estimatedDelivery: string | null;
  notificationSent: boolean;
  createdAt: string;
  items: Array<{
    productName: string;
    productWeight: string;
    quantity: number;
  }>;
}

export default function PreOrdersPage() {
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreOrders();
  }, []);

  const fetchPreOrders = async () => {
    try {
      const response = await fetch('/api/admin/pre-orders');
      if (response.ok) {
        const data = await response.json();
        setPreOrders(data.preOrders);
      }
    } catch (error) {
      console.error('Error fetching pre-orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsAvailable = async (orderId: string) => {
    if (!confirm('Marquer cette précommande comme disponible et envoyer l\'email de notification ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PROCESSING' }),
      });

      if (response.ok) {
        await fetchPreOrders();
      }
    } catch (error) {
      console.error('Error updating pre-order:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Suivi des précommandes</h1>
        <p className="text-gray-600 mt-2">Gérez et notifiez les clients des précommandes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Précommandes actives</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {preOrders.filter(o => o.status === 'PRE_ORDER').length}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">En cours de traitement</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {preOrders.filter(o => o.status === 'PROCESSING').length}
              </p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Notifications envoyées</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {preOrders.filter(o => o.notificationSent).length}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livraison estimée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {preOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucune précommande trouvée
                  </td>
                </tr>
              ) : (
                preOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.firstName} {order.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.map((item, index) => (
                          <div key={index}>
                            {item.quantity}x {item.productName} - {item.productWeight}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.estimatedDelivery ? (
                        <span className="text-sm text-gray-900">
                          {new Date(order.estimatedDelivery).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Non définie</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {order.status === 'PRE_ORDER' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium inline-block w-fit">
                            Précommande
                          </span>
                        )}
                        {order.status === 'PROCESSING' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium inline-block w-fit">
                            En cours
                          </span>
                        )}
                        {order.notificationSent && (
                          <span className="text-xs text-green-600">
                            ✓ Notifié
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === 'PRE_ORDER' && !order.notificationSent && (
                        <button
                          onClick={() => markAsAvailable(order.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                        >
                          Marquer disponible
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Comment gérer les précommandes :</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Cliquez sur "Marquer disponible" lorsque le produit est en stock</li>
              <li>Un email de notification sera automatiquement envoyé au client</li>
              <li>Le statut passera à "En cours de traitement"</li>
              <li>Ensuite, gérez l'expédition depuis la page "Commandes"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
