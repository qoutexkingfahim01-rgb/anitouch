import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const current = get().items;
        if (!current.some(p => p.id === product.id)) {
          set({ items: [...current, product] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(p => p.id !== productId) });
      },
      isInWishlist: (productId) => {
        return get().items.some(p => p.id === productId);
      }
    }),
    { name: 'anitouch-wishlist-storage' }
  )
);