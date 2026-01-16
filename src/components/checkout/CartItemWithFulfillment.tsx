"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { FulfillmentModal } from "@/components/shop";
import { Button } from "@/components/ui";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useLocationStore } from "@/stores/locationStore";
import { useEffect } from "react";

interface CartItemWithFulfillmentProps {
  item: CartItem;
  onFulfillmentChange: (fulfillment: { method: "pickup" | "delivery" | "shipping"; pickupLocation?: "yakima" | "toppenish" }) => void;
}

export function CartItemWithFulfillment({ item, onFulfillmentChange }: CartItemWithFulfillmentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainImage = item.product.images[0];
  const price = parseFloat(item.product.price);
  const totalPrice = price * item.quantity;

  const { fetchToppenishInventory, getToppenishStock } = useInventoryStore();
  const selectedLocationId = useLocationStore((state) => state.selectedLocationId);
  const toppenishStock = item.product.sku ? getToppenishStock(item.product.sku) : 0;
  const yakimaStock = item.product.stock_quantity ?? 0;

  useEffect(() => {
    if (item.product.sku) {
      fetchToppenishInventory([item.product.sku]);
    }
  }, [item.product.sku, fetchToppenishInventory]);

  const getFulfillmentLabel = () => {
    // If no fulfillment selected, default to pickup at their selected store
    const fulfillment = item.fulfillment || {
      method: "pickup" as const,
      pickupLocation: selectedLocationId === 1 ? "yakima" : "toppenish",
    };

    if (fulfillment.method === "pickup") {
      return `Pickup at ${fulfillment.pickupLocation === "yakima" ? "Yakima" : "Toppenish"}`;
    }
    if (fulfillment.method === "delivery") return "Local Delivery";
    if (fulfillment.method === "shipping") return "Ship to Address";
    return "Not selected";
  };

  // Get the current fulfillment (with default)
  const currentFulfillment = item.fulfillment || {
    method: "pickup" as const,
    pickupLocation: selectedLocationId === 1 ? "yakima" : "toppenish",
  };

  return (
    <>
      <div className="flex gap-4 py-4 border-b border-neutral-200 last:border-b-0">
        {/* Product Image */}
        <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 relative">
          {mainImage ? (
            <Image
              src={mainImage.src}
              alt={mainImage.alt || item.product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-6 w-6 text-neutral-300" />
            </div>
          )}
          <span className="absolute -top-2 -right-2 bg-neutral-700 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
            {item.quantity}
          </span>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-neutral-900">{item.product.name}</h3>
          <p className="text-xs text-neutral-500 mt-1">
            {formatPrice(item.product.price)} × {item.quantity} = {formatPrice(String(totalPrice))}
          </p>

          {/* Fulfillment Selection */}
          <div className="mt-2">
            <p className="text-xs text-neutral-600 mb-1">
              Fulfillment: <span className="font-medium text-neutral-900">{getFulfillmentLabel()}</span>
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Change fulfillment method
            </button>
          </div>
        </div>

        {/* Fulfillment Cost */}
        <div className="text-right flex-shrink-0">
          {currentFulfillment.method === "pickup" ? (
            <div className="text-sm font-medium text-green-600">Free</div>
          ) : currentFulfillment.method === "delivery" ? (
            <div className="text-sm font-medium text-green-600">Free</div>
          ) : (
            <div className="text-sm font-medium text-neutral-900">
              {item.shippingCost !== undefined ? formatPrice(String(item.shippingCost)) : "$0.00"}
            </div>
          )}
        </div>
      </div>

      {/* Fulfillment Modal */}
      <FulfillmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(fulfillment) => {
          onFulfillmentChange(fulfillment);
        }}
        yakimaStock={yakimaStock}
        toppenishStock={toppenishStock}
        currentFulfillment={item.fulfillment}
        sku={item.product.sku}
      />
    </>
  );
}
