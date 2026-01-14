import { NextRequest, NextResponse } from "next/server";
import { stripe, formatAmountForStripe } from "@/lib/stripe";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CreatePaymentIntentRequest {
  items: CartItem[];
  shippingCost: number;
  taxAmount: number;
  customerEmail: string;
  metadata?: {
    fulfillmentType: string;
    pickupLocation?: string;
    shippingAddress?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentIntentRequest = await request.json();
    const { items, shippingCost, taxAmount, customerEmail, metadata } = body;

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    // Calculate total
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + shippingCost + taxAmount;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(total),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: customerEmail,
      metadata: {
        fulfillmentType: metadata?.fulfillmentType || "unknown",
        pickupLocation: metadata?.pickupLocation || "",
        shippingAddress: metadata?.shippingAddress || "",
        itemCount: String(items.length),
        subtotal: String(subtotal),
        shippingCost: String(shippingCost),
        taxAmount: String(taxAmount),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
