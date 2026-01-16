"use client";

import { MapPin, Phone } from "lucide-react";
import { useLocationStore } from "@/stores/locationStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useEffect } from "react";

interface LocationStockProps {
  stockQuantity: number | null;
  sku?: string;
}

export function LocationStock({ stockQuantity, sku }: LocationStockProps) {
  const selectedLocationId = useLocationStore((state) => state.selectedLocationId);
  const locationName = useLocationStore((state) => state.getLocationName());
  const locationInfo = useLocationStore((state) => state.getLocationInfo());

  const { fetchToppenishInventory, getToppenishStock } = useInventoryStore();

  useEffect(() => {
    if (sku) {
      fetchToppenishInventory([sku]);
    }
  }, [sku, fetchToppenishInventory]);

  // Get stock based on selected location
  const yakimaStock = stockQuantity ?? 0;
  const toppenishStock = sku ? getToppenishStock(sku) : 0;
  const stockForLocation = selectedLocationId === 1 ? yakimaStock : toppenishStock;

  const getStockColor = (quantity: number) => {
    if (quantity === 0) return "text-red-600";
    if (quantity <= 5) return "text-amber-600";
    return "text-green-600";
  };

  const getStockBgColor = (quantity: number) => {
    if (quantity === 0) return "bg-red-50";
    if (quantity <= 5) return "bg-amber-50";
    return "bg-green-50";
  };

  return (
    <div className={`rounded-lg p-4 ${getStockBgColor(stockForLocation)}`}>
      <h3 className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Stock at {locationName}
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">{locationInfo.address}</span>
          <span className={`font-bold text-lg ${getStockColor(stockForLocation)}`}>
            {stockForLocation > 0 ? `${stockForLocation} available` : "Out of stock"}
          </span>
        </div>

        {/* Toppenish contact info - only show if no SKU (can't look up stock) */}
        {selectedLocationId === 2 && !sku && (
          <div className="pt-3 border-t border-amber-200">
            <p className="text-sm text-amber-700 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call to confirm availability at Toppenish.
            </p>
            <a
              href="tel:+15098658544"
              className="inline-block mt-2 text-sm font-medium text-amber-800 hover:text-amber-900 underline"
            >
              Call (509) 865-8544
            </a>
          </div>
        )}

        {/* Low stock warning */}
        {stockForLocation > 0 && stockForLocation <= 5 && (
          <p className="text-sm text-amber-700">
            Low stock - order soon!
          </p>
        )}
      </div>
    </div>
  );
}
