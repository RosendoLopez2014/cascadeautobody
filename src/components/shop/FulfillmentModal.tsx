"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useLocationStore } from "@/stores/locationStore";
import { FulfillmentMethod } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface FulfillmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (fulfillment: { method: FulfillmentMethod; pickupLocation?: "yakima" | "toppenish" }) => void;
  yakimaStock: number;
  toppenishStock: number;
  currentFulfillment?: {
    method: FulfillmentMethod;
    pickupLocation?: "yakima" | "toppenish";
  };
  sku?: string;
}

export function FulfillmentModal({
  isOpen,
  onClose,
  onSelect,
  yakimaStock,
  toppenishStock,
  currentFulfillment,
  sku,
}: FulfillmentModalProps) {
  const [selection, setSelection] = useState<{
    type: "pickup" | "delivery" | "shipping";
    store?: "yakima" | "toppenish";
  } | null>(null);
  const [displayedStore, setDisplayedStore] = useState<"yakima" | "toppenish" | null>(null);

  const { fetchToppenishInventory, getToppenishStock } = useInventoryStore();
  const selectedLocationId = useLocationStore((state) => state.selectedLocationId);
  const defaultStore = selectedLocationId === 1 ? "yakima" : "toppenish";

  // Fetch Toppenish inventory
  useEffect(() => {
    if (sku && isOpen) {
      fetchToppenishInventory([sku]);
    }
  }, [sku, isOpen, fetchToppenishInventory]);

  const currentToppenishStock = sku ? getToppenishStock(sku) : toppenishStock;

  // Initialize with current selection or default
  useEffect(() => {
    if (!selection && displayedStore === null) {
      if (currentFulfillment) {
        if (currentFulfillment.method === "pickup") {
          setSelection({ type: "pickup", store: currentFulfillment.pickupLocation });
          setDisplayedStore(currentFulfillment.pickupLocation || defaultStore);
        } else if (currentFulfillment.method === "delivery") {
          setSelection({ type: "delivery" });
          setDisplayedStore(defaultStore);
        } else if (currentFulfillment.method === "shipping") {
          setSelection({ type: "shipping" });
          setDisplayedStore(defaultStore);
        }
      } else {
        // Default to pickup at selected location
        setSelection({ type: "pickup", store: defaultStore });
        setDisplayedStore(defaultStore);
      }
    }
  }, [currentFulfillment, selection, displayedStore, defaultStore]);

  const handleSelect = () => {
    if (!selection) return;

    if (selection.type === "pickup" && selection.store) {
      onSelect({ method: "pickup", pickupLocation: selection.store });
    } else if (selection.type === "delivery") {
      onSelect({ method: "delivery" });
    } else if (selection.type === "shipping") {
      onSelect({ method: "shipping" });
    }

    onClose();
  };

  if (!isOpen) return null;

  const currentStoreStock = displayedStore === "yakima" ? yakimaStock : currentToppenishStock;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Select Fulfillment</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {/* Pickup Today */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (displayedStore === "yakima" && yakimaStock > 0) {
                  setSelection({ type: "pickup", store: "yakima" });
                } else if (displayedStore === "toppenish" && currentToppenishStock > 0) {
                  setSelection({ type: "pickup", store: "toppenish" });
                }
              }}
              disabled={displayedStore === "yakima" ? yakimaStock === 0 : currentToppenishStock === 0}
              className={cn(
                "w-full flex items-center justify-between text-left transition-all",
                (displayedStore === "yakima" ? yakimaStock === 0 : currentToppenishStock === 0)
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  selection?.type === "pickup" && selection?.store === displayedStore ? "border-blue-600 bg-blue-600" : "border-neutral-300"
                )}>
                  {selection?.type === "pickup" && selection?.store === displayedStore && <div className="w-2 h-2 rounded-full bg-white" />}
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
                currentStoreStock > 0 ? "text-green-600" : "text-neutral-400"
              )}>
                {currentStoreStock > 0 ? `${currentStoreStock} in stock` : "Out of stock"}
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
              selection?.type === "delivery" ? "border-blue-600 bg-blue-600" : "border-neutral-300"
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
              selection?.type === "shipping" ? "border-blue-600 bg-blue-600" : "border-neutral-300"
            )}>
              {selection?.type === "shipping" && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <span className="font-medium text-neutral-900">Ship to Address</span>
          </button>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selection}
            className="flex-1"
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );
}
