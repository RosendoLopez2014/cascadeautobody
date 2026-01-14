import { NextRequest, NextResponse } from "next/server";
import { woocommerce } from "@/lib/woocommerce";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "20");
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category")
      ? parseInt(searchParams.get("category")!)
      : undefined;
    const orderby = searchParams.get("orderby") || undefined;
    const order = (searchParams.get("order") as "asc" | "desc") || undefined;
    const stockStatusParam = searchParams.get("stock_status");
    const stock_status = stockStatusParam && ["instock", "outofstock", "onbackorder"].includes(stockStatusParam)
      ? (stockStatusParam as "instock" | "outofstock" | "onbackorder")
      : undefined;

    const result = await woocommerce.getProducts({
      page,
      per_page,
      search,
      category,
      orderby,
      order,
      stock_status,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
