import { Suspense } from "react";
import { Metadata } from "next";
import { woocommerce } from "@/lib/woocommerce";
import { ProductGridWithToggle, CategoryFilter, CategoryFilterMobile } from "@/components/shop";
import { LoadingScreen } from "@/components/ui";

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
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          {data.currentSearch
            ? `Search: "${data.currentSearch}"`
            : data.currentCategory
            ? data.categories.find((c) => c.slug === data.currentCategory)
                ?.name || "Shop"
            : "Shop All Products"}
        </h1>
        <p className="text-neutral-600">
          {data.total} product{data.total !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Categories */}
        <aside className="lg:w-64 flex-shrink-0">
          {/* Mobile category filter */}
          <div className="lg:hidden mb-6">
            <Suspense fallback={<div className="h-10 skeleton rounded-md" />}>
              <CategoryFilterMobile
                categories={data.categories}
                selectedCategory={data.currentCategory}
              />
            </Suspense>
          </div>

          {/* Desktop category filter */}
          <div className="hidden lg:block sticky top-24">
            <Suspense fallback={<div className="h-64 skeleton rounded-lg" />}>
              <CategoryFilter
                categories={data.categories}
                selectedCategory={data.currentCategory}
              />
            </Suspense>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
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
        </div>
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
          className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
        >
          Previous
        </a>
      )}

      {startPage > 1 && (
        <>
          <a
            href={createPageUrl(1)}
            className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
          >
            1
          </a>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <a
          key={page}
          href={createPageUrl(page)}
          className={`px-4 py-2 rounded-md transition-colors ${
            page === currentPage
              ? "bg-primary text-white"
              : "border border-neutral-300 hover:bg-neutral-50"
          }`}
        >
          {page}
        </a>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <a
            href={createPageUrl(totalPages)}
            className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
          >
            {totalPages}
          </a>
        </>
      )}

      {currentPage < totalPages && (
        <a
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
        >
          Next
        </a>
      )}
    </nav>
  );
}
