import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || "https://rcktbuilds.com";
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const checkUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(
      email
    )}&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    const checkResponse = await fetch(checkUrl, { cache: "no-store" });
    const existingCustomers = await checkResponse.json();

    if (existingCustomers.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create new customer
    const createUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    const createResponse = await fetch(createUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        username: email.split("@")[0] + Math.random().toString(36).slice(2, 6),
        billing: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone || "",
        },
      }),
      cache: "no-store",
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(errorData.message || "Failed to create customer");
    }

    const customer = await createResponse.json();

    // Return user data
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

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
