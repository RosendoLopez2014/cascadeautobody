"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { InventoryBadge } from "./InventoryBadge";
import { useCartStore } from "@/stores/cartStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) => state.getItem(product.id));

  const mainImage = product.images[0];
  const isInStock = product.stock_status === "instock";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInStock) {
      addItem(product, 1);
    }
  };

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square bg-neutral-100">
        {mainImage ? (
          <Image
            src={mainImage.src}
            alt={mainImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
            No image
          </div>
        )}

        {/* Sale badge */}
        {product.on_sale && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
            Sale
          </span>
        )}

        {/* Quick add button */}
        {isInStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.categories[0] && (
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            {product.categories[0].name}
          </p>
        )}

        {/* Title */}
        <h3 className="font-medium text-neutral-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.on_sale && product.regular_price !== product.price && (
            <span className="text-sm text-neutral-500 line-through">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>

        {/* Inventory by location */}
        {product.inventory_by_location && (
          <InventoryBadge inventory={product.inventory_by_location} />
        )}

        {/* Out of stock message */}
        {!isInStock && (
          <p className="text-sm text-red-600 font-medium mt-2">Out of Stock</p>
        )}

        {/* Cart indicator */}
        {cartItem && (
          <p className="text-sm text-primary font-medium mt-2">
            {cartItem.quantity} in cart
          </p>
        )}
      </div>
    </Link>
  );
}
