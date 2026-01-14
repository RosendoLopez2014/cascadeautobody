import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { woocommerce } from "@/lib/woocommerce";
import { ProductGridWithToggle } from "@/components/shop";
import { LoadingScreen } from "@/components/ui";
import { Package, ChevronRight, Grid3X3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our selection of auto body and paint supplies. Professional-grade products for collision repair and painting.",
};

// Disable caching to always show fresh products
export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: {
    page?: string;
    category?: string;
    search?: string;
    sort?: string;
  };
}

async function getProducts(searchParams: ShopPageProps["searchParams"]) {
  const page = parseInt(searchParams.page || "1");
  const categorySlug = searchParams.category;
  const search = searchParams.search;

  // Get categories first
  const categories = await woocommerce.getCategories({ hide_empty: true });

  // Find category ID from slug
  const category = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : undefined;

  const result = await woocommerce.getProducts({
    page,
    per_page: 20,
    search,
    category: category?.id,
  });

  return {
    ...result,
    categories,
    currentCategory: categorySlug,
    currentSearch: search,
    currentPage: page,
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const data = await getProducts(searchParams);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {data.currentSearch
                  ? `Search: "${data.currentSearch}"`
                  : data.currentCategory
                  ? data.categories.find((c) => c.slug === data.currentCategory)?.name || "Shop"
                  : "Shop"}
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                {data.total} product{data.total !== 1 ? "s" : ""} available
              </p>
            </div>

            {/* Breadcrumb when in category */}
            {data.currentCategory && (
              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary transition-colors"
              >
                <Grid3X3 className="h-4 w-4" />
                All Categories
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Pills */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <Link
              href="/shop"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                !data.currentCategory
                  ? "bg-primary text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary hover:text-primary"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              All Products
            </Link>
            {data.categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  data.currentCategory === category.slug
                    ? "bg-primary text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary hover:text-primary"
                }`}
              >
                {category.name}
                <span className="text-xs opacity-70">({category.count})</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Products */}
        <Suspense fallback={<LoadingScreen message="Loading products..." />}>
          <ProductGridWithToggle products={data.products} />
        </Suspense>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            searchParams={searchParams}
          />
        )}

        {/* Empty State */}
        {data.products.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No products found
            </h3>
            <p className="text-neutral-500 mb-6">
              {data.currentSearch
                ? `No results for "${data.currentSearch}"`
                : "This category is empty"}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Browse all products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: ShopPageProps["searchParams"];
}) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.sort) params.set("sort", searchParams.sort);
    params.set("page", String(page));
    return `/shop?${params.toString()}`;
  };

  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-12">
      {currentPage > 1 && (
        <a
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors text-sm"
        >
          Previous
        </a>
      )}

      {startPage > 1 && (
        <>
          <a
            href={createPageUrl(1)}
            className="px-4 py-2 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors text-sm"
          >
            1
          </a>
          {startPage > 2 && <span className="px-2 text-neutral-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <a
          key={page}
          href={createPageUrl(page)}
          className={`px-4 py-2 rounded-md transition-colors text-sm ${
            page === currentPage
              ? "bg-primary text-white"
              : "bg-white border border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          {page}
        </a>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-neutral-400">...</span>}
          <a
            href={createPageUrl(totalPages)}
            className="px-4 py-2 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors text-sm"
          >
            {totalPages}
          </a>
        </>
      )}

      {currentPage < totalPages && (
        <a
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors text-sm"
        >
          Next
        </a>
      )}
    </nav>
  );
}
