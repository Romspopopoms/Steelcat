'use client';

import { useState, useEffect } from 'react';

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    value: '',
    minOrder: '',
    maxUses: '',
    expiresAt: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          type: formData.type,
          value: parseFloat(formData.value),
          minOrder: formData.minOrder ? parseFloat(formData.minOrder) : null,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
          expiresAt: formData.expiresAt || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création');
      }

      setShowForm(false);
      setFormData({ code: '', type: 'PERCENTAGE', value: '', minOrder: '', maxUses: '', expiresAt: '' });
      fetchCoupons();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: coupon.id, isActive: !coupon.isActive }),
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Codes Promo</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {showForm ? 'Annuler' : 'Nouveau coupon'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Créer un coupon</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                placeholder="PROMO10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
              >
                <option value="PERCENTAGE">Pourcentage (%)</option>
                <option value="FIXED">Montant fixe (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valeur ({formData.type === 'PERCENTAGE' ? '%' : '€'})
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commande minimum (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                placeholder="Optionnel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Utilisations max</label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                placeholder="Illimité"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;expiration</label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Créer le coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Valeur</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilisations</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Min. commande</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expire</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  Aucun coupon créé
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-6 py-4 font-mono font-semibold text-black">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {coupon.type === 'PERCENTAGE' ? 'Pourcentage' : 'Fixe'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-black">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `${coupon.value.toFixed(2)} €`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {coupon.minOrder ? `${coupon.minOrder.toFixed(2)} €` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString('fr-FR')
                      : 'Jamais'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {coupon.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(coupon)}
                      className="text-sm text-gray-600 hover:text-black underline"
                    >
                      {coupon.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
