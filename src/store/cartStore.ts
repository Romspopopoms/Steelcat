import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ProductStatus = 'IN_STOCK' | 'PRE_ORDER' | 'OUT_OF_STOCK';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
  status?: ProductStatus;
  availableDate?: string | null;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, weight?: string) => void;
  updateQuantity: (id: string, quantity: number, weight?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      addItem: (item) => {
        const MAX_QUANTITY = 50;
        const existingItem = get().items.find(
          (i) => i.id === item.id && i.weight === item.weight
        );

        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + (item.quantity || 1), MAX_QUANTITY);
          set({
            items: get().items.map((i) =>
              i.id === item.id && i.weight === item.weight
                ? { ...i, quantity: newQuantity }
                : i
            ),
          });
        } else {
          const quantity = Math.min(item.quantity || 1, MAX_QUANTITY);
          set({
            items: [...get().items, { ...item, quantity }],
          });
        }
      },

      removeItem: (id, weight) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.weight === weight)),
        });
      },

      updateQuantity: (id, quantity, weight) => {
        if (quantity <= 0) {
          get().removeItem(id, weight);
          return;
        }

        const MAX_QUANTITY = 50;
        const clampedQuantity = Math.min(quantity, MAX_QUANTITY);
        set({
          items: get().items.map((item) =>
            item.id === id && item.weight === weight ? { ...item, quantity: clampedQuantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'steelcat-cart-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Fallback pour le SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
