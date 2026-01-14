"use client";

import { useState } from "react";
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

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-1">No products found</h3>
        <p className="text-neutral-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  const CardComponent = CardComponents[viewType];

  return (
    <div>
      {/* Header with view toggle */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        <ViewToggle currentView={viewType} onViewChange={setViewType} />
      </div>

      {/* Products grid */}
      <div className={cn(gridClasses[viewType], "transition-all duration-300")}>
        {products.map((product) => (
          <CardComponent key={product.id} product={product} />
        ))}
      </div>
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
