import { create } from "zustand";

export interface ToppenishInventoryItem {
  sku: string;
  product_name: string;
  total_stock: number;
  open_stock: number;
  price: number;
}

interface InventoryState {
  toppenishInventory: Record<string, ToppenishInventoryItem>;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchToppenishInventory: (skus?: string[]) => Promise<void>;
  getToppenishStock: (sku: string) => number;
  existsInToppenish: (sku: string) => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useInventoryStore = create<InventoryState>((set, get) => ({
  toppenishInventory: {},
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchToppenishInventory: async (skus?: string[]) => {
    const state = get();

    // Skip if we have fresh data
    if (
      state.lastFetched &&
      Date.now() - state.lastFetched < CACHE_DURATION &&
      !skus
    ) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const url = skus
        ? `/api/inventory/toppenish?skus=${skus.join(",")}`
        : "/api/inventory/toppenish";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }

      const data = await response.json();

      set((state) => ({
        toppenishInventory: {
          ...state.toppenishInventory,
          ...data.inventory,
        },
        isLoading: false,
        lastFetched: Date.now(),
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  getToppenishStock: (sku: string) => {
    const item = get().toppenishInventory[sku];
    return item?.open_stock ?? 0;
  },

  existsInToppenish: (sku: string) => {
    return sku in get().toppenishInventory;
  },
}));
