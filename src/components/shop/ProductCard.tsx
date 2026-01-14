"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { InventoryBadge } from "./InventoryBadge";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) => state.getItem(product.id));
  const [justAdded, setJustAdded] = useState(false);

  const mainImage = product.images[0];
  const isInStock = product.stock_status === "instock";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInStock && !justAdded) {
      addItem(product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
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
          className="bg-white rounded-2xl border border-neutral-200 overflow-hidden"
          whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Image */}
          <div className="relative aspect-square bg-neutral-100 overflow-hidden">
            {mainImage ? (
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.05 }}
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
                No image
              </div>
            )}

            {/* Sale badge */}
            <AnimatePresence>
              {product.on_sale && (
                <motion.span
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                >
                  Sale
                </motion.span>
              )}
            </AnimatePresence>

            {/* Quick add button */}
            {isInStock && (
              <motion.button
                onClick={handleAddToCart}
                className="absolute bottom-3 right-3 p-3 bg-white rounded-full shadow-lg"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: justAdded ? "#22c55e" : "#18181b",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                aria-label="Add to cart"
                style={{
                  backgroundColor: justAdded ? "#22c55e" : undefined,
                  color: justAdded ? "white" : undefined,
                }}
              >
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="h-5 w-5 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cart"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="group-hover:text-white transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            {product.categories[0] && (
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5">
                {product.categories[0].name}
              </p>
            )}

            {/* Title */}
            <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
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

            {/* Inventory by location */}
            {product.inventory_by_location && (
              <InventoryBadge inventory={product.inventory_by_location} />
            )}

            {/* Out of stock message */}
            {!isInStock && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 font-medium mt-2"
              >
                Out of Stock
              </motion.p>
            )}

            {/* Cart indicator */}
            <AnimatePresence>
              {cartItem && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-primary font-medium mt-2 flex items-center gap-1"
                >
                  <Check className="h-3.5 w-3.5" />
                  {cartItem.quantity} in cart
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
