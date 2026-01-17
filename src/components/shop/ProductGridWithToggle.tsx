"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import { ViewToggle } from "./ViewToggle";
import {
  ProductCardCompact,
  ProductCardDetailed,
  ProductCardList,
  ProductCardHero,
  ProductViewType,
} from "./ProductCardVariants";
import { cn } from "@/lib/utils";
import { useSafeLocationId } from "@/hooks/useSafeLocation";

interface ProductGridWithToggleProps {
  products: Product[];
  loading?: boolean;
}

// Grid layout classes for each view type
const gridClasses: Record<ProductViewType, string> = {
  compact: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3",
  detailed: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
  list: "flex flex-col gap-4",
  hero: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
};

// Card components for each view type
const CardComponents: Record<ProductViewType, React.ComponentType<{ product: Product }>> = {
  compact: ProductCardCompact,
  detailed: ProductCardDetailed,
  list: ProductCardList,
  hero: ProductCardHero,
};

export function ProductGridWithToggle({ products, loading }: ProductGridWithToggleProps) {
  const [viewType, setViewType] = useState<ProductViewType>("detailed");
  const { locationId: selectedLocationId, mounted } = useSafeLocationId();

  // Categorize and sort products
  const categorizedProducts = useMemo(() => {
    // Get stock for each product
    const productsWithStock = products.map((product) => {
      const yakimaStock = product.inventory_by_location?.find(loc => loc.location_id === 1)?.stock_quantity ?? 0;
      const toppenishStock = product.inventory_by_location?.find(loc => loc.location_id === 2)?.stock_quantity ?? 0;
      return { product, yakimaStock, toppenishStock };
    });

    // Separate in-stock and out-of-stock products
    const inStockProducts = productsWithStock.filter(
      ({ yakimaStock, toppenishStock }) => yakimaStock > 0 || toppenishStock > 0
    );

    const outOfStockProducts = productsWithStock.filter(
      ({ yakimaStock, toppenishStock }) => yakimaStock === 0 && toppenishStock === 0
    );

    // Categorize in-stock products based on selected location
    const onlySelected: typeof inStockProducts = [];
    const inBoth: typeof inStockProducts = [];
    const onlyOther: typeof inStockProducts = [];

    inStockProducts.forEach((item) => {
      const { yakimaStock, toppenishStock } = item;

      if (selectedLocationId === 1) {
        // Yakima selected
        if (yakimaStock > 0 && toppenishStock === 0) {
          onlySelected.push(item);
        } else if (yakimaStock > 0 && toppenishStock > 0) {
          inBoth.push(item);
        } else if (yakimaStock === 0 && toppenishStock > 0) {
          onlyOther.push(item);
        }
      } else {
        // Toppenish selected
        if (toppenishStock > 0 && yakimaStock === 0) {
          onlySelected.push(item);
        } else if (toppenishStock > 0 && yakimaStock > 0) {
          inBoth.push(item);
        } else if (toppenishStock === 0 && yakimaStock > 0) {
          onlyOther.push(item);
        }
      }
    });

    return {
      onlySelected: onlySelected.map(({ product }) => product),
      inBoth: inBoth.map(({ product }) => product),
      onlyOther: onlyOther.map(({ product }) => product),
      outOfStock: outOfStockProducts.map(({ product }) => product),
      totalCount: inStockProducts.length,
      totalProducts: products.length,
    };
  }, [products, selectedLocationId]);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-end mb-6">
          <ViewToggle currentView={viewType} onViewChange={setViewType} />
        </div>
        <div className={gridClasses[viewType]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} viewType={viewType} />
          ))}
        </div>
      </div>
    );
  }

  if (categorizedProducts.totalProducts === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-1">No products found</h3>
        <p className="text-neutral-500">
          No products available
        </p>
      </div>
    );
  }

  const CardComponent = CardComponents[viewType];
  const { onlySelected, inBoth, onlyOther, outOfStock, totalCount } = categorizedProducts;
  const otherLocationName = selectedLocationId === 1 ? "Toppenish" : "Yakima";

  // Don't render sorted/categorized view until mounted to prevent hydration issues
  if (!mounted) {
    const allProducts = [...onlySelected, ...inBoth, ...onlyOther, ...outOfStock];
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-neutral-500">
            {totalCount} product{totalCount !== 1 ? "s" : ""} in stock
          </p>
          <ViewToggle currentView={viewType} onViewChange={setViewType} />
        </div>
        <div className={cn(gridClasses[viewType], "transition-all duration-300")}>
          {allProducts.map((product) => (
            <CardComponent key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with view toggle */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">
          {totalCount} product{totalCount !== 1 ? "s" : ""} in stock
        </p>
        <ViewToggle currentView={viewType} onViewChange={setViewType} />
      </div>

      {/* Products at selected location and both locations - combined for continuous grid */}
      {(onlySelected.length > 0 || inBoth.length > 0) && (
        <div className={cn(gridClasses[viewType], "transition-all duration-300 mb-8")}>
          {onlySelected.map((product) => (
            <CardComponent key={product.id} product={product} />
          ))}
          {inBoth.map((product) => (
            <CardComponent key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Divider for other location */}
      {onlyOther.length > 0 && (
        <>
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-neutral-200"></div>
            <h3 className="text-lg font-medium text-neutral-600 uppercase tracking-wide">
              In stock at {otherLocationName}
            </h3>
            <div className="flex-1 h-px bg-neutral-200"></div>
          </div>

          {/* Products at other location only */}
          <div className={cn(gridClasses[viewType], "transition-all duration-300")}>
            {onlyOther.map((product) => (
              <CardComponent key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Divider for out of stock products */}
      {outOfStock.length > 0 && (
        <>
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-neutral-200"></div>
            <h3 className="text-lg font-medium text-neutral-600 uppercase tracking-wide">
              Out of Stock
            </h3>
            <div className="flex-1 h-px bg-neutral-200"></div>
          </div>

          {/* Out of stock products */}
          <div className={cn(gridClasses[viewType], "transition-all duration-300")}>
            {outOfStock.map((product) => (
              <CardComponent key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Skeleton for different view types
function ProductCardSkeleton({ viewType }: { viewType: ProductViewType }) {
  if (viewType === "compact") {
    return (
      <div className="bg-white rounded border border-neutral-100 overflow-hidden">
        <div className="aspect-[4/3] bg-neutral-100 animate-pulse" />
        <div className="p-3 space-y-2">
          <div className="h-4 w-full bg-neutral-100 animate-pulse rounded" />
          <div className="h-4 w-16 bg-neutral-100 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (viewType === "list") {
    return (
      <div className="flex bg-white rounded-lg border border-neutral-100 overflow-hidden">
        <div className="w-32 sm:w-40 md:w-48 bg-neutral-100 animate-pulse" />
        <div className="flex-1 p-4 space-y-3">
          <div className="h-3 w-24 bg-neutral-100 animate-pulse rounded" />
          <div className="h-5 w-3/4 bg-neutral-100 animate-pulse rounded" />
          <div className="h-4 w-full bg-neutral-100 animate-pulse rounded" />
          <div className="h-6 w-20 bg-neutral-100 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (viewType === "hero") {
    return (
      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <div className="aspect-[4/5] bg-neutral-100 animate-pulse" />
        <div className="p-5 space-y-3">
          <div className="h-3 w-16 bg-neutral-100 animate-pulse rounded" />
          <div className="h-6 w-full bg-neutral-100 animate-pulse rounded" />
          <div className="h-6 w-20 bg-neutral-100 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  // detailed (default)
  return (
    <div className="bg-white rounded-lg border border-neutral-100 overflow-hidden">
      <div className="aspect-square bg-neutral-100 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-neutral-100 animate-pulse rounded" />
          <div className="h-3 w-12 bg-neutral-100 animate-pulse rounded" />
        </div>
        <div className="h-5 w-full bg-neutral-100 animate-pulse rounded" />
        <div className="h-6 w-20 bg-neutral-100 animate-pulse rounded" />
        <div className="flex gap-3">
          <div className="h-4 w-20 bg-neutral-100 animate-pulse rounded" />
          <div className="h-4 w-24 bg-neutral-100 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
