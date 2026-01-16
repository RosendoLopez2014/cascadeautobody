import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem, FulfillmentDetails, FulfillmentMethod } from "@/types";

interface CartState {
  items: CartItem[];
  fulfillment: FulfillmentDetails | null;

  // Actions
  addItem: (product: Product, quantity?: number, fulfillment?: { method: FulfillmentMethod; pickupLocation?: "yakima" | "toppenish" }) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateItemFulfillment: (productId: number, fulfillment: { method: FulfillmentMethod; pickupLocation?: "yakima" | "toppenish" }) => void;
  updateItemShippingCost: (productId: number, shippingCost: number) => void;
  clearCart: () => void;
  setFulfillment: (fulfillment: FulfillmentDetails) => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getItem: (productId: number) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      fulfillment: null,

      addItem: (product: Product, quantity = 1, fulfillment) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      fulfillment: fulfillment || item.fulfillment
                    }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity, fulfillment }],
          };
        });
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      updateItemFulfillment: (productId: number, fulfillment: { method: FulfillmentMethod; pickupLocation?: "yakima" | "toppenish" }) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, fulfillment } : item
          ),
        }));
      },

      updateItemShippingCost: (productId: number, shippingCost: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, shippingCost } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], fulfillment: null });
      },

      setFulfillment: (fulfillment: FulfillmentDetails) => {
        set({ fulfillment });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.product.price);
          return total + price * item.quantity;
        }, 0);
      },

      getItem: (productId: number) => {
        return get().items.find((item) => item.product.id === productId);
      },
    }),
    {
      name: "cascade-cart",
      partialize: (state) => ({
        items: state.items,
        fulfillment: state.fulfillment,
      }),
    }
  )
);
