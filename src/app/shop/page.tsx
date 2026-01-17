import { Metadata } from "next";
import { woocommerce } from "@/lib/woocommerce";
import { ShopPageClient } from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our selection of auto body and paint supplies. Professional-grade products for collision repair and painting.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const categories = await woocommerce.getCategories({ hide_empty: true });

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
    <ShopPageClient
      data={data}
      searchParams={searchParams}
    />
  );
}
