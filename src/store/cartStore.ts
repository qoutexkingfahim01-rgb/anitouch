import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const currentItems = get().items;

        const existingItem = currentItems.find(
          (item) => item.cartItemId === newItem.cartItemId
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.cartItemId === newItem.cartItemId
                ? {
                    ...item,
                    quantity: item.quantity + newItem.quantity,
                  }
                : item
            ),
          });
        } else {
          set({
            items: [...currentItems, newItem],
          });
        }
      },

      removeItem: (cartItemId) => {
        set({
          items: get().items.filter(
            (item) => item.cartItemId !== cartItemId
          ),
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter(
              (item) => item.cartItemId !== cartItemId
            ),
          });
          return;
        }

        set({
          items: get().items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'anitouch-cart-storage',
    }
  )
);