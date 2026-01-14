"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, getItemCount } =
    useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="h-24 w-24 text-neutral-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-neutral-600 mb-8">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link href="/shop">
            <Button size="lg">
              Start Shopping
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-neutral-500 hover:text-red-500 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            {/* Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-neutral-50 border-b border-neutral-200 text-sm font-medium text-neutral-600">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items */}
            <ul className="divide-y divide-neutral-200">
              {items.map((item) => {
                const mainImage = item.product.images[0];
                const price = parseFloat(item.product.price);
                return (
                  <li key={item.product.id} className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Product */}
                      <div className="sm:col-span-6 flex gap-4">
                        <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                          {mainImage ? (
                            <Image
                              src={mainImage.src}
                              alt={mainImage.alt || item.product.name}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-neutral-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-neutral-900 truncate">
                            {item.product.name}
                          </h3>
                          {item.product.sku && (
                            <p className="text-sm text-neutral-500">SKU: {item.product.sku}</p>
                          )}
                          {item.selectedLocation && (
                            <p className="text-sm text-primary">
                              Pickup: {item.selectedLocation}
                            </p>
                          )}
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="sm:hidden text-sm text-red-500 hover:text-red-600 mt-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="sm:col-span-2 text-center">
                        <span className="sm:hidden text-sm text-neutral-500 mr-2">
                          Price:
                        </span>
                        <span className="font-medium">{formatPrice(item.product.price)}</span>
                      </div>

                      {/* Quantity */}
                      <div className="sm:col-span-2 flex justify-center">
                        <div className="flex items-center border border-neutral-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-neutral-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-neutral-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Total & Remove */}
                      <div className="sm:col-span-2 flex items-center justify-end gap-4">
                        <span className="font-semibold text-neutral-900">
                          {formatPrice(String(price * item.quantity))}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="hidden sm:block p-1 text-neutral-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link
              href="/shop"
              className="text-primary hover:text-primary-700 font-medium"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Estimated Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>

            <p className="text-xs text-neutral-500 text-center mt-4">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
