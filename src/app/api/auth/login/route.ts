import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || "https://rcktbuilds.com";
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Search for customer by email
    const searchUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(
      email
    )}&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    const searchResponse = await fetch(searchUrl, { cache: "no-store" });

    if (!searchResponse.ok) {
      throw new Error("Failed to search customers");
    }

    const customers = await searchResponse.json();

    if (customers.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // For demo purposes, we're using a simplified auth
    // In production, you would validate against WordPress user credentials
    // using JWT Auth plugin or similar
    const customer = customers[0];

    // Note: WooCommerce REST API doesn't expose passwords
    // You would need to implement proper JWT authentication
    // For now, we'll simulate successful login if customer exists

    // Return user data (excluding sensitive info)
    const user = {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      username: customer.username,
      role: customer.role,
      billing: customer.billing,
      shipping: customer.shipping,
      is_paying_customer: customer.is_paying_customer,
      avatar_url: customer.avatar_url,
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
