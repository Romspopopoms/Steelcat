'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  weight: string;
  status: string;
  stock: number;
  originalPrice: number;
  currentPrice: number;
  hasPromo: boolean;
  promoLimit: number | null;
  promoSold: number;
  availableDate: string | null;
  preOrderCount: number;
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      if (response.ok) {
        await fetchProducts();
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      IN_STOCK: <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">En stock</span>,
      PRE_ORDER: <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Précommande</span>,
      OUT_OF_STOCK: <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Rupture</span>,
    };
    return badges[status as keyof typeof badges] || status;
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
        <h1 className="text-3xl font-bold text-gray-900">Gestion des produits</h1>
        <p className="text-gray-600 mt-2">Gérez le stock, les prix et les statuts</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Précommandes</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.weight}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${product.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock} unités
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {product.hasPromo && (
                        <div className="text-sm text-gray-400 line-through">
                          {product.originalPrice.toFixed(2)}€
                        </div>
                      )}
                      <div className="font-medium text-gray-900">
                        {product.currentPrice.toFixed(2)}€
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.hasPromo && product.promoLimit ? (
                      <div className="text-sm">
                        <span className="text-red-600 font-medium">{product.promoSold}/{product.promoLimit}</span>
                        <div className="text-gray-500">vendus</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{product.preOrderCount}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Modifier {editingProduct.name} - {editingProduct.weight}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut du produit
                </label>
                <select
                  value={editingProduct.status}
                  onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="IN_STOCK">En stock</option>
                  <option value="PRE_ORDER">Précommande</option>
                  <option value="OUT_OF_STOCK">Rupture de stock</option>
                </select>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock disponible
                </label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  min="0"
                />
              </div>

              {/* Prix */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix original (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix actuel (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.currentPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, currentPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>

              {/* Promo */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.hasPromo}
                    onChange={(e) => setEditingProduct({ ...editingProduct, hasPromo: e.target.checked })}
                    className="w-4 h-4 text-black"
                  />
                  <span className="text-sm font-medium text-gray-700">Activer la promotion limitée</span>
                </label>
                {editingProduct.hasPromo && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limite de promotion
                    </label>
                    <input
                      type="number"
                      value={editingProduct.promoLimit || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, promoLimit: parseInt(e.target.value) || null })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                      min="0"
                    />
                  </div>
                )}
              </div>

              {/* Date de disponibilité pour précommande */}
              {editingProduct.status === 'PRE_ORDER' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de disponibilité estimée
                  </label>
                  <input
                    type="date"
                    value={editingProduct.availableDate ? editingProduct.availableDate.split('T')[0] : ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, availableDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
