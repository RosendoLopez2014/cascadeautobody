"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight, Grid3X3 } from "lucide-react";
import { ProductGridWithToggle } from "@/components/shop";
import { LoadingScreen } from "@/components/ui";
import { FadeIn, TextReveal } from "@/components/motion";
import { Category, Product } from "@/types";

interface ShopPageClientProps {
  data: {
    products: Product[];
    total: number;
    totalPages: number;
    categories: Category[];
    currentCategory?: string;
    currentSearch?: string;
    currentPage: number;
  };
  searchParams: {
    page?: string;
    category?: string;
    search?: string;
    sort?: string;
  };
}

export function ShopPageClient({ data, searchParams }: ShopPageClientProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <FadeIn direction="up" delay={0}>
                <h1 className="text-display-xs md:text-display-sm font-bold text-neutral-900">
                  {data.currentSearch
                    ? `Search: "${data.currentSearch}"`
                    : data.currentCategory
                    ? data.categories.find((c) => c.slug === data.currentCategory)?.name || "Shop"
                    : "Shop"}
                </h1>
              </FadeIn>
              <FadeIn direction="up" delay={0.1}>
                <p className="text-neutral-500 mt-2">
                  <motion.span
                    key={data.total}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block"
                  >
                    {data.total} product{data.total !== 1 ? "s" : ""} available
                  </motion.span>
                </p>
              </FadeIn>
            </div>

            {/* Breadcrumb when in category */}
            <AnimatePresence>
              {data.currentCategory && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary transition-colors group"
                  >
                    <Grid3X3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>All Categories</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Pills */}
        <FadeIn direction="up" delay={0.15}>
          <div className="mb-8 overflow-x-auto scrollbar-hide">
            <motion.div
              className="flex gap-2 pb-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.03 } },
              }}
            >
              <CategoryPill
                href="/shop"
                label="All Products"
                icon={<Grid3X3 className="h-4 w-4" />}
                isActive={!data.currentCategory}
              />
              {data.categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  label={category.name}
                  count={category.count}
                  isActive={data.currentCategory === category.slug}
                />
              ))}
            </motion.div>
          </div>
        </FadeIn>

        {/* Products */}
        <Suspense fallback={<LoadingScreen message="Loading products..." />}>
          <ProductGridWithToggle products={data.products} />
        </Suspense>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <FadeIn direction="up" delay={0.2}>
            <Pagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              searchParams={searchParams}
            />
          </FadeIn>
        )}

        {/* Empty State */}
        <AnimatePresence>
          {data.products.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Package className="h-16 w-16 mx-auto text-neutral-300 mb-6" />
              </motion.div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No products found
              </h3>
              <p className="text-neutral-500 mb-6">
                {data.currentSearch
                  ? `No results for "${data.currentSearch}"`
                  : "This category is empty"}
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Browse all products
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Category Pill Component
function CategoryPill({
  href,
  label,
  icon,
  count,
  isActive,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  isActive: boolean;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Link href={href}>
        <motion.div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            isActive
              ? "bg-primary text-white"
              : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary hover:text-primary"
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          layout
        >
          {icon}
          {label}
          {count !== undefined && (
            <span className={`text-xs ${isActive ? "opacity-70" : "text-neutral-400"}`}>
              ({count})
            </span>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: ShopPageClientProps["searchParams"];
}) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.sort) params.set("sort", searchParams.sort);
    params.set("page", String(page));
    return `/shop?${params.toString()}`;
  };

  const pages: number[] = [];
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
        <motion.a
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Previous
        </motion.a>
      )}

      {startPage > 1 && (
        <>
          <motion.a
            href={createPageUrl(1)}
            className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            1
          </motion.a>
          {startPage > 2 && <span className="px-2 text-neutral-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <motion.a
          key={page}
          href={createPageUrl(page)}
          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            page === currentPage
              ? "bg-primary text-white"
              : "bg-white border border-neutral-200 hover:bg-neutral-50"
          }`}
          whileHover={{ scale: page === currentPage ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {page}
        </motion.a>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-neutral-400">...</span>}
          <motion.a
            href={createPageUrl(totalPages)}
            className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {totalPages}
          </motion.a>
        </>
      )}

      {currentPage < totalPages && (
        <motion.a
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          Next
        </motion.a>
      )}
    </nav>
  );
}
