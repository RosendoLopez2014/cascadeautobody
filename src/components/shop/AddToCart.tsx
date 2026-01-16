"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useLocationStore } from "@/stores/locationStore";

interface AddToCartProps {
  product: Product;
  showQuantity?: boolean;
}

export function AddToCart({ product, showQuantity = true }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) => state.getItem(product.id));

  const { fetchToppenishInventory, getToppenishStock } = useInventoryStore();

  // Fetch Toppenish inventory
  useEffect(() => {
    if (product.sku) {
      fetchToppenishInventory([product.sku]);
    }
  }, [product.sku, fetchToppenishInventory]);

  // Check stock across both locations
  const yakimaStock = product.stock_quantity ?? 0;
  const toppenishStock = product.sku ? getToppenishStock(product.sku) : 0;
  const totalStock = yakimaStock + toppenishStock;
  const isInStock = totalStock > 0;
  const maxQuantity = totalStock || 99;

  const selectedLocationId = useLocationStore((state) => state.selectedLocationId);
  const selectedStore = selectedLocationId === 1 ? "yakima" : "toppenish";
  const cartFulfillment = useCartStore((state) => state.fulfillment);

  const handleAddToCart = () => {
    if (isInStock) {
      // Default to free local pickup at customer's selected store
      let fulfillmentToAdd = {
        method: "pickup" as const,
        pickupLocation: selectedStore,
      };

      // If they explicitly selected a different fulfillment method on the product page, use that
      if (cartFulfillment) {
        fulfillmentToAdd = {
          method: cartFulfillment.method,
          pickupLocation: cartFulfillment.pickupLocation as "yakima" | "toppenish" | undefined,
        };
      }

      addItem(product, quantity, fulfillmentToAdd);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (!isInStock) {
    return (
      <div className="space-y-2">
        <Button disabled variant="outline" className="w-full">
          Out of Stock
        </Button>
        <p className="text-sm text-center text-neutral-500">
          This item is currently unavailable at all locations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {showQuantity && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-700">Quantity:</span>
          <div className="flex items-center border border-neutral-300 rounded-md">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= maxQuantity}
              className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        variant={added ? "secondary" : "primary"}
        size="lg"
        className="w-full"
      >
        {added ? (
          <>
            <Check className="h-5 w-5 mr-2" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </>
        )}
      </Button>

      {cartItem && !added && (
        <p className="text-sm text-center text-primary">
          {cartItem.quantity} already in cart
        </p>
      )}
    </div>
  );
}
