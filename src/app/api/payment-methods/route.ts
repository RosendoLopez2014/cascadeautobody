import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// GET - List payment methods for a customer
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ paymentMethods: [], customerId: null });
    }

    const customerId = customers.data[0].id;

    // Get payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    // Get default payment method
    const customer = await stripe.customers.retrieve(customerId);
    const defaultPaymentMethod =
      typeof customer !== "string" && !customer.deleted
        ? customer.invoice_settings?.default_payment_method
        : null;

    const formattedMethods = paymentMethods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand || "unknown",
      last4: pm.card?.last4 || "****",
      expMonth: pm.card?.exp_month || 0,
      expYear: pm.card?.exp_year || 0,
      isDefault: pm.id === defaultPaymentMethod,
    }));

    return NextResponse.json({
      paymentMethods: formattedMethods,
      customerId,
    });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a payment method
export async function DELETE(request: NextRequest) {
  try {
    const { paymentMethodId } = await request.json();

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      );
    }

    await stripe.paymentMethods.detach(paymentMethodId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json(
      { error: "Failed to delete payment method" },
      { status: 500 }
    );
  }
}

// PUT - Set default payment method
export async function PUT(request: NextRequest) {
  try {
    const { customerId, paymentMethodId } = await request.json();

    if (!customerId || !paymentMethodId) {
      return NextResponse.json(
        { error: "Customer ID and payment method ID are required" },
        { status: 400 }
      );
    }

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting default payment method:", error);
    return NextResponse.json(
      { error: "Failed to set default payment method" },
      { status: 500 }
    );
  }
}
