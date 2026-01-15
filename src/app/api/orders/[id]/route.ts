import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || "https://rcktbuilds.com";
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }
      throw new Error("Failed to fetch order");
    }

    const order = await response.json();

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
