"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useLocationStore } from "@/stores/locationStore";
import { FulfillmentMethod } from "@/types";
import { cn } from "@/lib/utils";

interface FulfillmentSelectorProps {
  sku?: string;
  yakimaStock: number;
  onFulfillmentChange?: (method: FulfillmentMethod, pickupLocation?: "yakima" | "toppenish") => void;
}

type FulfillmentSelection =
  | { type: "pickup"; store: "yakima" | "toppenish" }
  | { type: "delivery" }
  | { type: "shipping" }
  | null;

export function FulfillmentSelector({ sku, yakimaStock, onFulfillmentChange }: FulfillmentSelectorProps) {
  const [selection, setSelection] = useState<FulfillmentSelection>(null);
  const [displayedStore, setDisplayedStore] = useState<"yakima" | "toppenish" | null>(null);

  const setFulfillment = useCartStore((state) => state.setFulfillment);
  const { fetchToppenishInventory, getToppenishStock } = useInventoryStore();
  const selectedLocationId = useLocationStore((state) => state.selectedLocationId);

  // Fetch Toppenish inventory
  useEffect(() => {
    if (sku) {
      fetchToppenishInventory([sku]);
    }
  }, [sku, fetchToppenishInventory]);

  const toppenishStock = sku ? getToppenishStock(sku) : 0;

  // Auto-select store based on customer's selected location
  useEffect(() => {
    if (!selection) {
      // Start with the customer's preferred store
      const preferredStore = selectedLocationId === 1 ? "yakima" : "toppenish";
      const preferredStock = preferredStore === "yakima" ? yakimaStock : toppenishStock;
      const otherStore = preferredStore === "yakima" ? "toppenish" : "yakima";
      const otherStock = otherStore === "yakima" ? yakimaStock : toppenishStock;

      // If preferred store has stock, select it
      if (preferredStock > 0) {
        setDisplayedStore(preferredStore);
        setSelection({ type: "pickup", store: preferredStore });
      }
      // If only other store has stock, show that instead
      else if (otherStock > 0) {
        setDisplayedStore(otherStore);
        setSelection({ type: "pickup", store: otherStore });
      }
      // If neither has stock, still show preferred store
      else {
        setDisplayedStore(preferredStore);
      }
    }
  }, [yakimaStock, toppenishStock, selection, selectedLocationId]);

  // Update cart store when selection changes
  useEffect(() => {
    if (!selection) return;

    if (selection.type === "pickup") {
      setFulfillment({ method: "pickup", pickupLocation: selection.store });
      onFulfillmentChange?.("pickup", selection.store);
    } else if (selection.type === "delivery") {
      setFulfillment({ method: "delivery" });
      onFulfillmentChange?.("delivery");
    } else if (selection.type === "shipping") {
      setFulfillment({ method: "shipping" });
      onFulfillmentChange?.("shipping");
    }
  }, [selection, setFulfillment, onFulfillmentChange]);

  const isStoreSelected = (store: "yakima" | "toppenish") =>
    selection?.type === "pickup" && selection.store === store;

  // Don't render until we know which store to display
  if (!displayedStore) return null;

  return (
    <div className="space-y-3">
      {/* Pickup Today */}
      <div>
        <button
          type="button"
          onClick={() => {
            if (displayedStore === "yakima" && yakimaStock > 0) {
              setSelection({ type: "pickup", store: "yakima" });
            } else if (displayedStore === "toppenish" && toppenishStock > 0) {
              setSelection({ type: "pickup", store: "toppenish" });
            }
          }}
          disabled={displayedStore === "yakima" ? yakimaStock === 0 : toppenishStock === 0}
          className={cn(
            "w-full flex items-center justify-between text-left transition-all",
            (displayedStore === "yakima" ? yakimaStock === 0 : toppenishStock === 0)
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
              isStoreSelected(displayedStore) ? "border-primary bg-primary" : "border-neutral-300"
            )}>
              {isStoreSelected(displayedStore) && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-900">
                  Pickup Today at {displayedStore === "yakima" ? "Yakima" : "Toppenish"}
                </span>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">FREE</span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {displayedStore === "yakima" ? "1214 S 3rd Ave, Yakima, WA" : "311 S Toppenish Ave, Toppenish, WA"}
              </p>
            </div>
          </div>
          <span className={cn(
            "text-sm font-medium",
            (displayedStore === "yakima" ? yakimaStock : toppenishStock) > 0 ? "text-green-600" : "text-neutral-400"
          )}>
            {(displayedStore === "yakima" ? yakimaStock : toppenishStock) > 0
              ? `${displayedStore === "yakima" ? yakimaStock : toppenishStock} in stock`
              : "Out of stock"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setDisplayedStore(displayedStore === "yakima" ? "toppenish" : "yakima")}
          className="text-xs text-blue-600 hover:text-blue-700 underline mt-1 ml-7"
        >
          Check {displayedStore === "yakima" ? "Toppenish" : "Yakima"} store
        </button>
      </div>

      {/* Local Delivery */}
      <button
        type="button"
        onClick={() => setSelection({ type: "delivery" })}
        className="w-full flex items-center gap-3 text-left"
      >
        <div className={cn(
          "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
          selection?.type === "delivery" ? "border-primary bg-primary" : "border-neutral-300"
        )}>
          {selection?.type === "delivery" && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-900">Local Delivery</span>
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">FREE</span>
        </div>
      </button>

      {/* Shipping */}
      <button
        type="button"
        onClick={() => setSelection({ type: "shipping" })}
        className="w-full flex items-center gap-3 text-left"
      >
        <div className={cn(
          "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
          selection?.type === "shipping" ? "border-primary bg-primary" : "border-neutral-300"
        )}>
          {selection?.type === "shipping" && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <span className="font-medium text-neutral-900">Ship to Address</span>
      </button>
    </div>
  );
}
