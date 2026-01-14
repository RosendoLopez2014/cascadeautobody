"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Plus, MapPin } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

// Shared hook for cart functionality
function useProductCard(product: Product) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) => state.getItem(product.id));
  const isInStock = product.stock_status === "instock";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInStock) {
      addItem(product, 1);
    }
  };

  return { addItem, cartItem, isInStock, handleAddToCart };
}

// ============================================
// COMPACT GRID - Smaller cards, more products visible
// ============================================
export function ProductCardCompact({ product }: ProductCardProps) {
  const { cartItem, isInStock, handleAddToCart } = useProductCard(product);
  const mainImage = product.images[0];

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group block bg-white rounded overflow-hidden border border-neutral-100 hover:border-neutral-200 transition-all hover:shadow-card-hover"
    >
      {/* Image - smaller aspect ratio */}
      <div className="relative aspect-[4/3] bg-neutral-50">
        {mainImage ? (
          <Image
            src={mainImage.src}
            alt={mainImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
            <ShoppingCart className="h-8 w-8" />
          </div>
        )}

        {/* Quick add */}
        {isInStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Add to cart"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}

        {/* Out of stock overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content - minimal */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-neutral-900 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-semibold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {cartItem && (
            <span className="text-xs text-secondary font-medium">{cartItem.quantity} in cart</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ============================================
// DETAILED CARDS - Current size with SKU, brand, more info
// ============================================
export function ProductCardDetailed({ product }: ProductCardProps) {
  const { cartItem, isInStock, handleAddToCart } = useProductCard(product);
  const mainImage = product.images[0];

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group block bg-white rounded-lg overflow-hidden border border-neutral-100 hover:shadow-card-hover transition-all"
    >
      {/* Image */}
      <div className="relative aspect-square bg-neutral-50">
        {mainImage ? (
          <Image
            src={mainImage.src}
            alt={mainImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}

        {/* Sale badge */}
        {product.on_sale && (
          <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-semibold px-2 py-1 rounded">
            Sale
          </span>
        )}

        {/* Quick add button */}
        {isInStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-2.5 bg-primary text-white rounded-lg shadow-soft opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-800"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        )}

        {!isInStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-medium text-neutral-600 bg-white px-3 py-1 rounded shadow-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & SKU */}
        <div className="flex items-center justify-between mb-2">
          {product.categories[0] && (
            <span className="text-xs text-neutral-400 uppercase tracking-wider">
              {product.categories[0].name}
            </span>
          )}
          {product.sku && (
            <span className="text-xs text-neutral-400 font-mono">
              {product.sku}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-medium text-neutral-900 line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.on_sale && product.regular_price !== product.price && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>

        {/* Stock by location */}
        {product.inventory_by_location && (
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            {product.inventory_by_location.map((loc) => (
              <span key={loc.location_id} className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {loc.location_name}:
                <span className={cn(
                  "font-medium",
                  loc.stock_quantity > 5 ? "text-green-600" :
                  loc.stock_quantity > 0 ? "text-amber-600" : "text-red-500"
                )}>
                  {loc.stock_quantity}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Cart indicator */}
        {cartItem && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <span className="text-sm text-secondary font-medium">
              {cartItem.quantity} in cart
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// ============================================
// LIST VIEW - Horizontal layout
// ============================================
export function ProductCardList({ product }: ProductCardProps) {
  const { cartItem, isInStock, handleAddToCart } = useProductCard(product);
  const mainImage = product.images[0];

  // Strip HTML tags for clean text display
  const stripHtml = (html: string) => {
    if (typeof window !== "undefined") {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    }
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group flex bg-white rounded-lg overflow-hidden border border-neutral-100 hover:shadow-card-hover transition-all"
    >
      {/* Image - fixed width */}
      <div className="relative w-32 sm:w-40 md:w-48 flex-shrink-0 bg-neutral-50">
        {mainImage ? (
          <Image
            src={mainImage.src}
            alt={mainImage.alt || product.name}
            fill
            sizes="200px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
            <ShoppingCart className="h-8 w-8" />
          </div>
        )}

        {product.on_sale && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs font-semibold px-1.5 py-0.5 rounded">
            Sale
          </span>
        )}

        {!isInStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-medium text-neutral-500">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          {/* Category & SKU row */}
          <div className="flex items-center gap-3 mb-1">
            {product.categories[0] && (
              <span className="text-xs text-neutral-400 uppercase tracking-wider">
                {product.categories[0].name}
              </span>
            )}
            {product.sku && (
              <span className="text-xs text-neutral-400 font-mono">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-medium text-neutral-900 line-clamp-1 group-hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>

          {/* Description excerpt - safely rendered as plain text */}
          {product.short_description && (
            <p className="text-sm text-neutral-500 line-clamp-2 mb-2">
              {stripHtml(product.short_description)}
            </p>
          )}

          {/* Stock by location */}
          {product.inventory_by_location && (
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              {product.inventory_by_location.map((loc) => (
                <span key={loc.location_id} className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {loc.location_name}:
                  <span className={cn(
                    "font-medium",
                    loc.stock_quantity > 5 ? "text-green-600" :
                    loc.stock_quantity > 0 ? "text-amber-600" : "text-red-500"
                  )}>
                    {loc.stock_quantity}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom row: price + add to cart */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.on_sale && product.regular_price !== product.price && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
            {cartItem && (
              <span className="text-sm text-secondary font-medium ml-2">
                ({cartItem.quantity} in cart)
              </span>
            )}
          </div>

          {isInStock && (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded hover:bg-primary-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

// ============================================
// LARGE HERO CARDS - Bigger images, premium feel
// ============================================
export function ProductCardHero({ product }: ProductCardProps) {
  const { cartItem, isInStock, handleAddToCart } = useProductCard(product);
  const mainImage = product.images[0];

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-neutral-100 hover:shadow-card-hover transition-all"
    >
      {/* Large Image */}
      <div className="relative aspect-[4/5] bg-neutral-50">
        {mainImage ? (
          <Image
            src={mainImage.src}
            alt={mainImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
            <ShoppingCart className="h-16 w-16" />
          </div>
        )}

        {/* Gradient overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Sale badge */}
        {product.on_sale && (
          <span className="absolute top-4 left-4 bg-secondary text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
            Sale
          </span>
        )}

        {/* Quick add button */}
        {isInStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-primary font-medium rounded-lg shadow-soft opacity-0 group-hover:opacity-100 transition-all hover:bg-neutral-50"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        )}

        {!isInStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span className="text-base font-medium text-neutral-700 bg-white px-4 py-2 rounded-lg shadow-sm">Out of Stock</span>
          </div>
        )}

        {/* Cart indicator overlay */}
        {cartItem && (
          <div className="absolute top-4 right-4 bg-secondary text-white text-sm font-medium px-2 py-1 rounded">
            {cartItem.quantity} in cart
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        {product.categories[0] && (
          <span className="text-xs text-neutral-400 uppercase tracking-wider mb-2 block">
            {product.categories[0].name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.on_sale && product.regular_price !== product.price && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>

        {/* Stock by location */}
        {product.inventory_by_location && (
          <div className="flex items-center gap-4 text-sm">
            {product.inventory_by_location.map((loc) => (
              <div key={loc.location_id} className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-neutral-400" />
                <span className="text-neutral-600">{loc.location_name}:</span>
                <span className={cn(
                  "font-semibold",
                  loc.stock_quantity > 5 ? "text-green-600" :
                  loc.stock_quantity > 0 ? "text-amber-600" : "text-red-500"
                )}>
                  {loc.stock_quantity > 0 ? loc.stock_quantity : "Out"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// Export view type for shop page
export type ProductViewType = "compact" | "detailed" | "list" | "hero";
