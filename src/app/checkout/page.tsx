"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Store,
  Truck,
  Package,
  MapPin,
  Check,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { StripeProvider, PaymentForm, CartItemWithFulfillment } from "@/components/checkout";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useLocationStore } from "@/stores/locationStore";
import { formatPrice } from "@/lib/utils";


interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}


export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getItemCount, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  // Get selected store from header
  const selectedLocationId = useLocationStore((state) => state.selectedLocationId);

  const [step, setStep] = useState(1);
  const updateItemFulfillment = useCartStore((state) => state.updateItemFulfillment);
  const updateItemShippingCost = useCartStore((state) => state.updateItemShippingCost);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });


  // Auto-fill user info when logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerInfo({
        email: user.email || "",
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        phone: user.billing?.phone || "",
      });
    }
  }, [isAuthenticated, user]);

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  // Check if there are items needing shipping cost calculation
  const itemsNeedingShippingCalculation = items.filter(
    (item) => item.fulfillment?.method === "shipping" && item.shippingCost === undefined
  );
  const hasItemsNeedingShippingCalculation = itemsNeedingShippingCalculation.length > 0;

  // Calculate total shipping from all items with their individual fulfillment
  const getShippingCost = () => {
    return items.reduce((total, item) => {
      if (item.fulfillment?.method === "pickup" || item.fulfillment?.method === "delivery") {
        return total;
      }
      if (item.fulfillment?.method === "shipping" && item.shippingCost !== undefined) {
        return total + item.shippingCost;
      }
      return total;
    }, 0);
  };

  const shippingCost = getShippingCost();
  const taxRate = 0.085; // 8.5% WA state tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shippingCost + taxAmount;

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    return (
      customerInfo.email &&
      customerInfo.firstName &&
      customerInfo.lastName &&
      customerInfo.phone
    );
  };


  const handleCalculateShipping = () => {
    // Calculate shipping for items needing it
    // Using standard shipping rate: $12.99 for orders under $150, free for $150+
    const shippingRate = subtotal >= 150 ? 0 : 12.99;

    itemsNeedingShippingCalculation.forEach((item) => {
      updateItemShippingCost(item.product.id, shippingRate);
    });
  };

  // Fetch payment intent when reaching step 3 (React Best Practice 5.3)
  // Use functional pattern to avoid stale closures
  const fetchPaymentIntent = useCallback(async () => {
    try {
      const response = await fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: parseFloat(item.product.price),
            quantity: item.quantity,
            fulfillment: item.fulfillment,
            shippingCost: item.shippingCost,
          })),
          shippingCost,
          taxAmount,
          customerEmail: customerInfo.email,
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setPaymentError("Failed to initialize payment");
      }
    } catch (error) {
      console.error("Error fetching payment intent:", error);
      setPaymentError("Failed to initialize payment");
    }
  }, [items, shippingCost, taxAmount, customerInfo.email]);

  // Trigger payment intent fetch when reaching step 3
  useEffect(() => {
    if (step === 3 && !clientSecret && items.length > 0) {
      fetchPaymentIntent();
    }
  }, [step, clientSecret, items.length, fetchPaymentIntent]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsProcessing(true);

    try {
      // Create order in WooCommerce (will auto-complete for MicroBiz sync)
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          customerId: user?.id, // Link order to logged-in user
          customerInfo,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: parseFloat(item.product.price),
            quantity: item.quantity,
            fulfillment: item.fulfillment,
            shippingCost: item.shippingCost,
          })),
          shippingCost,
          taxAmount,
          total,
        }),
      });

      const data = await response.json();

      if (data.orderId) {
        clearCart();
        router.push(`/checkout/confirmation?order=${data.orderNumber}`);
      } else {
        setPaymentError("Order creation failed. Please contact support.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      setPaymentError("Order creation failed. Please contact support.");
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setIsProcessing(false);
  };

  // Redirect if cart is empty (must be after all hooks)
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Your cart is empty
        </h1>
        <p className="text-neutral-600 mb-8">
          Add some items to your cart before checking out.
        </p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/cart"
              className="flex items-center text-neutral-600 hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Cart
            </Link>
            <h1 className="text-xl font-semibold text-neutral-900">Checkout</h1>
            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Customer Information */}
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 1
                        ? "bg-primary text-white"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {step > 1 ? <Check className="h-4 w-4" /> : "1"}
                  </span>
                  <h2 className="font-semibold text-neutral-900">
                    Customer Information
                  </h2>
                </div>
                {step > 1 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 1 && (
                <div className="p-6 space-y-4">
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    value={customerInfo.email}
                    onChange={(e) =>
                      handleCustomerInfoChange("email", e.target.value)
                    }
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      placeholder="John"
                      value={customerInfo.firstName}
                      onChange={(e) =>
                        handleCustomerInfoChange("firstName", e.target.value)
                      }
                      required
                    />
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      value={customerInfo.lastName}
                      onChange={(e) =>
                        handleCustomerInfoChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <Input
                    type="tel"
                    label="Phone Number"
                    placeholder="(509) 123-4567"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      handleCustomerInfoChange("phone", e.target.value)
                    }
                    required
                  />
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!validateStep1()}
                    className="w-full sm:w-auto"
                  >
                    Continue to Fulfillment
                  </Button>
                </div>
              )}

              {step > 1 && (
                <div className="p-4 text-sm text-neutral-600">
                  {customerInfo.firstName} {customerInfo.lastName} &bull;{" "}
                  {customerInfo.email}
                </div>
              )}
            </div>

            {/* Step 2: Item Fulfillment Selection */}
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 2
                        ? "bg-primary text-white"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {step > 2 ? <Check className="h-4 w-4" /> : "2"}
                  </span>
                  <h2 className="font-semibold text-neutral-900">
                    Item Fulfillment
                  </h2>
                </div>
              </div>

              {step === 2 && (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItemWithFulfillment
                        key={item.product.id}
                        item={item}
                        onFulfillmentChange={(fulfillment) =>
                          updateItemFulfillment(item.product.id, fulfillment)
                        }
                      />
                    ))}
                  </div>

                  {hasItemsNeedingShippingCalculation && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        Please calculate shipping costs for all items before continuing.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {hasItemsNeedingShippingCalculation ? (
                      <Button
                        onClick={handleCalculateShipping}
                        className="w-full sm:w-auto"
                      >
                        Calculate Shipping Costs
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setStep(3)}
                        className="w-full sm:w-auto"
                      >
                        Continue to Payment
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {step > 2 && (
                <div className="p-4 text-sm text-neutral-600">
                  {items.length} item{items.length !== 1 ? "s" : ""} configured
                </div>
              )}
            </div>

            {/* Step 3: Payment */}
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 3
                      ? "bg-primary text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  3
                </span>
                <h2 className="font-semibold text-neutral-900">Payment</h2>
              </div>

              {step === 3 && (
                <div className="p-6 space-y-6">
                  {paymentError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{paymentError}</p>
                    </div>
                  )}

                  {clientSecret ? (
                    <StripeProvider clientSecret={clientSecret}>
                      <PaymentForm
                        total={total}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </StripeProvider>
                  ) : (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3" />
                      <span className="text-neutral-600">Loading payment form...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-neutral-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <ul className="space-y-3 mb-6">
                {items.map((item) => {
                  const mainImage = item.product.images[0];
                  const price = parseFloat(item.product.price);
                  return (
                    <li key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {mainImage ? (
                          <Image
                            src={mainImage.src}
                            alt={mainImage.alt || item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-neutral-300" />
                          </div>
                        )}
                        <span className="absolute -top-1 -right-1 bg-neutral-700 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-neutral-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {formatPrice(item.product.price)} each
                        </p>
                      </div>
                      <span className="text-sm font-medium text-neutral-900">
                        {formatPrice(String(price * item.quantity))}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Totals */}
              <div className="space-y-2 border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="text-neutral-900">{formatPrice(subtotal)}</span>
                </div>
                {shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="text-neutral-900">
                      {formatPrice(shippingCost)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Tax (8.5%)</span>
                  <span className="text-neutral-900">{formatPrice(taxAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between font-semibold text-lg border-t border-neutral-200 pt-4 mt-4">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
