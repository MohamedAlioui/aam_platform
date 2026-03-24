import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Add item to cart
      addItem: (product, selectedColor = 'black', selectedSize = 'M', quantity = 1) => {
        const { items } = get();
        const itemKey = `${product._id}-${selectedColor}-${selectedSize}`;
        const existingIndex = items.findIndex(i => i.key === itemKey);

        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated });
        } else {
          set({
            items: [...items, {
              key: itemKey,
              productId: product._id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || '',
              color: selectedColor,
              size: selectedSize,
              quantity
            }]
          });
        }
      },

      // Remove item from cart
      removeItem: (itemKey) => {
        set({ items: get().items.filter(i => i.key !== itemKey) });
      },

      // Update quantity
      updateQuantity: (itemKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemKey);
          return;
        }
        set({
          items: get().items.map(i => i.key === itemKey ? { ...i, quantity } : i)
        });
      },

      // Clear cart
      clearCart: () => set({ items: [] }),

      // Toggle cart drawer
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Computed totals
      get totalItems() { return get().items.reduce((sum, i) => sum + i.quantity, 0); },
      get totalPrice() { return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0); }
    }),
    {
      name: 'aam-cart-6ix',
      partialize: (state) => ({ items: state.items })
    }
  )
);
