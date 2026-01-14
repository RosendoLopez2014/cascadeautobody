"use client";

import { useState } from "react";
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
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { LOCATIONS } from "@/lib/woocommerce";

type FulfillmentType = "pickup" | "delivery" | "shipping";

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface ShippingAddress {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getItemCount, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("pickup");
  const [pickupLocation, setPickupLocation] = useState<number>(LOCATIONS.YAKIMA.id);
  const [isProcessing, setIsProcessing] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address1: "",
    address2: "",
    city: "",
    state: "WA",
    zipCode: "",
  });

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  // Calculate shipping/delivery costs
  const getShippingCost = () => {
    if (fulfillmentType === "pickup") return 0;
    if (fulfillmentType === "delivery") return subtotal >= 100 ? 0 : 15;
    // Standard shipping - simplified calculation
    return subtotal >= 150 ? 0 : 12.99;
  };

  const shippingCost = getShippingCost();
  const taxRate = 0.085; // 8.5% WA state tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shippingCost + taxAmount;

  // Redirect if cart is empty
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

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    return (
      customerInfo.email &&
      customerInfo.firstName &&
      customerInfo.lastName &&
      customerInfo.phone
    );
  };

  const validateStep2 = () => {
    if (fulfillmentType === "pickup") return true;
    return (
      shippingAddress.address1 &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.zipCode
    );
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // TODO: Create order via WooCommerce API and process payment via Stripe
      // For now, simulate order placement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart and redirect to confirmation
      clearCart();
      router.push("/checkout/confirmation?order=12345");
    } catch (error) {
      console.error("Order placement failed:", error);
      setIsProcessing(false);
    }
  };

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

            {/* Step 2: Fulfillment Options */}
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
                    Fulfillment Method
                  </h2>
                </div>
                {step > 2 && (
                  <button
                    onClick={() => setStep(2)}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 2 && (
                <div className="p-6 space-y-6">
                  {/* Fulfillment Options */}
                  <div className="space-y-3">
                    {/* Store Pickup */}
                    <label
                      className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        fulfillmentType === "pickup"
                          ? "border-primary bg-primary-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value="pickup"
                        checked={fulfillmentType === "pickup"}
                        onChange={() => setFulfillmentType("pickup")}
                        className="mt-1"
                      />
                      <Store className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-neutral-900">
                            Store Pickup
                          </span>
                          <span className="text-green-600 font-medium">Free</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          Pick up at Yakima or Toppenish location
                        </p>
                      </div>
                    </label>

                    {/* Local Delivery */}
                    <label
                      className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        fulfillmentType === "delivery"
                          ? "border-primary bg-primary-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value="delivery"
                        checked={fulfillmentType === "delivery"}
                        onChange={() => setFulfillmentType("delivery")}
                        className="mt-1"
                      />
                      <Truck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-neutral-900">
                            Local Delivery
                          </span>
                          <span
                            className={
                              subtotal >= 100
                                ? "text-green-600 font-medium"
                                : "text-neutral-900"
                            }
                          >
                            {subtotal >= 100 ? "Free" : "$15.00"}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          Same-day delivery in Yakima Valley area
                          {subtotal < 100 && (
                            <span className="block text-xs text-primary mt-1">
                              Free delivery on orders over $100
                            </span>
                          )}
                        </p>
                      </div>
                    </label>

                    {/* Shipping */}
                    <label
                      className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        fulfillmentType === "shipping"
                          ? "border-primary bg-primary-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value="shipping"
                        checked={fulfillmentType === "shipping"}
                        onChange={() => setFulfillmentType("shipping")}
                        className="mt-1"
                      />
                      <Package className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-neutral-900">
                            Standard Shipping
                          </span>
                          <span
                            className={
                              subtotal >= 150
                                ? "text-green-600 font-medium"
                                : "text-neutral-900"
                            }
                          >
                            {subtotal >= 150 ? "Free" : "$12.99"}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          5-7 business days
                          {subtotal < 150 && (
                            <span className="block text-xs text-primary mt-1">
                              Free shipping on orders over $150
                            </span>
                          )}
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Pickup Location Selection */}
                  {fulfillmentType === "pickup" && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-neutral-900">
                        Select Pickup Location
                      </h3>
                      {Object.values(LOCATIONS).map((location) => (
                        <label
                          key={location.id}
                          className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                            pickupLocation === location.id
                              ? "border-primary bg-primary-50"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="pickup-location"
                            value={location.id}
                            checked={pickupLocation === location.id}
                            onChange={() => setPickupLocation(location.id)}
                            className="mt-1"
                          />
                          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-neutral-900">
                              {location.name}
                            </span>
                            <p className="text-sm text-neutral-600">
                              {location.address}
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                              Mon-Fri 8am-5:30pm | Sat 9am-2pm
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Delivery/Shipping Address */}
                  {(fulfillmentType === "delivery" ||
                    fulfillmentType === "shipping") && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-neutral-900">
                        {fulfillmentType === "delivery"
                          ? "Delivery Address"
                          : "Shipping Address"}
                      </h3>
                      <Input
                        label="Street Address"
                        placeholder="123 Main St"
                        value={shippingAddress.address1}
                        onChange={(e) =>
                          handleAddressChange("address1", e.target.value)
                        }
                        required
                      />
                      <Input
                        label="Apartment, suite, etc. (optional)"
                        placeholder="Apt 4B"
                        value={shippingAddress.address2}
                        onChange={(e) =>
                          handleAddressChange("address2", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <Input
                          label="City"
                          placeholder="Yakima"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            handleAddressChange("city", e.target.value)
                          }
                          required
                        />
                        <Input
                          label="State"
                          placeholder="WA"
                          value={shippingAddress.state}
                          onChange={(e) =>
                            handleAddressChange("state", e.target.value)
                          }
                          required
                        />
                        <Input
                          label="ZIP Code"
                          placeholder="98901"
                          value={shippingAddress.zipCode}
                          onChange={(e) =>
                            handleAddressChange("zipCode", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setStep(3)}
                    disabled={!validateStep2()}
                    className="w-full sm:w-auto"
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {step > 2 && (
                <div className="p-4 text-sm text-neutral-600">
                  {fulfillmentType === "pickup" ? (
                    <>
                      Store Pickup at{" "}
                      {pickupLocation === LOCATIONS.YAKIMA.id
                        ? LOCATIONS.YAKIMA.name
                        : LOCATIONS.TOPPENISH.name}
                    </>
                  ) : (
                    <>
                      {fulfillmentType === "delivery"
                        ? "Local Delivery"
                        : "Shipping"}{" "}
                      to {shippingAddress.address1}, {shippingAddress.city},{" "}
                      {shippingAddress.state} {shippingAddress.zipCode}
                    </>
                  )}
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
                  {/* Placeholder for Stripe Elements */}
                  <div className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-neutral-400" />
                      <span className="font-medium text-neutral-900">
                        Credit or Debit Card
                      </span>
                    </div>
                    <div className="space-y-4">
                      <Input
                        label="Card Number"
                        placeholder="4242 4242 4242 4242"
                        disabled={isProcessing}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Expiry Date"
                          placeholder="MM / YY"
                          disabled={isProcessing}
                        />
                        <Input
                          label="CVC"
                          placeholder="123"
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">
                      Your payment information is encrypted and secure. We never
                      store your card details.
                    </p>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>Place Order - {formatPrice(total)}</>
                    )}
                  </Button>
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
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    {fulfillmentType === "pickup"
                      ? "Store Pickup"
                      : fulfillmentType === "delivery"
                      ? "Local Delivery"
                      : "Shipping"}
                  </span>
                  <span
                    className={
                      shippingCost === 0
                        ? "text-green-600 font-medium"
                        : "text-neutral-900"
                    }
                  >
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
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
