"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }

    // Reset to page 1 when changing category
    params.delete("page");

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-neutral-900">Categories</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => handleCategoryChange(null)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
              !selectedCategory
                ? "bg-primary text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            All Products
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => handleCategoryChange(category.slug)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                selectedCategory === category.slug
                  ? "bg-primary text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              {category.name}
              <span className="ml-2 text-neutral-400">({category.count})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryFilterMobile({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      value={selectedCategory || ""}
      onChange={handleCategoryChange}
      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category.id} value={category.slug}>
          {category.name} ({category.count})
        </option>
      ))}
    </select>
  );
}
