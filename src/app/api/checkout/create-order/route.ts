import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || "https://rcktbuilds.com";
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

// Delay helper for MicroBiz sync
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface CreateOrderRequest {
  paymentIntentId: string;
  customerId?: number; // WooCommerce customer ID for logged-in users
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  fulfillmentType: "pickup" | "delivery" | "shipping";
  pickupLocation?: number;
  shippingAddress?: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingCost: number;
  taxAmount: number;
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();
    const {
      paymentIntentId,
      customerId,
      customerInfo,
      fulfillmentType,
      pickupLocation,
      shippingAddress,
      items,
      shippingCost,
    } = body;

    // Build billing address
    const billing = {
      first_name: customerInfo.firstName,
      last_name: customerInfo.lastName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address_1: shippingAddress?.address1 || "",
      address_2: shippingAddress?.address2 || "",
      city: shippingAddress?.city || "Yakima",
      state: shippingAddress?.state || "WA",
      postcode: shippingAddress?.zipCode || "98901",
      country: "US",
    };

    // Build shipping address (same as billing for now)
    const shipping = {
      first_name: customerInfo.firstName,
      last_name: customerInfo.lastName,
      address_1: shippingAddress?.address1 || "",
      address_2: shippingAddress?.address2 || "",
      city: shippingAddress?.city || "Yakima",
      state: shippingAddress?.state || "WA",
      postcode: shippingAddress?.zipCode || "98901",
      country: "US",
    };

    // Build line items
    const lineItems = items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    }));

    // Build shipping lines if applicable
    const shippingLines =
      shippingCost > 0
        ? [
            {
              method_id: fulfillmentType === "delivery" ? "local_delivery" : "flat_rate",
              method_title: fulfillmentType === "delivery" ? "Local Delivery" : "Standard Shipping",
              total: String(shippingCost),
            },
          ]
        : [];

    // Create customer note with fulfillment details
    let customerNote = "";
    if (fulfillmentType === "pickup") {
      const locationName = pickupLocation === 1 ? "Yakima" : "Toppenish";
      customerNote = `Store Pickup at ${locationName} location`;
    } else if (fulfillmentType === "delivery") {
      customerNote = "Local Delivery - Yakima Valley area";
    }

    // Step 1: Create order as "processing" (triggers MicroBiz webhook for full sync)
    const orderData = {
      customer_id: customerId || 0, // Link order to WooCommerce customer for logged-in users
      payment_method: "stripe",
      payment_method_title: "Credit Card (Stripe)",
      set_paid: true,
      status: "processing",
      billing,
      shipping,
      line_items: lineItems,
      shipping_lines: shippingLines,
      customer_note: customerNote,
      meta_data: [
        { key: "_stripe_payment_intent", value: paymentIntentId },
        { key: "_fulfillment_type", value: fulfillmentType },
        { key: "_pickup_location", value: pickupLocation ? String(pickupLocation) : "" },
      ],
    };

    const createUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    const createResponse = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error("WooCommerce order creation failed:", error);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    const order = await createResponse.json();
    console.log(`Order #${order.number} created as processing`);

    // Step 2: Wait for MicroBiz webhook to sync (5 seconds)
    await delay(5000);

    // Step 3: Update order to "completed" (triggers MicroBiz update webhook)
    const updateUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${order.id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });

    if (!updateResponse.ok) {
      console.error("Failed to update order to completed, but order was created");
      // Don't fail the whole request - order was created successfully
    } else {
      console.log(`Order #${order.number} updated to completed`);
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.number,
      status: "completed",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
