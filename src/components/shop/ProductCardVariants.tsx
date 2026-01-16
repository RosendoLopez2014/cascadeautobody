"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Plus, Check, Eye, CheckCircle, XCircle, MapPin, Truck, Package } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useLocationStore } from "@/stores/locationStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: Product;
}

// Shared hook for cart and location functionality
function useProductCard(product: Product) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) => state.getItem(product.id));
  const selectedLocationId = useLocationStore((state) => state.selectedLocationId);
  const { fetchToppenishInventory, getToppenishStock } = useInventoryStore();
  const [justAdded, setJustAdded] = useState(false);

  // Fetch Toppenish inventory for this product
  useEffect(() => {
    if (product.sku) {
      fetchToppenishInventory([product.sku]);
    }
  }, [product.sku, fetchToppenishInventory]);

  // Get location name and stock based on selected location
  const locationName = selectedLocationId === 1 ? "Yakima" : "Toppenish";
  const yakimaStock = product.stock_quantity ?? 0;
  const toppenishStock = product.sku ? getToppenishStock(product.sku) : 0;
  const stockForLocation = selectedLocationId === 1 ? yakimaStock : toppenishStock;
  // Product is in stock if available at ANY location (since customers can buy from either)
  const isInStock = yakimaStock > 0 || toppenishStock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInStock && !justAdded) {
      addItem(product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/shop/product/${product.slug}`;
  };

  return {
    addItem,
    cartItem,
    isInStock,
    handleAddToCart,
    handleQuickView,
    justAdded,
    locationName,
    stockForLocation,
    selectedLocationId,
    yakimaStock,
    toppenishStock
  };
}

// ============================================
// COMPACT GRID - Smaller cards, more products visible
// ============================================
export function ProductCardCompact({ product }: ProductCardProps) {
  const { cartItem, isInStock, handleAddToCart, locationName, stockForLocation, selectedLocationId, yakimaStock, toppenishStock } = useProductCard(product);
  const mainImage = product.images[0];
  // Show "Available at other location" when product has no stock at selected location
  const showYakimaAvailable = selectedLocationId === 2 && stockForLocation === 0 && yakimaStock > 0;
  const showToppenishAvailable = selectedLocationId === 1 && stockForLocation === 0 && toppenishStock > 0;

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
        {/* Stock at both locations */}
        <div className="flex items-center gap-2 text-xs mt-1">
          {selectedLocationId === 1 ? (
            <>
              <span className={cn("font-medium", yakimaStock > 0 ? "text-green-600" : "text-neutral-400")}>Y</span>
              <span className="text-neutral-300">|</span>
              <span className={cn("font-medium", toppenishStock > 0 ? "text-green-600" : "text-neutral-400")}>T</span>
            </>
          ) : (
            <>
              <span className={cn("font-medium", toppenishStock > 0 ? "text-green-600" : "text-neutral-400")}>T</span>
              <span className="text-neutral-300">|</span>
              <span className={cn("font-medium", yakimaStock > 0 ? "text-green-600" : "text-neutral-400")}>Y</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// ============================================
// DETAILED CARDS - New design with stock badge and dual buttons
// ============================================
export function ProductCardDetailed({ product }: ProductCardProps) {
  const { cartItem, isInStock, handleAddToCart, handleQuickView, justAdded, yakimaStock, toppenishStock, selectedLocationId } = useProductCard(product);
  const mainImage = product.images[0];

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-all"
    >
      {/* Image */}
      <div className="relative aspect-square bg-neutral-100">
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

        {/* Stock Badge - Top Left */}
        <div
          className={cn(
            "absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm",
            isInStock
              ? "bg-green-500 text-white"
              : "bg-neutral-200 text-neutral-600"
          )}
        >
          {isInStock ? (
            <>
              <CheckCircle className="h-3.5 w-3.5" />
              <span>In Stock</span>
            </>
          ) : (
            <>
              <XCircle className="h-3.5 w-3.5" />
              <span>Out of Stock</span>
            </>
          )}
        </div>

        {/* Sale badge - Top Right */}
        {product.on_sale && (
          <span className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            Sale
          </span>
        )}

        {/* Cart indicator badge */}
        {cartItem && (
          <div className="absolute bottom-3 right-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Check className="h-3 w-3" />
            {cartItem.quantity}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors mb-2 min-h-[2.5rem]">
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

        {/* Fulfillment Options */}
        <div className="space-y-2 text-sm mb-4">
          {/* Pickup */}
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-neutral-900">Pickup today</span>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                {selectedLocationId === 1 ? (
                  <>
                    <span className={cn("font-medium", yakimaStock > 0 ? "text-green-600" : "text-neutral-400")}>Yakima</span>
                    <span className="text-neutral-300">|</span>
                    <span className={cn("font-medium", toppenishStock > 0 ? "text-green-600" : "text-neutral-400")}>Toppenish</span>
                  </>
                ) : (
                  <>
                    <span className={cn("font-medium", toppenishStock > 0 ? "text-green-600" : "text-neutral-400")}>Toppenish</span>
                    <span className="text-neutral-300">|</span>
                    <span className={cn("font-medium", yakimaStock > 0 ? "text-green-600" : "text-neutral-400")}>Yakima</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Local Delivery */}
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="font-medium text-neutral-900">Local delivery</span>
          </div>

          {/* Shipping */}
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="font-medium text-neutral-900">Ships nationwide</span>
          </div>
        </div>

        {/* Action Buttons - Stacked */}
        <div className="space-y-2">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all",
              justAdded
                ? "bg-green-500 text-white"
                : isInStock
                ? "bg-secondary hover:bg-secondary/90 text-white"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            )}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
          >
            <Eye className="h-4 w-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// LIST VIEW - Horizontal layout
// ============================================
export function ProductCardList({ product }: ProductCardProps) {
  const { cartItem, isInStock, handleAddToCart, justAdded, yakimaStock, toppenishStock, selectedLocationId } = useProductCard(product);
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

          {/* Fulfillment Options */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              <span className="text-neutral-600">Pickup:</span>
              {selectedLocationId === 1 ? (
                <>
                  <span className={cn("font-medium", yakimaStock > 0 ? "text-green-600" : "text-neutral-400")}>Yakima</span>
                  <span className="text-neutral-300">|</span>
                  <span className={cn("font-medium", toppenishStock > 0 ? "text-green-600" : "text-neutral-400")}>Toppenish</span>
                </>
              ) : (
                <>
                  <span className={cn("font-medium", toppenishStock > 0 ? "text-green-600" : "text-neutral-400")}>Toppenish</span>
                  <span className="text-neutral-300">|</span>
                  <span className={cn("font-medium", yakimaStock > 0 ? "text-green-600" : "text-neutral-400")}>Yakima</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-green-600" />
              <span className="text-neutral-600">Delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5 text-green-600" />
              <span className="text-neutral-600">Ships</span>
            </div>
          </div>
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
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-colors",
                justAdded
                  ? "bg-green-500 text-white"
                  : "bg-primary text-white hover:bg-primary-800"
              )}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add
                </>
              )}
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
  const { cartItem, isInStock, handleAddToCart, handleQuickView, justAdded, yakimaStock, toppenishStock, selectedLocationId } = useProductCard(product);
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

        {/* Stock Badge */}
        <div
          className={cn(
            "absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm",
            isInStock
              ? "bg-green-500 text-white"
              : "bg-neutral-200 text-neutral-600"
          )}
        >
          {isInStock ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>In Stock</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              <span>Out of Stock</span>
            </>
          )}
        </div>

        {/* Sale badge */}
        {product.on_sale && (
          <span className="absolute top-4 right-4 bg-secondary text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
            Sale
          </span>
        )}

        {/* Cart indicator overlay */}
        {cartItem && (
          <div className="absolute bottom-4 right-4 bg-primary text-white text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
            <Check className="h-4 w-4" />
            {cartItem.quantity} in cart
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category */}
        {product.categories[0] && (
          <span className="text-xs text-neutral-400 uppercase tracking-wider">
            {product.categories[0].name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.on_sale && product.regular_price !== product.price && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>

        {/* Fulfillment Options */}
        <div className="space-y-2 text-sm">
          {/* Pickup */}
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-neutral-900">Pickup today</span>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                {selectedLocationId === 1 ? (
                  <>
                    <span className={cn("font-medium", yakimaStock > 0 ? "text-green-600" : "text-neutral-400")}>Yakima</span>
                    <span className="text-neutral-300">|</span>
                    <span className={cn("font-medium", toppenishStock > 0 ? "text-green-600" : "text-neutral-400")}>Toppenish</span>
                  </>
                ) : (
                  <>
                    <span className={cn("font-medium", toppenishStock > 0 ? "text-green-600" : "text-neutral-400")}>Toppenish</span>
                    <span className="text-neutral-300">|</span>
                    <span className={cn("font-medium", yakimaStock > 0 ? "text-green-600" : "text-neutral-400")}>Yakima</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Local Delivery & Shipping */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-green-600" />
              <span className="text-neutral-700">Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="h-4 w-4 text-green-600" />
              <span className="text-neutral-700">Ships</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all",
              justAdded
                ? "bg-green-500 text-white"
                : isInStock
                ? "bg-secondary hover:bg-secondary/90 text-white"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            )}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={handleQuickView}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
          >
            <Eye className="h-4 w-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

// Export view type for shop page
export type ProductViewType = "compact" | "detailed" | "list" | "hero";
