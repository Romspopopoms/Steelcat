'use client';

import { useEffect, useState } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  email: string;
  firstName: string;
  lastName: string;
  total: number;
  isPreOrder: boolean;
  createdAt: string;
  items: Array<{
    productName: string;
    productWeight: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, JSX.Element> = {
      PENDING: <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">En attente</span>,
      PAID: <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Payée</span>,
      PRE_ORDER: <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Précommande</span>,
      PROCESSING: <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">En cours</span>,
      SHIPPED: <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">Expédiée</span>,
      DELIVERED: <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Livrée</span>,
      CANCELLED: <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Annulée</span>,
    };
    return badges[status] || status;
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

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
        <h1 className="text-3xl font-bold text-gray-900">Gestion des commandes</h1>
        <p className="text-gray-600 mt-2">Suivez et gérez toutes les commandes</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes ({orders.length})
        </button>
        <button
          onClick={() => setStatusFilter('PAID')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'PAID'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Payées
        </button>
        <button
          onClick={() => setStatusFilter('PRE_ORDER')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'PRE_ORDER'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Précommandes
        </button>
        <button
          onClick={() => setStatusFilter('SHIPPED')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'SHIPPED'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Expédiées
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                      {order.isPreOrder && (
                        <div className="text-xs text-blue-600">Précommande</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.firstName} {order.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{order.total.toFixed(2)}€</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Commande {selectedOrder.orderNumber}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Informations client</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Nom :</strong> {selectedOrder.firstName} {selectedOrder.lastName}</p>
                  <p><strong>Email :</strong> {selectedOrder.email}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Articles commandés</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-gray-900">{item.productName} - {item.productWeight}</div>
                        <div className="text-gray-600">Quantité : {item.quantity}</div>
                      </div>
                      <div className="font-medium text-gray-900">
                        {(item.unitPrice * item.quantity).toFixed(2)}€
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{selectedOrder.total.toFixed(2)}€</span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Changer le statut</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="PENDING">En attente</option>
                  <option value="PAID">Payée</option>
                  <option value="PRE_ORDER">Précommande</option>
                  <option value="PROCESSING">En cours</option>
                  <option value="SHIPPED">Expédiée</option>
                  <option value="DELIVERED">Livrée</option>
                  <option value="CANCELLED">Annulée</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
