import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || "https://rcktbuilds.com";
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers/${userId}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update customer");
    }

    const customer = await response.json();

    // Return updated user data
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
    console.error("Error updating customer:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update account",
      },
      { status: 500 }
    );
  }
}
