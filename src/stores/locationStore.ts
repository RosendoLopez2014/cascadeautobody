import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCATIONS } from "@/lib/woocommerce";

export type LocationId = 1 | 2; // 1 = Yakima, 2 = Toppenish

interface LocationState {
  selectedLocationId: LocationId;
  setLocation: (locationId: LocationId) => void;
  getLocationName: () => string;
  getLocationInfo: () => typeof LOCATIONS.YAKIMA | typeof LOCATIONS.TOPPENISH;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      selectedLocationId: 1, // Default to Yakima

      setLocation: (locationId: LocationId) => {
        set({ selectedLocationId: locationId });
      },

      getLocationName: () => {
        const id = get().selectedLocationId;
        return id === 1 ? LOCATIONS.YAKIMA.name : LOCATIONS.TOPPENISH.name;
      },

      getLocationInfo: () => {
        const id = get().selectedLocationId;
        return id === 1 ? LOCATIONS.YAKIMA : LOCATIONS.TOPPENISH;
      },
    }),
    {
      name: "cascade-location",
    }
  )
);

// Helper hook to get stock for selected location
export function getStockForLocation(
  stockQuantity: number | null,
  selectedLocationId: LocationId
): number {
  // Yakima (id: 1) uses actual WooCommerce stock
  // Toppenish (id: 2) shows 0 for now until inventory sync is set up
  if (selectedLocationId === 1) {
    return stockQuantity ?? 0;
  }
  return 0; // Toppenish - no inventory data yet
}
