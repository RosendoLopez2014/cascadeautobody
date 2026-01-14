"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, MapPin, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || "Unknown";

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        Thank You for Your Order!
      </h1>
      <p className="text-lg text-neutral-600 mb-2">
        Your order has been confirmed and is being processed.
      </p>
      <p className="text-neutral-500 mb-8">
        Order Number: <span className="font-mono font-semibold">#{orderId}</span>
      </p>

      {/* Order Status Card */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8 text-left">
        <h2 className="font-semibold text-neutral-900 mb-4">What&apos;s Next?</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">
                Confirmation Email
              </h3>
              <p className="text-sm text-neutral-600">
                We&apos;ve sent a confirmation email with your order details.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">
                Order Processing
              </h3>
              <p className="text-sm text-neutral-600">
                Our team is preparing your order for fulfillment.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">
                Ready for Pickup/Delivery
              </h3>
              <p className="text-sm text-neutral-600">
                We&apos;ll notify you when your order is ready.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-neutral-100 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-neutral-900 mb-3">
          Questions About Your Order?
        </h3>
        <p className="text-neutral-600 text-sm mb-4">
          Contact us at your preferred location:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+15099728989"
            className="text-primary hover:underline font-medium"
          >
            Yakima: (509) 972-8989
          </a>
          <span className="hidden sm:block text-neutral-400">|</span>
          <a
            href="tel:+15098658544"
            className="text-primary hover:underline font-medium"
          >
            Toppenish: (509) 865-8544
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/account/orders">
          <Button variant="outline">View Order History</Button>
        </Link>
        <Link href="/shop">
          <Button>
            Continue Shopping
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-16">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto text-center animate-pulse">
            <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-8" />
            <div className="h-8 bg-neutral-200 rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-neutral-200 rounded w-48 mx-auto" />
          </div>
        }>
          <ConfirmationContent />
        </Suspense>
      </div>
    </div>
  );
}
