import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 text-lg">No products found</p>
        <p className="text-neutral-400 mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton" />
        <div className="h-5 w-full skeleton" />
        <div className="h-5 w-2/3 skeleton" />
        <div className="h-6 w-20 skeleton" />
        <div className="space-y-1">
          <div className="h-4 w-24 skeleton" />
          <div className="h-4 w-28 skeleton" />
        </div>
      </div>
    </div>
  );
}
