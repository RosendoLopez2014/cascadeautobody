import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || "https://rcktbuilds.com";
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get("customerId");
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "10";

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders?customer=${customerId}&page=${page}&per_page=${perPage}&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const orders = await response.json();
    const total = response.headers.get("X-WP-Total") || "0";
    const totalPages = response.headers.get("X-WP-TotalPages") || "0";

    return NextResponse.json({
      orders,
      total: parseInt(total),
      totalPages: parseInt(totalPages),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
