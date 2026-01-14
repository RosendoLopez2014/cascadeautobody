"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";

interface AddToCartProps {
  product: Product;
  showQuantity?: boolean;
}

export function AddToCart({ product, showQuantity = true }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) => state.getItem(product.id));

  const isInStock = product.stock_status === "instock";
  const maxQuantity = product.stock_quantity || 99;

  const handleAddToCart = () => {
    if (isInStock) {
      addItem(product, quantity);
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
      <Button disabled variant="outline" className="w-full">
        Out of Stock
      </Button>
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
