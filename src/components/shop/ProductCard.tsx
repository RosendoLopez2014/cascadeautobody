"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Eye, CheckCircle, XCircle, Truck, Package } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";
import { useSafeLocationId } from "@/hooks/useSafeLocation";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) => state.getItem(product.id));
  const [justAdded, setJustAdded] = useState(false);
  const { locationId: selectedLocationId } = useSafeLocationId();

  const mainImage = product.images[0];

  // Stock for both locations - use inventory_by_location from backend calculation
  const yakimaInventory = product.inventory_by_location?.find(loc => loc.location_id === 1);
  const toppenishInventory = product.inventory_by_location?.find(loc => loc.location_id === 2);

  const yakimaStock = yakimaInventory?.stock_quantity ?? 0;
  const toppenishStock = toppenishInventory?.stock_quantity ?? 0;
  const totalStock = yakimaStock + toppenishStock;
  const isInStock = totalStock > 0;

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
    // Navigate to product page - could be converted to modal later
    window.location.href = `/shop/product/${product.slug}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link
        href={`/shop/product/${product.slug}`}
        className="group block"
      >
        <motion.article
          className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
          whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Image Container */}
          <div className="relative aspect-square bg-neutral-100 overflow-hidden">
            {mainImage ? (
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Image
                  src={mainImage.src}
                  alt={mainImage.alt || product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                <ShoppingCart className="h-12 w-12" />
              </div>
            )}

            {/* Stock Badge - Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                isInStock
                  ? "bg-green-500 text-white"
                  : "bg-neutral-200 text-neutral-600"
              }`}
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
            </motion.div>

            {/* Sale Badge - Top Right */}
            <AnimatePresence>
              {product.on_sale && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                >
                  Sale
                </motion.span>
              )}
            </AnimatePresence>

            {/* Cart indicator badge */}
            <AnimatePresence>
              {cartItem && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute bottom-3 right-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />
                  {cartItem.quantity}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Product Name */}
            <h3 className="font-bold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors text-base">
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
                {(yakimaStock > 0 || toppenishStock > 0) ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span className="font-medium text-neutral-900">Pickup today</span>
                  {(yakimaStock > 0 || toppenishStock > 0) ? (
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                      {yakimaStock > 0 && (
                        <span className="font-medium text-green-600">
                          Yakima
                        </span>
                      )}
                      {yakimaStock > 0 && toppenishStock > 0 && (
                        <span className="text-neutral-300">|</span>
                      )}
                      {toppenishStock > 0 && (
                        <span className="font-medium text-green-600">
                          Toppenish
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-red-600 mt-0.5">
                      Out of stock
                    </div>
                  )}
                </div>
              </div>

              {/* Local Delivery */}
              <div className="flex items-center gap-2">
                <Truck className={`h-4 w-4 flex-shrink-0 ${isInStock ? 'text-green-600' : 'text-red-600'}`} />
                <span className="font-medium text-neutral-900">Local delivery</span>
              </div>

              {/* Shipping */}
              <div className="flex items-center gap-2">
                <Package className={`h-4 w-4 flex-shrink-0 ${isInStock ? 'text-green-600' : 'text-red-600'}`} />
                <span className="font-medium text-neutral-900">Ships nationwide</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  justAdded
                    ? "bg-green-500 text-white"
                    : isInStock
                    ? "bg-secondary hover:bg-secondary/90 text-white"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }`}
                whileHover={isInStock && !justAdded ? { scale: 1.02 } : {}}
                whileTap={isInStock && !justAdded ? { scale: 0.98 } : {}}
              >
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.div
                      key="added"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>Added!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Quick View Button */}
              <motion.button
                onClick={handleQuickView}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm border-2 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="h-4 w-4" />
                <span>Quick View</span>
              </motion.button>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
